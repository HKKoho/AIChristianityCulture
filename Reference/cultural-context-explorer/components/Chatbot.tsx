
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { createChat, sendMessageToChat } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { SendIcon, UserIcon, BotIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeChat = () => {
      chatRef.current = createChat();
      setMessages([
        {
          role: 'model',
          content: "Greetings. I am the Serving Officer. How may I assist you with your inquiries into cultural and historical contexts today?"
        }
      ]);
    };
    initializeChat();
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading || !chatRef.current) return;
    
    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chat = chatRef.current;
      const stream = await sendMessageToChat(chat, input);
      
      let modelResponse = '';
      setMessages(prev => [...prev, { role: 'model', content: '' }]);

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = modelResponse;
          return newMessages;
        });
      }

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { role: 'model', content: "I seem to be experiencing a technical difficulty. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-3xl mx-auto bg-secondary shadow-2xl rounded-lg overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-xl font-bold text-center text-text-primary">Serving Officer Chat</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-accent flex-shrink-0 flex items-center justify-center">
                <BotIcon className="w-5 h-5 text-white" />
              </div>
            )}
            <div className={`max-w-md p-3 rounded-lg shadow whitespace-pre-wrap ${msg.role === 'user' ? 'bg-accent text-white rounded-br-none' : 'bg-primary text-text-primary rounded-bl-none'}`}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-600 flex-shrink-0 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-text-primary" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex-shrink-0 flex items-center justify-center">
              <BotIcon className="w-5 h-5 text-white" />
            </div>
            <div className="max-w-md p-3 rounded-lg bg-primary text-text-primary rounded-bl-none flex items-center">
              <LoadingSpinner />
              <span className="ml-2 text-text-secondary">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 bg-primary rounded-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask the Serving Officer..."
            className="flex-1 bg-transparent p-3 text-text-primary focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 text-white bg-accent rounded-r-lg hover:bg-accent-hover disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
