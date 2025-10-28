import streamlit as st
import tempfile
import os
import re
import base64
from collections import Counter
import numpy as np
from langchain_community.llms import Ollama
from langchain.chains import ConversationChain, ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import FAISS
import matplotlib.pyplot as plt
from wordcloud import WordCloud
import pandas as pd

# Function to get base64 encoding of an image
def get_base64_of_image(image_path):
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode()
    return encoded_string

# Functions to apply background images
def add_bg_from_local(image_path, element_selector):
    """Add a background image to a specific Streamlit element"""
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode()
    
    style = f"""
    <style>
    {element_selector} {{
        background-image: url(data:image/png;base64,{encoded_string});
        background-size: 120% auto;
        background-position: center;
        padding: 20px;
        border-radius: 10px;
        color: white;
        text-shadow: 1px 1px 2px black;
    }}
    </style>
    """
    
    st.markdown(style, unsafe_allow_html=True)

# Set page configuration
st.set_page_config(
    page_title="Assistant to Theology Studies",
    page_icon="📚",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Create a directory for the images if it doesn't exist
image_dir = "images"
os.makedirs(image_dir, exist_ok=True)

# Paths to the image files
nineveh_path = os.path.join(image_dir, "Nineveh.jpg")
bible_path = os.path.join(image_dir, "3d_geneva_bible.jpg")

# Check if images exist, if not create placeholder text
nineveh_exists = os.path.exists(nineveh_path)
bible_exists = os.path.exists(bible_path)

if nineveh_exists and bible_exists:
    # Apply background image styles
    add_bg_from_local(nineveh_path, ".nineveh-bg")
    add_bg_from_local(bible_path, ".bible-bg")

# Custom CSS for styling
st.markdown("""
<style>
    .main-title {
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: #1E3A8A;
    }
    .theology-subtitle {
        text-align: center;
        font-size: 1.2rem;
        margin-bottom: 2rem;
        color: #4B5563;
    }
    .parameter-info {
        background-color: #F3F4F6;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
    }
    .parameter-title {
        font-weight: bold;
        color: #1E3A8A;
    }
    .chat-area {
        background-color: rgba(255, 255, 255, 0.85);
        padding: 20px;
        border-radius: 10px;
        margin-top: 10px;
    }
    .stChatMessage {
        background-color: white !important;
    }
</style>
""", unsafe_allow_html=True)

def generate_wordcloud(text):
    """Generate a word cloud from the text"""
    # Preprocess text
    # Remove common stopwords
    stopwords = set(['and', 'the', 'to', 'of', 'in', 'a', 'is', 'that', 'it', 'with', 'as', 'for', 
                    'was', 'on', 'are', 'be', 'this', 'by', 'an', 'not', 'or', 'at', 'from', 'but',
                    'what', 'all', 'were', 'when', 'we', 'there', 'can', 'no', 'have', 'has', 'had',
                    'they', 'you', 'he', 'she', 'which', 'their', 'would', 'could', 'how', 'if', 'will'])
    
    # Tokenize and filter
    words = re.findall(r'\b[a-zA-Z]{3,15}\b', text.lower())
    filtered_words = [word for word in words if word not in stopwords]
    
    # Count word frequencies
    word_counts = Counter(filtered_words)
    
    # Generate word cloud
    if not word_counts:
        return None, pd.DataFrame(columns=['Word', 'Frequency'])
    
    wordcloud = WordCloud(
        width=800, 
        height=400, 
        background_color='white',
        max_words=100,
        colormap='viridis',
        contour_width=1,
        contour_color='steelblue'
    ).generate_from_frequencies(word_counts)
    
    # Create dataframe for top words
    top_words = pd.DataFrame(word_counts.most_common(20), columns=['Word', 'Frequency'])
    
    return wordcloud, top_words

def extract_text_from_documents(documents):
    """Extract text from document objects"""
    return " ".join([doc.page_content for doc in documents])

def process_document(uploaded_file):
    """Process the uploaded document and return a document retriever and documents"""
    # Create a temporary file
    temp_file_path = None
    try:
        # Create a temporary file manually without using context manager
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=f".{uploaded_file.name.split('.')[-1]}")
        temp_file_path = temp_file.name
        temp_file.write(uploaded_file.getvalue())
        temp_file.close()  # Close the file handle
        
        # Select the appropriate loader based on file type
        file_extension = uploaded_file.name.split('.')[-1].lower()
        
        if file_extension == 'pdf':
            loader = PyPDFLoader(temp_file_path)
        elif file_extension in ['docx', 'doc']:
            loader = Docx2txtLoader(temp_file_path)
        elif file_extension in ['txt', 'md']:
            loader = TextLoader(temp_file_path)
        else:
            st.error(f"Unsupported file format: {file_extension}")
            os.unlink(temp_file_path)
            return None, None
        
        # Load the document
        documents = loader.load()
        
        # Split the documents into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100
        )
        chunks = text_splitter.split_documents(documents)
        
        # Create embeddings and vectorstore
        embeddings = OllamaEmbeddings(model=st.session_state.model)
        vectorstore = FAISS.from_documents(chunks, embeddings)
        
        # Clean up the temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        
        return vectorstore.as_retriever(), documents
    
    except Exception as e:
        st.error(f"Error processing document: {str(e)}")
        # Clean up the temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        return None, None

