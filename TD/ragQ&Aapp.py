import streamlit as st
import tempfile
import os
from langchain_community.llms import Ollama
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import FAISS

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
        embeddings = OllamaEmbeddings(model="llama3.1")
        vectorstore = FAISS.from_documents(chunks, embeddings)
        
        # Clean up the temporary file
        os.unlink(temp_file_path)
        
        return vectorstore.as_retriever()
    
    except Exception as e:
        st.error(f"Error processing document: {str(e)}")
        # Clean up the temporary file
        os.unlink(temp_file_path)
        return None

def initialize_session_state():
    """Initialize session state variables if they don't exist"""
    if "messages" not in st.session_state:
        st.session_state.messages = []
    
    if "conversation" not in st.session_state or st.session_state.get("retriever_changed", False):
        st.session_state.retriever_changed = False
        
        retriever = st.session_state.get("retriever", None)
        if retriever:
            # Initialize the language model
            llm = Ollama(model="llama3.1", temperature=0.5)
            
            # Initialize memory for persistent chat history
            memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
            
            # Initialize the conversation chain with document retrieval
            st.session_state.conversation = ConversationalRetrievalChain.from_llm(
                llm=llm,
                retriever=retriever,
                memory=memory,
                verbose=False
            )
        else:
            # Simple conversation without document retrieval
            llm = Ollama(model="llama3.1", temperature=0.7)
            memory = ConversationBufferMemory(return_messages=True)
            st.session_state.conversation = ConversationChain(
                llm=llm,
                memory=memory,
                verbose=False
            )

def main():
    st.title("Document Q&A Chatbot")
    st.subheader("Ask questions about your documents")
    
    # Sidebar for document upload
    with st.sidebar:
        st.header("Upload Document")
        uploaded_file = st.file_uploader("Choose a file", type=["pdf", "docx", "txt", "md"])
        
        if uploaded_file is not None:
            st.info("Processing document...")
            retriever = process_document(uploaded_file)
            
            if retriever:
                st.success("Document processed successfully!")
                st.session_state.retriever = retriever
                st.session_state.retriever_changed = True
                st.session_state.messages = []  # Clear previous chat on new document
            else:
                st.error("Failed to process the document.")
        
        if st.button("Clear Conversation"):
            st.session_state.messages = []
    
    # Initialize session state
    initialize_session_state()
    
    # Display chat messages from history
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # Chat input
    if prompt := st.chat_input("Ask a question about your document..."):
        # Add user message to chat history
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        # Display user message in chat container
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Generate and display assistant response
        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                if "retriever" in st.session_state and st.session_state.retriever:
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
