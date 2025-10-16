import streamlit as st
import tempfile
import os
import re
import base64
from collections import Counter
import numpy as np
from langchain_community.chat_models import ChatOllama
from langchain.chains import ConversationChain, ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import FAISS
import matplotlib.pyplot as plt
from wordcloud import WordCloud
import pandas as pd
from langchain.prompts import PromptTemplate
import datetime
import glob
import html
from langchain.callbacks.base import BaseCallbackHandler
from langchain_openai import ChatOpenAI  # Add this import

class StreamingCallbackHandler(BaseCallbackHandler):
    """Callback handler for streaming LLM responses."""
    
    def __init__(self, container):
        self.container = container
        self.text = ""
        
    def on_llm_new_token(self, token: str, **kwargs):
        """Run on new LLM token."""
        self.text += token
        self.container.markdown(self.text)

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
        background-size: cover;
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
bible_path = os.path.join(image_dir, "divinity.jpg")

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
    .document-summary {
        background-color: rgba(240, 240, 245, 0.9);
        padding: 15px;
        border-radius: 10px;
        border-left: 4px solid #1E3A8A;
        margin: 10px 0;
        font-size: 0.95rem;
    }
    .document-list {
        margin-top: 15px;
        background-color: rgba(255, 255, 255, 0.8);
        padding: 10px;
        border-radius: 5px;
    }
    .assignment-area {
        background-color: rgba(245, 245, 250, 0.9);
        padding: 15px;
        border-radius: 10px;
        border-left: 4px solid #4B5563;
        margin: 15px 0;
    }
    .plan-section {
        background-color: rgba(235, 245, 255, 0.9);
        padding: 12px;
        border-radius: 5px;
        margin: 10px 0;
    }
    .draft-section {
        background-color: rgba(235, 255, 240, 0.9);
        padding: 12px;
        border-radius: 5px;
        margin: 10px 0;
    }
    .critique-section {
        background-color: rgba(255, 245, 235, 0.9);
        padding: 12px;
        border-radius: 5px;
        margin: 10px 0;
    }
    .stage-indicator {
        font-weight: bold;
        color: #1E3A8A;
        margin-bottom: 5px;
    }
    .revision-indicator {
        font-size: 0.8rem;
        color: #4B5563;
        text-align: right;
    }
    /* Add these CSS styles to the existing custom CSS section */

    .plan-editor {
        background-color: rgba(240, 245, 250, 0.95);
        border: 1px solid #c0c0c0;
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 20px;
    }

    .plan-actions {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }

    .saved-plan-item {
        background-color: rgba(255, 255, 255, 0.9);
        padding: 10px;
        border-radius: 5px;
        border-left: 3px solid #1E3A8A;
        margin-bottom: 8px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .saved-plan-item:hover {
        background-color: rgba(235, 245, 255, 0.9);
    }

    .plan-timestamp {
        font-size: 0.8rem;
        color: #6B7280;
        margin-top: 3px;
    }

    .plan-selected {
        background-color: rgba(220, 235, 255, 0.9);
        border-left: 3px solid #1E40AF;
    }

    .plan-load-section {
        background-color: rgba(245, 245, 250, 0.9);
        padding: 12px;
        border-radius: 8px;
        margin: 10px 0;
        border: 1px dashed #c0c0c0;
    }

    .editor-header {
        font-weight: bold;
        margin-bottom: 8px;
        color: #1E3A8A;
    }

    .stTextArea > div {
        border-radius: 8px;
        border-color: #c0c0c0;
    }

    /* Add styling for buttons */
    .primary-button {
        background-color: #1E3A8A;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
    }

    .secondary-button {
        background-color: #E5E7EB;
        color: #1F2937;
        border: none;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
    }

    /* Improved file list appearance */
    .file-list {
        max-height: 300px;
        overflow-y: auto;
        margin-top: 10px;
        padding-right: 10px;
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

def generate_document_summary(text, llm):
    """Generate a concise summary of the document(s)"""
    try:
        # Truncate text if it's very long to prevent context length issues
        text_sample = text[:10000] if len(text) > 10000 else text
        
        prompt = f"""Please provide a concise summary of the following document in less than 150 words. 
        Focus on the main theological themes, key points, and overall purpose of the text:
        
        {text_sample}
        
        SUMMARY (less than 150 words):"""
        
        summary = llm.predict(prompt)
        return summary
    except Exception as e:
        return f"Error generating summary: {str(e)}"

def process_document(uploaded_file):
    """Process the uploaded document and return document objects"""
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
            return None
        
        # Load the document
        documents = loader.load()
        
        # Clean up the temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        
        return documents
    
    except Exception as e:
        st.error(f"Error processing document: {str(e)}")
        # Clean up the temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        return None

def process_documents_for_qa(documents):
    """Process documents to create a retriever for QA"""
    try:
        # Split the documents into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=100
        )
        chunks = text_splitter.split_documents(documents)
        
        # Create embeddings and vectorstore
        embeddings = OllamaEmbeddings(model=st.session_state.model)
        vectorstore = FAISS.from_documents(chunks, embeddings)
        
        return vectorstore.as_retriever()
    
    except Exception as e:
        st.error(f"Error creating retriever: {str(e)}")
        return None

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
# Create a directory for the drafts if it doesn't exist
def ensure_directories():
    """Ensure all required directories exist"""
    os.makedirs("./draftplan", exist_ok=True)
    os.makedirs("./draftwriting", exist_ok=True)
    
# Functions for draft management
def save_draft_to_file(draft, topic):
    """Save the draft to a markdown file with timestamp"""
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    # Sanitize topic for filename (remove special chars, replace spaces with underscores)
    sanitized_topic = re.sub(r'[^\w\s-]', '', topic).strip().replace(' ', '_')
    if not sanitized_topic:
        sanitized_topic = "untitled_draft"
    
    # Create directory if it doesn't exist
    os.makedirs("./draftwriting", exist_ok=True)
    
    filename = f"./draftwriting/draft_{sanitized_topic}_{timestamp}.md"
    
    # Create markdown content with metadata and formatting
    md_content = f"""# Theology Assignment Draft: {topic}

## Created: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
## Academic Level: {st.session_state.academic_level}
## Length: {st.session_state.assignment_length}
## Tone: {st.session_state.assignment_tone}

{draft}
"""
    
    try:
        with open(filename, "w", encoding="utf-8") as f:
            f.write(md_content)
        return filename
    except Exception as e:
        st.error(f"Error saving draft to file: {str(e)}")
        return None

def load_draft_from_file(filename):
    """Load draft content from a file with error handling"""
    try:
        with open(filename, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Extract just the draft part (skip metadata)
        # Look for metadata sections and the blank line after them
        draft_parts = content.split("\n\n", 3)
        if len(draft_parts) >= 4:
            return draft_parts[3]
        return content
    except FileNotFoundError:
        st.error(f"Draft file not found: {os.path.basename(filename)}")
        return None
    except Exception as e:
        st.error(f"Error loading draft from file: {str(e)}")
        return None

def get_saved_drafts():
    """Get a list of all saved draft files with additional metadata"""
    try:
        drafts = glob.glob("./draftwriting/draft_*.md")
        # Sort by modification time (most recent first)
        drafts.sort(key=lambda x: os.path.getmtime(x), reverse=True)
        return drafts
    except Exception as e:
        st.error(f"Error retrieving saved drafts: {str(e)}")
        return []

def show_draft_editor(draft_content, is_new_draft=True):
    """Show an editor for drafts with save and cancel options"""
    st.subheader("Edit Assignment Draft" if not is_new_draft else "Create Assignment Draft")
    
    # Add a flag in session state to track if we're in advanced edit mode
    if "advanced_edit_mode" not in st.session_state:
        st.session_state.advanced_edit_mode = False
    
    # Option to turn on advanced edit mode
    st.session_state.advanced_edit_mode = st.checkbox(
        "Enable Advanced Edit Mode (highlight additions in red)",
        value=st.session_state.advanced_edit_mode
    )
    
    if st.session_state.advanced_edit_mode:
        # In advanced mode, we'll need to store the original text to compare
        if "original_draft_text" not in st.session_state:
            st.session_state.original_draft_text = draft_content
        
        edited_draft = st.text_area(
            "Draft Editor",
            value=draft_content,
            height=500,
            key="draft_editor"
        )
        
        # Preview with highlights for changes
        st.subheader("Preview with Highlighted Changes")
        highlighted_draft = highlight_changes(st.session_state.original_draft_text, edited_draft)
        st.markdown(highlighted_draft, unsafe_allow_html=True)
    else:
        # Simple edit mode
        edited_draft = st.text_area(
            "Draft Editor",
            value=draft_content,
            height=500,
            key="draft_editor"
        )
    
    col1, col2, col3 = st.columns([1, 1, 1])
    with col1:
        if st.button("Save Draft", key="save_draft_btn"):
            if edited_draft.strip():
                # Save the edited draft with timestamp
                filename = save_draft_to_file(
                    edited_draft,
                    st.session_state.assignment_topic
                )
                
                if filename:
                    st.session_state.assignment_draft = edited_draft
                    st.session_state.draft_filename = filename
                    st.success(f"Draft saved to {os.path.basename(filename)}")
                    
                    # Reset the advanced edit mode original text
                    if "original_draft_text" in st.session_state:
                        st.session_state.original_draft_text = edited_draft
                    
                    # Update saved drafts list
                    st.session_state.saved_drafts = get_saved_drafts()
                    st.session_state.show_draft_editor = False
                    st.rerun()
            else:
                st.error("Cannot save an empty draft.")
    
    with col2:
        if st.button("Cancel Editing", key="cancel_draft_btn"):
            st.session_state.show_draft_editor = False
            # Reset advanced edit mode
            if "original_draft_text" in st.session_state:
                del st.session_state.original_draft_text
            st.session_state.advanced_edit_mode = False
            st.rerun()
    
    with col3:
        if st.button("Advanced Chat help rewrite draft ", key="open_advanced_chat_btn"):
            # Store the current state
            st.session_state.previous_app_mode = st.session_state.app_mode
            st.session_state.previous_assignment_stage = st.session_state.assignment_stage
            
            # Switch to Advanced Chat mode
            st.session_state.app_mode = "Advanced Chat"
            st.session_state.temp_draft_content = edited_draft
            st.rerun()

def highlight_changes(original_text, new_text):
    """Highlight changes between original text and new text"""
    # Simple word-based diff
    original_words = original_text.split()
    new_words = new_text.split()
    
    # Find new words that aren't in the original
    highlighted_text = new_text
    
    # For simplicity, just wrap paragraphs that aren't in the original in red
    original_paragraphs = original_text.split('\n\n')
    new_paragraphs = new_text.split('\n\n')
    
    highlighted_paragraphs = []
    for para in new_paragraphs:
        if para.strip() and para not in original_paragraphs:
            # Escape HTML entities to prevent injection
            safe_para = html.escape(para)
            highlighted_paragraphs.append(f'<span style="color: red;">{safe_para}</span>')
        else:
            highlighted_paragraphs.append(para)
    
    highlighted_text = '\n\n'.join(highlighted_paragraphs)
    return highlighted_text

def initialize_session_state():
    """Initialize session state variables if they don't exist"""
    # Initialize mode
    if "app_mode" not in st.session_state:
        st.session_state.app_mode = "Simple Chat"
    
    # Initialize messages
    if "messages" not in st.session_state:
        st.session_state.messages = []
        
    # Initialize plan editor flag
    if "show_plan_editor" not in st.session_state:
        st.session_state.show_plan_editor = False
    
    # Initialize model parameters
    if "model" not in st.session_state:
        st.session_state.model = "llama3.3"
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
        st.session_state.documents = []
    if "document_summary" not in st.session_state:
        st.session_state.document_summary = ""
    if "uploaded_doc_names" not in st.session_state:
        st.session_state.uploaded_doc_names = []
    
    # Initialize assignment assistant variables (renamed from course design)
    if "assignment_topic" not in st.session_state:
        st.session_state.assignment_topic = ""
    if "theology_area" not in st.session_state:
        st.session_state.theology_area = ""
    if "academic_level" not in st.session_state:
        st.session_state.academic_level = "undergraduate"
    if "assignment_length" not in st.session_state:
        st.session_state.assignment_length = "1500-2000 words"
    if "assignment_tone" not in st.session_state:
        st.session_state.assignment_tone = "Academic"
    if "assignment_plan" not in st.session_state:
        st.session_state.assignment_plan = ""
    if "assignment_draft" not in st.session_state:
        st.session_state.assignment_draft = ""
    if "assignment_critique" not in st.session_state:
        st.session_state.assignment_critique = ""
    if "revision_number" not in st.session_state:
        st.session_state.revision_number = 0
    if "max_revisions" not in st.session_state:
        st.session_state.max_revisions = 5
    if "assignment_stage" not in st.session_state:
        st.session_state.assignment_stage = "input"  # input, plan, write, critique
    if "plan_filename" not in st.session_state:
        st.session_state.plan_filename = ""
    if "saved_plans" not in st.session_state:
        st.session_state.saved_plans = []
        # Add show_plan_editor flag
    if "show_plan_editor" not in st.session_state:
        st.session_state.show_plan_editor = False

    # Add draft-related state variables
    if "show_draft_editor" not in st.session_state:
        st.session_state.show_draft_editor = False
    if "draft_filename" not in st.session_state:
        st.session_state.draft_filename = ""
    if "saved_drafts" not in st.session_state:
        st.session_state.saved_drafts = []
    if "advanced_edit_mode" not in st.session_state:
        st.session_state.advanced_edit_mode = False
    if "previous_app_mode" not in st.session_state:
        st.session_state.previous_app_mode = None
    if "previous_assignment_stage" not in st.session_state:
        st.session_state.previous_assignment_stage = None
    if "temp_draft_content" not in st.session_state:
        st.session_state.temp_draft_content = ""
    
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
        if ("gpt" in model) or ("o3-mini" in model):
            # Check if API key is available
            if "openai_api_key" in st.session_state and st.session_state.openai_api_key:
                os.environ["OPENAI_API_KEY"] = st.session_state.openai_api_key
                if "gpt" in model:
                    llm = ChatOpenAI(
                        model=model,
                        temperature=temperature,
                        streaming=True
                    )
                else:
                    llm = ChatOpenAI(
                        model=model,
                        streaming=True
                    )
            else:
                # Instead of setting to None, provide a message but keep the previous LLM
                if "llm" not in st.session_state:
                    st.error("OpenAI API key is required for GPT models")
                    # Default to a safe model option
                    model = "llama3.3"  # Fallback to a default model
                    llm = ChatOllama(
                        model=model,
                        temperature=temperature,
                        top_p=top_p,
                        streaming=True
                    )
                else:
                    # Keep the existing LLM
                    llm = st.session_state.llm
                    st.error("OpenAI API key is required for GPT models. Using previous model.")
        else:
            # Use Ollama for other models
            llm = ChatOllama(
                model=model,
                temperature=temperature,
                top_p=top_p,
                streaming=True
            )

        # Store the LLM in session state for use in generating summaries
        st.session_state.llm = llm

        
        # Handle different modes (add this check before creating the conversation)
        if st.session_state.app_mode == "Reading Q&A" and "retriever" in st.session_state and st.session_state.retriever:
            # Initialize memory for persistent chat history
            memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
            
            # Custom prompt template for reading Q&A
            custom_prompt_template = """You are a helpful theological assistant that answers questions based on the provided theological texts.
            
            When answering, follow these guidelines:
            1. Focus on providing insights directly from the text
            2. Cite relevant passages when possible
            3. If the text doesn't contain the answer, acknowledge this and provide general theological insight
            4. Maintain a respectful, scholarly tone appropriate for theological studies
            5. Provide balanced perspectives when discussing denominational or controversial topics
            
            Context: {context}
            
            Chat History: {chat_history}
            
            Question: {question}
            
            Thoughtful Answer:"""
            
            CUSTOM_PROMPT = PromptTemplate(
                template=custom_prompt_template,
                input_variables=["context", "chat_history", "question"]
            )
            
            # Initialize the conversation chain with document retrieval and custom prompt
            st.session_state.conversation = ConversationalRetrievalChain.from_llm(
                llm=llm,
                retriever=st.session_state.retriever,
                memory=memory,
                combine_docs_chain_kwargs={"prompt": CUSTOM_PROMPT},
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
def save_plan_to_file(plan, topic):
    """Save the plan to a markdown file with timestamp"""
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    sanitized_topic = re.sub(r'[^\w\s-]', '', topic).strip().replace(' ', '_')
    if not sanitized_topic:
        sanitized_topic = "untitled_plan"
    
    filename = f"./draftplan/plan_{sanitized_topic}_{timestamp}.md"
    
    # Create markdown content with metadata
    md_content = f"""# Theology Assignment Plan: {topic}
## Created: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

{plan}
"""
    
    try:
        with open(filename, "w", encoding="utf-8") as f:
            f.write(md_content)
        return filename
    except Exception as e:
        st.error(f"Error saving plan to file: {str(e)}")
        return None

def load_plan_from_file(filename):
    """Load plan content from a file"""
    try:
        with open(filename, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Extract just the plan part (skip metadata)
        plan_parts = content.split("\n\n", 2)
        if len(plan_parts) >= 3:
            return plan_parts[2]
        return content
    except Exception as e:
        st.error(f"Error loading plan from file: {str(e)}")
        return None

def get_saved_plans():
    """Get a list of all saved plan files"""
    plans = glob.glob("./draftplan/plan_*.md")
    return sorted(plans, reverse=True)  # Most recent first

def create_assignment_plan(topic, area, level, length, tone):
    """Generate an assignment plan based on topic, area, level, length and tone"""
    llm = st.session_state.llm
    
    prompt = f"""You are a theology education expert tasked to create an assignment plan.
    
    ASSIGNMENT TOPIC: {topic}
    AREA OF THEOLOGY: {area}
    ACADEMIC LEVEL: {level}
    LENGTH REQUIREMENT: {length}
    TONE OF LANGUAGE: {tone}
    
    Create a detailed outline for this theology assignment. Include:
    1. A clear thesis statement or research question
    2. 3-5 main sections or arguments to develop (with appropriate depth for {length})
    3. Key theological concepts that need to be addressed
    4. Essential texts, scriptures, or theological sources to engage with
    5. Methodological approach appropriate for this assignment
    
    Keep your response structured and academically rigorous for a theology student at {level} level.
    Write in a way that will enable the student to develop a {tone} tone in their final paper.
    Consider how the {length} requirement affects the scope and depth of the assignment.
    """
    
    try:
        with st.spinner("Creating assignment plan..."):
            plan = llm.predict(prompt)
            st.session_state.assignment_plan = plan
            st.session_state.assignment_stage = "plan"
            st.session_state.revision_number = 1
            
            # Save plan to file with timestamp
            filename = save_plan_to_file(plan, topic)
            if filename:
                st.session_state.plan_filename = filename
                st.success(f"Plan saved to {os.path.basename(filename)}")
            
            # Update saved plans list
            st.session_state.saved_plans = get_saved_plans()
            
            return plan
    except Exception as e:
        st.error(f"Error generating assignment plan: {str(e)}")
        return None

# Add these functions to enhance plan editing capabilities

def show_plan_editor(plan_content, is_new_plan=True):
    """Show an editor for plans with save and cancel options"""
    st.subheader("Edit Assignment Plan" if not is_new_plan else "Create Assignment Plan")
    
    edited_plan = st.text_area(
        "Plan Editor",
        value=plan_content,
        height=400,
        key="plan_editor"
    )
    
    col1, col2 = st.columns([1, 1])
    with col1:
        if st.button("Save Plan", key="save_plan_btn"):
            if edited_plan.strip():
                # Save the edited plan with timestamp
                filename = save_plan_to_file(
                    edited_plan,
                    st.session_state.assignment_topic
                )
                
                if filename:
                    st.session_state.assignment_plan = edited_plan
                    st.session_state.plan_filename = filename
                    st.success(f"Plan saved to {os.path.basename(filename)}")
                    
                    # Update saved plans list
                    st.session_state.saved_plans = get_saved_plans()
                    st.session_state.show_plan_editor = False
                    st.rerun()
            else:
                st.error("Cannot save an empty plan.")
    
    with col2:
        if st.button("Cancel Editing", key="cancel_plan_btn"):
            st.session_state.show_plan_editor = False
            st.rerun()

# Modify the Plan stage section of the main() function to include plan loading functionality
def enhanced_plan_stage():
    """Modified plan stage with load/edit functionality"""
    st.subheader(f"Assignment Plan: {st.session_state.assignment_topic}")
    
    # Show plan editor if in editing mode
    if st.session_state.show_plan_editor:
        show_plan_editor(st.session_state.assignment_plan, is_new_plan=False)
    else:
        # Display the current plan
        st.markdown("<div class='plan-section'>", unsafe_allow_html=True)
        st.markdown("<p class='stage-indicator'>PLANNING STAGE</p>", unsafe_allow_html=True)
        st.markdown(st.session_state.assignment_plan)
        st.markdown("</div>", unsafe_allow_html=True)
        
        # Buttons for plan management and next steps
        col1, col2, col3 = st.columns([1, 1, 1])
        
        with col1:
            if st.button("Edit Plan", key="edit_plan_btn"):
                st.session_state.show_plan_editor = True
                st.rerun()
        
        with col2:
            if st.button("Load Saved Plan", key="load_plan_btn"):
                # Show a selection of saved plans
                saved_plans = get_saved_plans()
                if saved_plans:
                    st.session_state.saved_plans = saved_plans
                    
                    with st.expander("Select a plan to load", expanded=True):
                        selected_plan = st.selectbox(
                            "Available Plans",
                            options=[os.path.basename(p) for p in saved_plans],
                            format_func=lambda x: x.replace("plan_", "").replace(".md", "").replace("_", " "),
                            key="plan_selector"
                        )
                        
                        if st.button("Load Selected Plan", key="confirm_load_btn"):
                            selected_path = [p for p in saved_plans if os.path.basename(p) == selected_plan][0]
                            loaded_plan = load_plan_from_file(selected_path)
                            
                            if loaded_plan:
                                st.session_state.assignment_plan = loaded_plan
                                st.session_state.plan_filename = selected_path
                                st.success(f"Loaded plan: {os.path.basename(selected_path)}")
                                st.rerun()
                else:
                    st.info("No saved plans found.")
        
        with col3:
            if st.button("Create Assignment Draft", key="create_draft_btn"):
                draft = create_assignment_draft(
                    st.session_state.assignment_topic,
                    st.session_state.theology_area,
                    st.session_state.academic_level,
                    st.session_state.assignment_length,
                    st.session_state.assignment_tone,
                    st.session_state.assignment_plan
                )

# Enhanced plan loading/saving functions with better error handling

def get_saved_plans():
    """Get a list of all saved plan files with additional metadata"""
    try:
        plans = glob.glob("./draftplan/plan_*.md")
        # Sort by modification time (most recent first)
        plans.sort(key=lambda x: os.path.getmtime(x), reverse=True)
        return plans
    except Exception as e:
        st.error(f"Error retrieving saved plans: {str(e)}")
        return []

def save_plan_to_file(plan, topic):
    """Save the plan to a markdown file with timestamp and better formatting"""
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    # Sanitize topic for filename (remove special chars, replace spaces with underscores)
    sanitized_topic = re.sub(r'[^\w\s-]', '', topic).strip().replace(' ', '_')
    if not sanitized_topic:
        sanitized_topic = "untitled_plan"
    
    # Create directory if it doesn't exist
    os.makedirs("./draftplan", exist_ok=True)
    
    filename = f"./draftplan/plan_{sanitized_topic}_{timestamp}.md"
    
    # Create markdown content with metadata and formatting
    md_content = f"""# Theology Assignment Plan: {topic}

    ## Created: {datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

    {plan}
    """
    
    try:
        with open(filename, "w", encoding="utf-8") as f:
            f.write(md_content)
        return filename
    except Exception as e:
        st.error(f"Error saving plan to file: {str(e)}")
        return None

def load_plan_from_file(filename):
    """Load plan content from a file with error handling"""
    try:
        with open(filename, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Extract just the plan part (skip metadata)
        # Look for two blank lines after metadata
        plan_parts = content.split("\n\n", 2)
        if len(plan_parts) >= 3:
            return plan_parts[2]
        return content
    except FileNotFoundError:
        st.error(f"Plan file not found: {os.path.basename(filename)}")
        return None
    except Exception as e:
        st.error(f"Error loading plan from file: {str(e)}")
        return None

def create_assignment_plan(topic, area, level, length, tone):
    """Generate an assignment plan based on topic, area, level, length and tone"""
    llm = st.session_state.llm
    
    prompt = f"""You are a theology education expert tasked to create an assignment plan.
    
    ASSIGNMENT TOPIC: {topic}
    AREA OF THEOLOGY: {area}
    ACADEMIC LEVEL: {level}
    LENGTH REQUIREMENT: {length}
    TONE OF LANGUAGE: {tone}
    
    Create a detailed outline for this theology assignment. Include:
    1. A clear thesis statement or research question
    2. 3-5 main sections or arguments to develop (with appropriate depth for {length})
    3. Key theological concepts that need to be addressed
    4. Essential texts, scriptures, or theological sources to engage with
    5. Methodological approach appropriate for this assignment
    
    Keep your response structured and academically rigorous for a theology student at {level} level.
    Write in a way that will enable the student to develop a {tone} tone in their final paper.
    Consider how the {length} requirement affects the scope and depth of the assignment.
    """
    
    try:
        with st.spinner("Creating assignment plan..."):
            plan = llm.predict(prompt)
            st.session_state.assignment_plan = plan
            st.session_state.assignment_stage = "plan"
            st.session_state.revision_number = 1
            st.session_state.show_plan_editor = False  # Ensure editor is closed
            
            # Save plan to file with timestamp
            filename = save_plan_to_file(plan, topic)
            if filename:
                st.session_state.plan_filename = filename
                st.success(f"Plan saved to {os.path.basename(filename)}")
            
            # Update saved plans list
            st.session_state.saved_plans = get_saved_plans()
            
            return plan
    except Exception as e:
        st.error(f"Error generating assignment plan: {str(e)}")
        return None

# Update create_assignment_draft to save the draft to a file
def update_create_assignment_draft():
    """Modified version of create_assignment_draft function"""
    def create_assignment_draft(topic, area, level, length, tone, plan):
        """Generate an assignment draft based on plan, length and tone"""
        llm = st.session_state.llm
        
        prompt = f"""You are a theology writing expert creating a detailed assignment draft for:
        
        ASSIGNMENT TOPIC: {topic}
        AREA OF THEOLOGY: {area}
        ACADEMIC LEVEL: {level}
        LENGTH REQUIREMENT: {length}
        TONE OF LANGUAGE: {tone}
        
        Based on this plan:
        {plan}
        
        Now create a well-structured draft of the assignment. Include:
        1. Introduction with clear thesis statement
        2. Main body sections as outlined in the plan
        3. Substantive theological arguments with appropriate depth
        4. Engagement with relevant theological sources
        5. Conclusion that synthesizes the key points
        
        For {level} level, ensure appropriate theological depth, scholarly rigor, and proper academic style.
        Maintain a {tone} tone throughout the assignment.
        The assignment should be approximately {length} in length and structured accordingly.
        """
        
        try:
            with st.spinner("Creating assignment draft..."):
                draft = llm.predict(prompt)
                st.session_state.assignment_draft = draft
                st.session_state.assignment_stage = "draft"
                
                # Save draft to file with timestamp
                filename = save_draft_to_file(draft, topic)
                if filename:
                    st.session_state.draft_filename = filename
                    st.success(f"Draft saved to {os.path.basename(filename)}")
                
                # Update saved drafts list
                st.session_state.saved_drafts = get_saved_drafts()
                
                return draft
        except Exception as e:
            st.error(f"Error generating assignment draft: {str(e)}")
            return None
    
    return create_assignment_draft

# Add code for returning from Advanced Chat to draft editor
def handle_return_from_advanced_chat():
    """Handle returning from Advanced Chat mode back to Assignment Assistant"""
    if (st.session_state.app_mode == "Advanced Chat" and
        st.session_state.previous_app_mode == "Assignment Assistant" and
        st.session_state.previous_assignment_stage is not None):
        
        # Add a button to return to draft editor
        st.sidebar.markdown("---")
        st.sidebar.subheader("Return to Assignment")
        
        if st.sidebar.button("Return to Draft Editor"):
            # Restore previous state
            st.session_state.app_mode = "Assignment Assistant"
            st.session_state.assignment_stage = st.session_state.previous_assignment_stage
            
            # If there was temporary draft content, update it
            if st.session_state.temp_draft_content:
                st.session_state.assignment_draft = st.session_state.temp_draft_content
                st.session_state.temp_draft_content = ""
            
            # Show the draft editor
            st.session_state.show_draft_editor = True
            
            # Reset navigation state
            st.session_state.previous_app_mode = None
            st.session_state.previous_assignment_stage = None
            
            st.rerun()

# Add the draft stage section to main function
def draft_stage_section():
    """Draft stage UI section for main function"""
    if st.session_state.show_draft_editor:
        show_draft_editor(st.session_state.assignment_draft, is_new_draft=False)
    else:
        st.subheader(f"Assignment Draft: {st.session_state.assignment_topic}")
        
        # Show plan in expander
        with st.expander("View Assignment Plan", expanded=False):
            st.markdown("<div class='plan-section'>", unsafe_allow_html=True)
            st.markdown("<p class='stage-indicator'>PLANNING STAGE</p>", unsafe_allow_html=True)
            st.markdown(st.session_state.assignment_plan)
            st.markdown("</div>", unsafe_allow_html=True)
        
        # Show the draft
        st.markdown("<div class='draft-section'>", unsafe_allow_html=True)
        st.markdown("<p class='stage-indicator'>ASSIGNMENT DRAFT</p>", unsafe_allow_html=True)
        st.markdown(f"<p class='revision-indicator'>Revision #{st.session_state.revision_number}</p>", unsafe_allow_html=True)
        st.markdown(st.session_state.assignment_draft)
        st.markdown("</div>", unsafe_allow_html=True)
        
        # Buttons for draft management and next steps
        col1, col2, col3, col4 = st.columns([1, 1, 1, 1])
        
        with col1:
            if st.button("Edit Draft", key="edit_draft_btn"):
                st.session_state.show_draft_editor = True
                if "original_draft_text" not in st.session_state:
                    st.session_state.original_draft_text = st.session_state.assignment_draft
                st.rerun()
        
        with col2:
            if st.button("Load Saved Draft", key="load_draft_btn"):
                # Show a selection of saved drafts
                saved_drafts = get_saved_drafts()
                if saved_drafts:
                    st.session_state.saved_drafts = saved_drafts
                    
                    with st.expander("Select a draft to load", expanded=True):
                        selected_draft = st.selectbox(
                            "Available Drafts",
                            options=[os.path.basename(p) for p in saved_drafts],
                            format_func=lambda x: x.replace("draft_", "").replace(".md", "").replace("_", " "),
                            key="draft_selector"
                        )
                        
                        if st.button("Load Selected Draft", key="confirm_load_draft_btn"):
                            selected_path = [p for p in saved_drafts if os.path.basename(p) == selected_draft][0]
                            loaded_draft = load_draft_from_file(selected_path)
                            
                            if loaded_draft:
                                st.session_state.assignment_draft = loaded_draft
                                st.session_state.draft_filename = selected_path
                                st.success(f"Loaded draft: {os.path.basename(selected_path)}")
                                st.rerun()
                else:
                    st.info("No saved drafts found.")
        
        with col3:
            if st.button("Back to Plan", key="back_to_plan_btn"):
                st.session_state.assignment_stage = "plan"
                st.rerun()
        
        with col4:
            if st.button("Request Critique", key="request_critique_btn"):
                critique = create_assignment_critique(
                    st.session_state.assignment_draft,
                    st.session_state.academic_level,
                    st.session_state.assignment_length,
                    st.session_state.assignment_tone
                )
                if critique:
                    st.rerun()
                    
def create_assignment_critique(draft, level, length, tone):
    """Generate a critique of the assignment draft with consideration for length and tone"""
    llm = st.session_state.llm
    
    prompt = f"""You are a theology professor evaluating a student assignment at {level} level.
    
    Review this assignment draft:
    {draft}
    
    The assignment requirements include:
    - Length: {length}
    - Tone: {tone}
    - Academic Level: {level}
    
    Provide a detailed critique focusing on:
    1. Theological depth and accuracy of arguments
    2. Quality of engagement with theological sources and concepts
    3. Clarity of thesis and supporting evidence
    4. Structure, organization and academic writing style
    5. Appropriateness of length (whether it meets the {length} requirement)
    6. Consistency and effectiveness of the {tone} tone
    7. Areas for improvement and specific suggestions
    
    Be constructive yet thorough in your assessment. Highlight both strengths and areas that need development.
    Consider what would make this assignment more compelling and academically rigorous.
    """
    
    try:
        with st.spinner("Creating assignment critique..."):
            critique = llm.predict(prompt)
            st.session_state.assignment_critique = critique
            st.session_state.assignment_stage = "critique"
            return critique
    except Exception as e:
        st.error(f"Error generating assignment critique: {str(e)}")
        return None

def revise_assignment_draft(topic, area, level, length, tone, plan, draft, critique):
    """Revise the assignment draft based on critique with attention to length and tone"""
    llm = st.session_state.llm
    
    prompt = f"""You are a theology writing expert revising an assignment for:
    
    ASSIGNMENT TOPIC: {topic}
    AREA OF THEOLOGY: {area}
    ACADEMIC LEVEL: {level}
    LENGTH REQUIREMENT: {length}
    TONE OF LANGUAGE: {tone}
    
    Original plan:
    {plan}
    
    Previous draft:
    {draft}
    
    Critique received:
    {critique}
    
    Create a revised and improved assignment that addresses all the critique points while maintaining the core thesis. Make specific improvements to theological arguments, engagement with sources, structure, and academic style.
    Focus particularly on:
    1. Deepening theological analysis and strengthening the scholarly quality of the work
    2. Ensuring the assignment meets the {length} requirement (not too short or too long)
    3. Maintaining a consistent and effective {tone} tone throughout
    4. Addressing all specific issues mentioned in the critique
    
    The final revised assignment should be properly formatted, well-structured, and meet all the requirements.
    """
    
    try:
        with st.spinner(f"Revising assignment draft (Revision #{st.session_state.revision_number})..."):
            revised_draft = llm.predict(prompt)
            st.session_state.assignment_draft = revised_draft
            st.session_state.revision_number += 1
            st.session_state.assignment_stage = "draft"
            return revised_draft
    except Exception as e:
        st.error(f"Error revising assignment draft: {str(e)}")
        return None

def main():
    ensure_directories()
    
    # Initialize session state
    initialize_session_state()
    
    # Handle returning from Advanced Chat mode
    handle_return_from_advanced_chat()
    
    # Create draftplan directory if it doesn't exist
    draftplan_dir = "./draftplan"
    os.makedirs(draftplan_dir, exist_ok=True)
    
    create_assignment_draft = update_create_assignment_draft()
    
    # Main title
    st.markdown("<h1 class='main-title'>Assistant to Theology Studies</h1>", unsafe_allow_html=True)
    st.markdown("<p class='theology-subtitle'>Exploring faith, scripture, and theological understanding through conversation</p>", unsafe_allow_html=True)
    
    # Display alert if images are missing
    if not nineveh_exists or not bible_exists:
        st.warning(f"""
        To enable background images:
        1. Create a folder named 'images' in the same directory as this script
        2. Place the Nineveh.jpg and divinity.png files in that folder
        3. Restart the application
        """)
    
    # Sidebar for application configuration
    with st.sidebar:
        st.title("Theology Assistant")
        
        # App mode selection
        st.header("App Mode")
        app_mode = st.radio(
            "Select Mode", 
            ["Simple Chat", "Advanced Chat", "Reading Q&A", "Assignment Assistant"],
            index=["Simple Chat", "Advanced Chat", "Reading Q&A", "Assignment Assistant"].index(st.session_state.app_mode),
            key="app_mode_radio",
            on_change=on_params_change
        )
        st.session_state.app_mode = app_mode
        
        # Model configuration section
        st.header("Model Configuration")
        
        # Model selection
        model_options = ["llama3.3", "deepseek-r1:32b", "qwq", "openthinker:32b", "mistral-small:24b", "gemma3:27b", "gpt-4o"]
        selected_model = st.selectbox(
            "Select Model",
            model_options,
            index=model_options.index(st.session_state.model) if st.session_state.model in model_options else 0,
            key="model",
            on_change=on_params_change
        )
        
        # Add OpenAI API Key input if an OpenAI model is selected
        if ("gpt" in st.session_state.model) or ("o3-mini" in st.session_state.model):
            openai_api_key = st.sidebar.text_input(
                "OpenAI API Key",
                type="password",
                key="openai_api_key",
                help="Enter your OpenAI API key to use GPT models",
                on_change=on_params_change
            )
            
            if not openai_api_key:
                st.sidebar.warning("Please enter your OpenAI API key to use GPT models")
                # Disable the chat input if no API key is provided
                st.session_state.api_key_missing = True
            else:
                # Store in session state or environment
                os.environ["OPENAI_API_KEY"] = openai_api_key
                st.session_state.api_key_missing = False
        else:
            # No API key needed for non-GPT models
            st.session_state.api_key_missing = False
        
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
            
            # Only show this for assignment assistant mode
            if st.session_state.app_mode == "Assignment Assistant":
                st.header("Assignment Assistant Settings")
                max_revisions = st.slider(
                    "Maximum Revisions",
                    min_value=1,
                    max_value=5,
                    value=st.session_state.max_revisions,
                    step=1,
                    key="max_revisions_slider",
                    help="Maximum number of revision cycles for the assignment",
                    on_change=lambda: setattr(st.session_state, "max_revisions", st.session_state.max_revisions_slider)
                )
        
        # Document upload section (only in Reading Q&A mode)
        if st.session_state.app_mode == "Reading Q&A":
            st.header("Upload Documents")
            
            # Multi-document upload
            uploaded_files = st.file_uploader(
                "Choose files", 
                type=["pdf", "docx", "txt", "md"],
                accept_multiple_files=True
            )
            
            if uploaded_files and (len(uploaded_files) != len(st.session_state.uploaded_doc_names)):
                st.info("Processing documents...")
                
                # Reset document state
                st.session_state.documents = []
                st.session_state.uploaded_doc_names = []
                
                # Process each uploaded file
                for uploaded_file in uploaded_files:
                    file_docs = process_document(uploaded_file)
                    
                    if file_docs:
                        st.session_state.documents.extend(file_docs)
                        st.session_state.uploaded_doc_names.append(uploaded_file.name)
                
                if st.session_state.documents:
                    # Create retriever from all documents
                    retriever = process_documents_for_qa(st.session_state.documents)
                    
                    if retriever:
                        st.success(f"Processed {len(st.session_state.uploaded_doc_names)} documents successfully!")
                        st.session_state.retriever = retriever
                        st.session_state.retriever_changed = True
                        
                        # Generate document summary
                        full_text = extract_text_from_documents(st.session_state.documents)
                        with st.spinner("Generating document summary..."):
                            st.session_state.document_summary = generate_document_summary(
                                full_text, 
                                st.session_state.llm
                            )
                        
                        # Clear previous chat on new document
                        st.session_state.messages = []
                    else:
                        st.error("Failed to create retriever from documents.")
                else:
                    st.error("Failed to process any documents.")
            
            # Show list of uploaded documents
            if st.session_state.uploaded_doc_names:
                st.markdown("<div class='document-list'>", unsafe_allow_html=True)
                st.subheader("Uploaded Documents:")
                for i, doc_name in enumerate(st.session_state.uploaded_doc_names):
                    st.markdown(f"{i+1}. {doc_name}")
                st.markdown("</div>", unsafe_allow_html=True)
        
        # Clear conversation button
        if st.session_state.app_mode != "Assignment Assistant":
            if st.button("Clear Conversation"):
                st.session_state.messages = []
                st.session_state.params_changed = True  # Force conversation reset
        else:
            if st.button("Reset Assignment Assistant"):
                st.session_state.assignment_topic = ""
                st.session_state.theology_area = ""
                st.session_state.academic_level = "undergraduate"
                st.session_state.assignment_plan = ""
                st.session_state.assignment_draft = ""
                st.session_state.assignment_critique = ""
                st.session_state.revision_number = 0
                st.session_state.assignment_stage = "input"
    
    # Main content area
    cols = st.columns([3, 1]) if st.session_state.app_mode == "Reading Q&A" and st.session_state.documents else [st.columns([1])[0], None]
    
    with cols[0]:
        if st.session_state.app_mode == "Simple Chat":
            st.header("Simple Chat")
            st.subheader(f"Powered by {st.session_state.model}")
        elif st.session_state.app_mode == "Advanced Chat":
            st.header("Advanced Chat")
            st.subheader(f"Model: {st.session_state.model} | Temp: {st.session_state.temperature} | Top-P: {st.session_state.top_p}")
        elif st.session_state.app_mode == "Reading Q&A":
            st.header("Reading Q&A")
            if "retriever" in st.session_state and st.session_state.retriever:
                st.subheader("Ask questions about your theological document")
            else:
                st.subheader("Please upload a theological document in the sidebar")
        
        # Display chat messages from history
        for message in st.session_state.messages:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])
        
        # Chat input
        if prompt := st.chat_input("What theology topic would you like to explore?", disabled=st.session_state.get("api_key_missing", False)):
            # Add user message to chat history
            st.session_state.messages.append({"role": "user", "content": prompt})
            
            # Display user message in chat container
            with st.chat_message("user"):
                st.markdown(prompt)
            
            # Check if LLM is available
            if not hasattr(st.session_state, 'llm') or st.session_state.llm is None:
                with st.chat_message("assistant"):
                    st.error("Please configure a valid API key for the selected model")
                return
            
            # Generate and display assistant response
            with st.chat_message("assistant"):
                # Create an empty container for the streaming response
                response_container = st.empty()
                full_response = ""
                
                # For Reading Q&A mode, which may not support streaming easily
                if st.session_state.app_mode == "Reading Q&A" and "retriever" in st.session_state and st.session_state.retriever:
                    with st.spinner(f"Thinking using {st.session_state.model}..."):
                        response = st.session_state.conversation({"question": prompt})
                        response_text = response.get("answer", "I couldn't find an answer in the document.")
                        response_container.markdown(response_text)
                        full_response = response_text
                else:
                    # For regular chat modes that can use streaming
                    streaming_handler = StreamingCallbackHandler(response_container)
                    
                    with st.spinner(f"Thinking using {st.session_state.model}..."):
                        try:
                            response_text = st.session_state.conversation.predict(
                                input=prompt,
                                callbacks=[streaming_handler]
                            )
                            full_response = streaming_handler.text or response_text
                        except Exception as e:
                            error_message = f"Error generating response: {str(e)}"
                            response_container.error(error_message)
                            full_response = error_message
            
            # Add assistant response to chat history
            st.session_state.messages.append({"role": "assistant", "content": full_response})
    
    # Display word cloud and document analysis for Document Q&A mode
    if st.session_state.app_mode == "Reading Q&A" and st.session_state.documents and cols[1] is not None:
        with cols[1]:
            st.header("Document Analysis")
            
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
    

    # Assignment Assistant mode (renamed from Course Designer)
    if st.session_state.app_mode == "Assignment Assistant":
        if nineveh_exists:
            st.markdown('<div class="nineveh-bg">', unsafe_allow_html=True)
        
            st.subheader("Theology Assignment Assistant")
        
        if bible_exists:
            st.markdown('<div class="bible-bg">', unsafe_allow_html=True)
        
        st.markdown("<p>Create well-structured theology assignments with iterative refinement. Fill the topic, area and level, press 'create the plan' after stop running, PRESS 'THE BOX' at bottom first right hand side AGAIN</p>", unsafe_allow_html=True)
        
        # White semi-transparent background for assignment area
        st.markdown('<div>', unsafe_allow_html=True)
        
        # Input stage - Get topic, area, and level
        if st.session_state.assignment_stage == "input":
            st.subheader("Create a New Theology Assignment")
            
            # Assignment input form
            with st.form("assignment_input_form"):
                assignment_topic = st.text_input(
                    "Assignment Topic:",
                    key="topic_input",
                    help="Enter the main topic for your theology assignment"
                )
                
                theology_area = st.text_input(
                    "Area of Theology:",
                    key="area_input",
                    help="E.g., Biblical Studies, Systematic Theology, Church History, Ethics, etc."
                )
                
                academic_level = st.selectbox(
                    "Academic Level:",
                    ["undergraduate", "a master level", "thesis"],
                    key="level_input",
                    help="Select the academic level for your assignment"
                )
                
                assignment_length = st.selectbox(
                    "Length of Assignment:",
                    ["750-1000 words", "1500-2000 words", "2500-3000 words", "4000-5000 words", "7000-8000 words"],
                    index=1,
                    key="length_input",
                    help="Select the expected length of your assignment"
                )
                
                assignment_tone = st.selectbox(
                    "Tone of Language:",
                    ["Academic", "Analytical", "Reflective", "Critical", "Expository"],
                    key="tone_input",
                    help="Select the appropriate tone for your theological writing"
                )
                
                submit_button = st.form_submit_button("Create Assignment Plan")
                
                if submit_button:
                    if not assignment_topic or not theology_area:
                        st.error("Please provide both a topic and an area of theology.")
                    else:
                        st.session_state.assignment_topic = assignment_topic
                        st.session_state.theology_area = theology_area
                        st.session_state.academic_level = academic_level
                        st.session_state.assignment_length = assignment_length
                        st.session_state.assignment_tone = assignment_tone
                        
                        # Generate the initial plan
                        create_assignment_plan(assignment_topic, theology_area, academic_level, assignment_length, assignment_tone)
        
   # Plan stage - Display the plan and move to draft
        elif st.session_state.assignment_stage == "plan":
            # Replace this section with the enhanced plan stage function
            if st.session_state.show_plan_editor:
                # Show plan editor
                st.subheader(f"Edit Assignment Plan: {st.session_state.assignment_topic}")
                
                edited_plan = st.text_area(
                    "Plan Editor",
                    value=st.session_state.assignment_plan,
                    height=400,
                    key="plan_editor"
                )
                
                col1, col2 = st.columns([1, 1])
                with col1:
                    if st.button("Save Plan", key="save_plan_btn"):
                        if edited_plan.strip():
                            # Save the edited plan with timestamp
                            filename = save_plan_to_file(
                                edited_plan,
                                st.session_state.assignment_topic
                            )
                            
                            if filename:
                                st.session_state.assignment_plan = edited_plan
                                st.session_state.plan_filename = filename
                                st.success(f"Plan saved to {os.path.basename(filename)}")
                                
                                # Update saved plans list
                                st.session_state.saved_plans = get_saved_plans()
                                st.session_state.show_plan_editor = False
                                st.rerun()
                        else:
                            st.error("Cannot save an empty plan.")
                
                with col2:
                    if st.button("Cancel Editing", key="cancel_plan_btn"):
                        st.session_state.show_plan_editor = False
                        st.rerun()
            else:
                # Display the current plan
                st.subheader(f"Assignment Plan: {st.session_state.assignment_topic}")
                
                st.markdown("<div class='plan-section'>", unsafe_allow_html=True)
                st.markdown("<p class='stage-indicator'>PLANNING STAGE</p>", unsafe_allow_html=True)
                st.markdown(st.session_state.assignment_plan)
                st.markdown("</div>", unsafe_allow_html=True)
                
                # Buttons for plan management and next steps
                col1, col2, col3 = st.columns([1, 1, 1])
                
                with col1:
                    if st.button("Edit Plan", key="edit_plan_btn"):
                        st.session_state.show_plan_editor = True
                        st.rerun()
                
                with col2:
                    if st.button("Load Saved Plan", key="load_plan_btn"):
                        # Show a selection of saved plans
                        saved_plans = get_saved_plans()
                        if saved_plans:
                            st.session_state.saved_plans = saved_plans
                            
                            with st.expander("Select a plan to load", expanded=True):
                                selected_plan = st.selectbox(
                                    "Available Plans",
                                    options=[os.path.basename(p) for p in saved_plans],
                                    format_func=lambda x: x.replace("plan_", "").replace(".md", "").replace("_", " "),
                                    key="plan_selector"
                                )
                                
                                if st.button("Load Selected Plan", key="confirm_load_btn"):
                                    selected_path = [p for p in saved_plans if os.path.basename(p) == selected_plan][0]
                                    loaded_plan = load_plan_from_file(selected_path)
                                    
                                    if loaded_plan:
                                        st.session_state.assignment_plan = loaded_plan
                                        st.session_state.plan_filename = selected_path
                                        st.success(f"Loaded plan: {os.path.basename(selected_path)}")
                                        st.rerun()
                        else:
                            st.info("No saved plans found.")
                
                with col3:
                    if st.button("Create Assignment Draft", key="create_draft_btn"):
                        draft = create_assignment_draft(
                            st.session_state.assignment_topic,
                            st.session_state.theology_area,
                            st.session_state.academic_level,
                            st.session_state.assignment_length,
                            st.session_state.assignment_tone,
                            st.session_state.assignment_plan
                        )

    # Draft stage - Display the draft and allow critique 
        elif st.session_state.assignment_stage == "draft":
            draft_stage_section()
            
        # Critique stage - Display the critique and allow revision
        elif st.session_state.assignment_stage == "critique":
            st.subheader(f"Assignment Evaluation: {st.session_state.assignment_topic}")
            
            # Show plan and draft in expanders
            with st.expander("View Assignment Plan"):
                st.markdown("<div class='plan-section'>", unsafe_allow_html=True)
                st.markdown("<p class='stage-indicator'>PLANNING STAGE</p>", unsafe_allow_html=True)
                st.markdown(st.session_state.assignment_plan)
                st.markdown("</div>", unsafe_allow_html=True)
            
            with st.expander("View Current Draft"):
                st.markdown("<div class='draft-section'>", unsafe_allow_html=True)
                st.markdown("<p class='stage-indicator'>ASSIGNMENT DRAFT</p>", unsafe_allow_html=True)
                st.markdown(f"<p class='revision-indicator'>Revision #{st.session_state.revision_number}</p>", unsafe_allow_html=True)
                st.markdown(st.session_state.assignment_draft)
                st.markdown("</div>", unsafe_allow_html=True)
            
            # Show the critique
            st.markdown("<div class='critique-section'>", unsafe_allow_html=True)
            st.markdown("<p class='stage-indicator'>PROFESSOR FEEDBACK</p>", unsafe_allow_html=True)
            st.markdown(st.session_state.assignment_critique)
            st.markdown("</div>", unsafe_allow_html=True)
            
            # Buttons for next steps
            col1, col2, col3 = st.columns([1, 1, 1])
            
            with col1:
                if st.button("Back to Draft"):
                    st.session_state.assignment_stage = "draft"
                    st.rerun()
            
            with col2:
                if st.button("Finalize Assignment"):
                    st.session_state.assignment_stage = "final"
                    st.rerun()
            
            with col3:
                # Only show revise button if under max revisions
                if st.session_state.revision_number <= st.session_state.max_revisions:
                    if st.button("Revise Draft"):
                        revised_draft = revise_assignment_draft(
                            st.session_state.assignment_topic,
                            st.session_state.theology_area,
                            st.session_state.academic_level,
                            st.session_state.assignment_length,
                            st.session_state.assignment_tone,
                            st.session_state.assignment_plan,
                            st.session_state.assignment_draft,
                            st.session_state.assignment_critique
                        )
                else:
                    st.warning(f"Maximum revisions ({st.session_state.max_revisions}) reached.")
        
        # Final stage - Display the complete assignment with download options
        elif st.session_state.assignment_stage == "final":
            st.subheader(f"Final Assignment: {st.session_state.assignment_topic}")
            
            st.success(f"Your theology assignment has been finalized after {st.session_state.revision_number-1} revisions!")
            
            # Show all components in tabs
            tabs = st.tabs(["Complete Assignment", "Assignment Plan", "Critique"])
            
            with tabs[0]:
                st.markdown("<div class='draft-section'>", unsafe_allow_html=True)
                st.markdown("<p class='stage-indicator'>FINAL ASSIGNMENT</p>", unsafe_allow_html=True)
                st.markdown(f"<p class='revision-indicator'>Revision #{st.session_state.revision_number}</p>", unsafe_allow_html=True)
                st.markdown(st.session_state.assignment_draft)
                
                # Download options
                assignment_text = st.session_state.assignment_draft
                st.download_button(
                    label="Download Assignment as Text",
                    data=assignment_text,
                    file_name=f"theology_assignment_{st.session_state.assignment_topic.replace(' ', '_')}.txt",
                    mime="text/plain"
                )
                
                st.markdown("</div>", unsafe_allow_html=True)
            
            with tabs[1]:
                st.markdown("<div class='plan-section'>", unsafe_allow_html=True)
                st.markdown("<p class='stage-indicator'>ORIGINAL PLAN</p>", unsafe_allow_html=True)
                st.markdown(st.session_state.assignment_plan)
                st.markdown("</div>", unsafe_allow_html=True)
            
            with tabs[2]:
                st.markdown("<div class='critique-section'>", unsafe_allow_html=True)
                st.markdown("<p class='stage-indicator'>FINAL FEEDBACK</p>", unsafe_allow_html=True)
                st.markdown(st.session_state.assignment_critique)
                st.markdown("</div>", unsafe_allow_html=True)
            
            # Return to beginning button
            if st.button("Create New Assignment"):
                st.session_state.assignment_topic = ""
                st.session_state.theology_area = ""
                st.session_state.academic_level = "undergraduate"
                st.session_state.assignment_plan = ""
                st.session_state.assignment_draft = ""
                st.session_state.assignment_critique = ""
                st.session_state.revision_number = 0
                st.session_state.assignment_stage = "input"
                st.rerun()
        
        st.markdown('</div>', unsafe_allow_html=True)
        
        if nineveh_exists:
            st.markdown('</div>', unsafe_allow_html=True)
            
if __name__ == "__main__":
    main()