def on_params_change():
    """Callback when parameters are changed"""
    st.session_state.params_changed = True

def show_parameter_info():
    """Show information about temperature and top-p parameters"""
    with st.expander("🧠 Understanding Model Parameters", expanded=False):
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("<p class='parameter-title'>Temperature</p>", unsafe_allow_html=True)
            st.markdown("""
            **What it is:** Controls randomness in the model's responses.
            
            **How to use it:**
            - **Low (0.0-0.3)**: More deterministic, focused responses. Good for factual questions, definitions, and theological doctrine explanations.
            - **Medium (0.4-0.7)**: Balanced creativity and coherence. Suitable for general discussions, sermon ideas, and theological reflections.
            - **High (0.8-1.0)**: More creative, varied responses. Better for brainstorming, generating diverse interpretations, or exploring different theological perspectives.
            """)
        
        with col2:
            st.markdown("<p class='parameter-title'>Top P (Nucleus Sampling)</p>", unsafe_allow_html=True)
            st.markdown("""
            **What it is:** Controls diversity of word choices by considering only the most likely options.
            
            **How to use it:**
            - **Low (0.0-0.3)**: Very focused responses drawing from only the most probable words. Good for strict theological interpretations or doctrinal statements.
            - **Medium (0.4-0.7)**: Good balance of focus and diversity. Works well for most theology-related questions and discussions.
            - **High (0.8-1.0)**: Considers a wider range of word possibilities. Better for creative theological exploration, interfaith dialogues, or historical theological perspectives.
            """)
        
        st.markdown("<hr>", unsafe_allow_html=True)
        st.markdown("""
        **Recommended Settings for Theology Studies:**
        
        1. **Biblical Exegesis**: Temperature 0.3, Top P 0.7 - Maintains accuracy while allowing some interpretation
        2. **Sermon Preparation**: Temperature 0.6, Top P 0.9 - Creative yet grounded in scripture
        3. **Doctrinal Studies**: Temperature 0.2, Top P 0.5 - Precise and consistent responses
        4. **Comparative Religion**: Temperature 0.7, Top P 0.8 - Open to diverse perspectives
        5. **Historical Theology**: Temperature 0.4, Top P 0.6 - Historically accurate but contextually aware
        """)

def initialize_session_state():
    """Initialize session state variables if they don't exist"""
    # Initialize mode
    if "app_mode" not in st.session_state:
        st.session_state.app_mode = "Simple Chat"
    
    # Initialize messages
    if "messages" not in st.session_state:
        st.session_state.messages = []
    
    # Initialize model parameters
    if "model" not in st.session_state:
        st.session_state.model = "llama3.1"
    if "temperature" not in st.session_state:
        st.session_state.temperature = 0.7
    if "top_p" not in st.session_state:
        st.session_state.top_p = 0.9
    
    # Initialize flags
    if "params_changed" not in st.session_state:
        st.session_state.params_changed = False
    if "retriever_changed" not in st.session_state:
        st.session_state.retriever_changed = False
    if "documents" not in st.session_state:
        st.session_state.documents = None
    
    # Initialize conversation based on mode and state changes
    if ("conversation" not in st.session_state 
            or st.session_state.params_changed 
            or st.session_state.retriever_changed):
        
        # Reset flags
        st.session_state.params_changed = False
        st.session_state.retriever_changed = False
        
        # Get current model parameters
        model = st.session_state.model
        temperature = st.session_state.temperature
        top_p = st.session_state.top_p
        
        # Initialize the language model with parameters
        llm = Ollama(
            model=model,
            temperature=temperature,
            top_p=top_p
        )
        
        # Handle different modes
        if st.session_state.app_mode == "Document Q&A" and "retriever" in st.session_state and st.session_state.retriever:
            # Initialize memory for persistent chat history
            memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
            
            # Initialize the conversation chain with document retrieval
            st.session_state.conversation = ConversationalRetrievalChain.from_llm(
                llm=llm,
                retriever=st.session_state.retriever,
                memory=memory,
                verbose=False
            )
        else:
            # Initialize memory for persistent chat history
            memory = ConversationBufferMemory(return_messages=True)
            
            # Initialize the conversation chain
            st.session_state.conversation = ConversationChain(
                llm=llm,
                memory=memory,
                verbose=False
            )

