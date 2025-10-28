import streamlit as st
import tempfile
import os
import re
import base64
from collections import Counter
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from wordcloud import WordCloud
import datetime
import glob
import html

# Langchain imports
from langchain_community.llms import Ollama
from langchain.chains import ConversationChain, ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.prompts import PromptTemplate

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

# Document processing functions
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

def extract_text_from_documents(documents):
    """Extract text from document objects"""
    return " ".join([doc.page_content for doc in documents])

def generate_document_summary(text, llm):
    """Generate a concise summary of the document(s)"""
    try:
        # Truncate text if it's very long to prevent context length issues
        text_sample = text[:10000] if len(text) > 10000 else text
        
        prompt = f"""Please provide a concise summary of the following document in less than 150 words. 
        Focus on the main accounting themes, key points, and overall purpose of the text:
        
        {text_sample}
        
        SUMMARY (less than 150 words):"""
        
        summary = llm.predict(prompt)
        return summary
    except Exception as e:
        return f"Error generating summary: {str(e)}"

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

# Assignment plan functions
def create_assignment_plan(topic, area, level, length, tone):
    """Generate an assignment plan based on topic, area, level, length and tone"""
    llm = st.session_state.llm
    
    prompt = f"""You are an accounting education expert tasked to create an assignment plan.
    
    ASSIGNMENT TOPIC: {topic}
    AREA OF ACCOUNTING: {area}
    ACADEMIC LEVEL: {level}
    LENGTH REQUIREMENT: {length}
    TONE OF LANGUAGE: {tone}
    
    Create a detailed outline for this accounting assignment. Include:
    1. A clear thesis statement or research question
    2. 3-5 main sections or arguments to develop (with appropriate depth for {length})
    3. Key accounting concepts that need to be addressed
    4. Essential texts, standards, or accounting sources to engage with
    5. Methodological approach appropriate for this assignment
    
    Keep your response structured and academically rigorous for an accounting student at {level} level.
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
    md_content = f"""# Accounting Assignment Plan: {topic}

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

# Assignment draft functions
def create_assignment_draft(topic, area, level, length, tone, plan):
    """Generate an assignment draft based on plan, length and tone"""
    llm = st.session_state.llm
    
    prompt = f"""You are an accounting writing expert creating a detailed assignment draft for:
    
    ASSIGNMENT TOPIC: {topic}
    AREA OF ACCOUNTING: {area}
    ACADEMIC LEVEL: {level}
    LENGTH REQUIREMENT: {length}
    TONE OF LANGUAGE: {tone}
    
    Based on this plan:
    {plan}
    
    Now create a well-structured draft of the assignment. Include:
    1. Introduction with clear thesis statement
    2. Main body sections as outlined in the plan
    3. Substantive accounting arguments with appropriate depth
    4. Engagement with relevant accounting sources and standards
    5. Conclusion that synthesizes the key points
    
    For {level} level, ensure appropriate accounting depth, scholarly rigor, and proper academic style.
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
    md_content = f"""# Accounting Assignment Draft: {topic}

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

# Assignment critique functions
def create_assignment_critique(draft, level, length, tone):
    """Generate a critique of the assignment draft with consideration for length and tone"""
    llm = st.session_state.llm
    
    prompt = f"""You are an accounting professor evaluating a student assignment at {level} level.
    
    Review this assignment draft:
    {draft}
    
    The assignment requirements include:
    - Length: {length}
    - Tone: {tone}
    - Academic Level: {level}
    
    Provide a detailed critique focusing on:
    1. Accounting depth and accuracy of arguments
    2. Quality of engagement with accounting sources and concepts
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
    
    prompt = f"""You are an accounting writing expert revising an assignment for:
    
    ASSIGNMENT TOPIC: {topic}
    AREA OF ACCOUNTING: {area}
    ACADEMIC LEVEL: {level}
    LENGTH REQUIREMENT: {length}
    TONE OF LANGUAGE: {tone}
    
    Original plan:
    {plan}
    
    Previous draft:
    {draft}
    
    Critique received:
    {critique}
    
    Create a revised and improved assignment that addresses all the critique points while maintaining the core thesis. Make specific improvements to accounting arguments, engagement with sources, structure, and academic style.
    Focus particularly on:
    1. Deepening accounting analysis and strengthening the scholarly quality of the work
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

# Session state initialization
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
        st.session_state.documents = []
    if "document_summary" not in st.session_state:
        st.session_state.document_summary = ""
    if "uploaded_doc_names" not in st.session_state:
        st.session_state.uploaded_doc_names = []
    
    # Initialize assignment assistant variables
    if "assignment_topic" not in st.session_state:
        st.session_state.assignment_topic = ""
    if "accounting_area" not in st.session_state:
        st.session_state.accounting_area = ""
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
        llm = Ollama(
            model=model,
            temperature=temperature,
            top_p=top_p
        )
        
        # Store the LLM in session state for use in generating summaries
        st.session_state.llm = llm
        
        # Handle different modes
        if st.session_state.app_mode == "Reading Q&A" and "retriever" in st.session_state and st.session_state.retriever:
            # Initialize memory for persistent chat history
            memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
            
            # Custom prompt template for reading Q&A
            custom_prompt_template = """You are a helpful accounting assistant that answers questions based on the provided accounting texts.
            
            When answering, follow these guidelines:
            1. Focus on providing insights directly from the text
            2. Cite relevant passages when possible
            3. If the text doesn't contain the answer, acknowledge this and provide general accounting insight
            4. Maintain a respectful, scholarly tone appropriate for accounting studies
            5. Provide balanced perspectives when discussing accounting standards or controversial topics
            
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

# Directory utilities
def ensure_directories():
    """Ensure all required directories exist"""
    os.makedirs("./draftplan", exist_ok=True)
    os.makedirs("./draftwriting", exist_ok=True)

# Navigation functions
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

# Function for handling parameter changes
def on_params_change():
    """Callback when parameters are changed"""
    st.session_state.params_changed = True
    
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
    
    prompt = f"""You are an accounting professor evaluating a student assignment at {level} level.
    
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
    
    prompt = f"""You are an accounting writing expert revising an assignment for:
    
    ASSIGNMENT TOPIC: {topic}
    AREA OF ACCOUNTING: {area}
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

