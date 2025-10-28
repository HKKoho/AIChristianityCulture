import streamlit as st
from langchain_community.llms import Ollama
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory

def initialize_session_state():
    """Initialize session state variables if they don't exist"""
    if "messages" not in st.session_state:
        st.session_state.messages = []
    if "conversation" not in st.session_state or st.session_state.get("params_changed", False):
        st.session_state.params_changed = False
        # Get parameters from session state
        temperature = st.session_state.get("temperature", 0.7)
        top_p = st.session_state.get("top_p", 0.9)
        model = st.session_state.get("model", "llama3.1")
        
        # Initialize the language model with parameters
        llm = Ollama(
            model=model,
            temperature=temperature,
            top_p=top_p
        )
        
        # Initialize memory for persistent chat history
        memory = ConversationBufferMemory(return_messages=True)
        
        # Initialize the conversation chain
        st.session_state.conversation = ConversationChain(
            llm=llm,
            memory=memory,
            verbose=False
        )

def on_params_change():
    """Callback when parameters are changed"""
    st.session_state.params_changed = True

def main():
    st.title("Advanced Streamlit Ollama Chatbot")
    
    # Sidebar for model configuration
    with st.sidebar:
        st.header("Model Configuration")
        
        # Model selection
        model_options = ["llama3.1", "deepseek-r1:8b", "qwen2.5", "mistral-nemo"]
        selected_model = st.selectbox(
            "Select Model", 
            model_options, 
            index=0, 
            key="model",
            on_change=on_params_change
        )
        
        # Model parameters
        temperature = st.slider(
            "Temperature", 
            min_value=0.0, 
            max_value=1.0, 
            value=0.7, 
            step=0.1, 
            key="temperature",
            help="Higher values make the output more random, lower values make it more deterministic",
            on_change=on_params_change
        )
        
        top_p = st.slider(
            "Top P", 
            min_value=0.0, 
            max_value=1.0, 
            value=0.9, 
            step=0.1, 
            key="top_p",
            help="Controls diversity via nucleus sampling",
            on_change=on_params_change
        )
        
        # Clear conversation button
        if st.button("Clear Conversation"):
            st.session_state.messages = []
            st.session_state.conversation = None
            st.session_state.params_changed = True
    
    # Initialize session state
    initialize_session_state()
    
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
                response = st.session_state.conversation.predict(input=prompt)
                st.markdown(response)
        
        # Add assistant response to chat history
        st.session_state.messages.append({"role": "assistant", "content": response})

if __name__ == "__main__":
    main()
