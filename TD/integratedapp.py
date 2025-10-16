import streamlit as st
import tempfile
import os
from langchain_community.llms import Ollama
from langchain.chains import ConversationChain, ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import FAISS

# Set page configuration
st.set_page_config(
    page_title="Ollama Chatbot",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

def process_document(uploaded_file):
    """Process the uploaded document and return a document retriever"""
    # Create a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{uploaded_file.name.split('.')[-1]}") as temp_file:
        temp_file.write(uploaded_file.getvalue())
        temp_file_path = temp_file.name
    
    # Select the appropriate loader based on file type
    file_extension = uploaded_file.name.split('.')[-1].lower()
    
    try:
        if file_extension == 'pdf':
            loader = PyPDFLoader(temp_file_path)
        elif file_extension in ['docx', 'doc']:
            loader = Docx2txtLoader(temp_file_path)
        elif file_extension in ['txt', 'md']:
            loader = TextLoader(temp_file_path)
        else:
            st.error(f"Unsupported file format: {file_extension}")
            os.unlink(temp_file_path)
            return None
        
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
        os.unlink(temp_file_path)
        
        return vectorstore.as_retriever()
    
    except Exception as e:
        st.error(f"Error processing document: {str(e)}")
        # Clean up the temporary file
        os.unlink(temp_file_path)
        return None

def on_params_change():
    """Callback when parameters are changed"""
    st.session_state.params_changed = True

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
    
    # Sidebar for application configuration
    with st.sidebar:
        st.title("Ollama Chatbot")
        
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
            # Model parameters
            temperature = st.slider(
                "Temperature", 
                min_value=0.0, 
                max_value=1.0, 
                value=st.session_state.temperature, 
                step=0.1, 
                key="temperature",
                help="Higher values make the output more random, lower values make it more deterministic",
                on_change=on_params_change
            )
            
            top_p = st.slider(
                "Top P", 
                min_value=0.0, 
                max_value=1.0, 
                value=st.session_state.top_p, 
                step=0.1, 
                key="top_p",
                help="Controls diversity via nucleus sampling",
                on_change=on_params_change
            )
        
        # Document upload section (only in Document Q&A mode)
        if st.session_state.app_mode == "Document Q&A":
            st.header("Upload Document")
            uploaded_file = st.file_uploader("Choose a file", type=["pdf", "docx", "txt", "md"])
            
            if uploaded_file is not None:
                st.info("Processing document...")
                retriever = process_document(uploaded_file)
                
                if retriever:
                    st.success(f"Document '{uploaded_file.name}' processed successfully!")
                    st.session_state.retriever = retriever
                    st.session_state.retriever_changed = True
                    st.session_state.messages = []  # Clear previous chat on new document
                else:
                    st.error("Failed to process the document.")
        
        # Clear conversation button
        if st.button("Clear Conversation"):
            st.session_state.messages = []
            st.session_state.params_changed = True  # Force conversation reset
    
    # Main content area
    if st.session_state.app_mode == "Simple Chat":
        st.title("Simple Chat")
        st.subheader(f"Powered by {st.session_state.model}")
    elif st.session_state.app_mode == "Advanced Chat":
        st.title("Advanced Chat")
        st.subheader(f"Model: {st.session_state.model} | Temp: {st.session_state.temperature} | Top-P: {st.session_state.top_p}")
    else:  # Document Q&A mode
        st.title("Document Q&A")
        if "retriever" in st.session_state and st.session_state.retriever:
            st.subheader("Ask questions about your document")
        else:
            st.subheader("Please upload a document in the sidebar")
    
    # Display chat messages from history
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # Chat input
    if prompt := st.chat_input("What would you like to talk about?"):
        # Add user message to chat history
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        # Display user message in chat container
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Generate and display assistant response
        with st.chat_message("assistant"):
            with st.spinner(f"Thinking using {st.session_state.model}..."):
                if st.session_state.app_mode == "Document Q&A" and "retriever" in st.session_state and st.session_state.retriever:
                    response = st.session_state.conversation({"question": prompt})
                    response_text = response.get("answer", "I couldn't find an answer in the document.")
                else:
                    response = st.session_state.conversation.predict(input=prompt)
                    response_text = response
                
                st.markdown(response_text)
        
        # Add assistant response to chat history
        st.session_state.messages.append({"role": "assistant", "content": response_text})

if __name__ == "__main__":
    main()