def main():
    # Initialize session state
    initialize_session_state()
    
    # Main title
    st.markdown("<h1 class='main-title'>Assistant to Theology Studies</h1>", unsafe_allow_html=True)
    st.markdown("<p class='theology-subtitle'>Exploring faith, scripture, and theological understanding through conversation</p>", unsafe_allow_html=True)
    
    # Display alert if images are missing
    if not nineveh_exists or not bible_exists:
        st.warning(f"""
        To enable background images:
        1. Create a folder named 'images' in the same directory as this script
        2. Place the Nineveh.jpg and 3d_geneva_bible.jpg files in that folder
        3. Restart the application
        """)
    
    # Sidebar for application configuration
    with st.sidebar:
        st.title("Theology Assistant")
        
        # App mode selection
        st.header("App Mode")
        app_mode = st.radio(
            "Select Mode", 
            ["Simple Chat", "Advanced Chat", "Document Q&A"],
            index=["Simple Chat", "Advanced Chat", "Document Q&A"].index(st.session_state.app_mode),
            key="app_mode_radio",
            on_change=on_params_change
        )
        st.session_state.app_mode = app_mode
        
        # Model configuration section
        st.header("Model Configuration")
        
        # Model selection
        model_options = ["llama3.1", "deepseek-r1:8b", "qwen2.5", "mistral-nemo"]
        selected_model = st.selectbox(
            "Select Model", 
            model_options, 
            index=model_options.index(st.session_state.model) if st.session_state.model in model_options else 0, 
            key="model",
            on_change=on_params_change
        )
        
        # Only show parameters in Advanced Chat mode
        if st.session_state.app_mode == "Advanced Chat":
            # Add parameter information
            show_parameter_info()
            
            # Model parameters
            temperature = st.slider(
                "Temperature", 
                min_value=0.0, 
                max_value=1.0, 
                value=st.session_state.temperature, 
                step=0.1, 
                key="temperature",
                help="Controls randomness in responses. Lower values for more focused, consistent responses; higher values for more creative, varied responses.",
                on_change=on_params_change
            )
            
            top_p = st.slider(
                "Top P", 
                min_value=0.0, 
                max_value=1.0, 
                value=st.session_state.top_p, 
                step=0.1, 
                key="top_p",
                help="Controls diversity via nucleus sampling. Lower values for more predictable responses; higher values for more diverse word choices.",
                on_change=on_params_change
            )
        
        # Document upload section (only in Document Q&A mode)
        if st.session_state.app_mode == "Document Q&A":
            st.header("Upload Document")
            uploaded_file = st.file_uploader("Choose a file", type=["pdf", "docx", "txt", "md"])
            
            if uploaded_file is not None:
                st.info("Processing document...")
                retriever, documents = process_document(uploaded_file)
                
                if retriever:
                    st.success(f"Document '{uploaded_file.name}' processed successfully!")
                    st.session_state.retriever = retriever
                    st.session_state.documents = documents
                    st.session_state.retriever_changed = True
                    st.session_state.messages = []  # Clear previous chat on new document
                else:
                    st.error("Failed to process the document.")
        
        # Clear conversation button
        if st.button("Clear Conversation"):
            st.session_state.messages = []
            st.session_state.params_changed = True  # Force conversation reset
    
    # Main content area with background images
    if st.session_state.app_mode == "Document Q&A" and st.session_state.documents:
        col1, col2 = st.columns([3, 1])
        
        # First column with Nineveh background
        with col1:
            if nineveh_exists:
                st.markdown('<div class="nineveh-bg">', unsafe_allow_html=True)
            
            st.header("Document Q&A")
            if "retriever" in st.session_state and st.session_state.retriever:
                st.subheader("Ask questions about your theological document")
            
            # White semi-transparent background for chat area
            st.markdown('<div class="chat-area">', unsafe_allow_html=True)
            
            # Display chat messages from history
            for message in st.session_state.messages:
                with st.chat_message(message["role"]):
                    st.markdown(message["content"])
            
            st.markdown('</div>', unsafe_allow_html=True)
            
            # Chat input
            if prompt := st.chat_input("What theology topic would you like to explore?"):
                # Add user message to chat history
                st.session_state.messages.append({"role": "user", "content": prompt})
                
                # Display user message in chat container
                with st.chat_message("user"):
                    st.markdown(prompt)
                
                # Generate and display assistant response
                with st.chat_message("assistant"):
                    with st.spinner(f"Thinking using {st.session_state.model}..."):
                        response = st.session_state.conversation({"question": prompt})
                        response_text = response.get("answer", "I couldn't find an answer in the document.")
                        st.markdown(response_text)
                
                # Add assistant response to chat history
                st.session_state.messages.append({"role": "assistant", "content": response_text})
            
            if nineveh_exists:
                st.markdown('</div>', unsafe_allow_html=True)
        
        # Second column with Bible background
        with col2:
            if bible_exists:
                st.markdown('<div class="bible-bg">', unsafe_allow_html=True)
            
            st.header("Document Analysis")
            
            # White semi-transparent background for analysis area
            st.markdown('<div class="chat-area">', unsafe_allow_html=True)
            
            # Extract text from documents
            full_text = extract_text_from_documents(st.session_state.documents)
            
            # Generate word cloud
            wordcloud, top_words = generate_wordcloud(full_text)
            
            if wordcloud:
                # Display word cloud
                st.subheader("Word Cloud")
                fig, ax = plt.subplots(figsize=(10, 5))
                ax.imshow(wordcloud, interpolation='bilinear')
                ax.axis("off")
                st.pyplot(fig)
                
                # Display top words
                st.subheader("Top Terms")
                st.dataframe(top_words)
                
                # Document statistics
                st.subheader("Document Statistics")
                word_count = len(re.findall(r'\b\w+\b', full_text))
                unique_words = len(set(re.findall(r'\b\w+\b', full_text.lower())))
                sentences = len(re.split(r'[.!?]+', full_text))
                
                st.markdown(f"**Word Count:** {word_count}")
                st.markdown(f"**Unique Words:** {unique_words}")
                st.markdown(f"**Sentences:** {sentences}")
                st.markdown(f"**Vocabulary Richness:** {unique_words/word_count:.2f} (unique/total)")
            else:
                st.info("Not enough content to generate word cloud.")
            
            st.markdown('</div>', unsafe_allow_html=True)
            
            if bible_exists:
                st.markdown('</div>', unsafe_allow_html=True)
    
    else:
        # For Simple Chat and Advanced Chat modes
        if nineveh_exists:
            st.markdown('<div class="nineveh-bg">', unsafe_allow_html=True)
        
        if st.session_state.app_mode == "Simple Chat":
            st.header("Simple Chat")
            st.subheader(f"Powered by {st.session_state.model}")
        elif st.session_state.app_mode == "Advanced Chat":
            st.header("Advanced Chat")
            st.subheader(f"Model: {st.session_state.model} | Temp: {st.session_state.temperature} | Top-P: {st.session_state.top_p}")
        else:  # Document Q&A mode with no document
            st.header("Document Q&A")
            st.subheader("Please upload a theological document in the sidebar")
        
        # White semi-transparent background for chat area
        st.markdown('<div class="chat-area">', unsafe_allow_html=True)
        
        # Display chat messages from history
        for message in st.session_state.messages:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])
        
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Chat input
        if prompt := st.chat_input("What theology topic would you like to explore?"):
            # Add user message to chat history
            st.session_state.messages.append({"role": "user", "content": prompt})
            
            # Display user message in chat container
            with st.chat_message("user"):
                st.markdown(prompt)
            
            # Generate and display assistant response
            with st.chat_message("assistant"):
                with st.spinner(f"Thinking using {st.session_state.model}..."):
                    response = st.session_state.conversation.predict(input=prompt)
                    st.markdown(response)
            
            # Add assistant response to chat history
            st.session_state.messages.append({"role": "assistant", "content": response})
        
        if nineveh_exists:
            st.markdown('</div>', unsafe_allow_html=True)

if __name__ == "__main__":
    main()
