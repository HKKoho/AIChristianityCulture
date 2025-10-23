import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { MessageCircle, X, Send, User, Bot, Loader } from 'lucide-react';
import { createChatSession, sendChatMessage } from '../services/geminiChatService';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

interface CulturalExplorerProps {
  category: 'eat' | 'walk' | 'listen' | 'see' | 'read' | 'meditate';
  context?: string;
}

export const CulturalExplorer: React.FC<CulturalExplorerProps> = ({ category, context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const categoryConfig = {
    eat: {
      title: '飲食文化探索',
      titleEn: 'Food Culture Explorer',
      systemContext: 'Christian food traditions, communion, agape feasts, biblical meals',
      greeting: '您好！我是文化探索助手。我可以回答關於基督教飲食傳統、聖餐、愛筵等方面的問題。'
    },
    walk: {
      title: '朝聖之旅探索',
      titleEn: 'Pilgrimage Explorer',
      systemContext: 'Christian pilgrimage routes, holy sites, walking paths, biblical locations',
      greeting: '您好！我是文化探索助手。我可以回答關於基督教朝聖路線、聖地、聖經地點等方面的問題。'
    },
    listen: {
      title: '聖樂文化探索',
      titleEn: 'Sacred Music Explorer',
      systemContext: 'Christian music, hymns, chants, sacred audio, worship traditions',
      greeting: '您好！我是文化探索助手。我可以回答關於基督教音樂、聖詩、聖歌等方面的問題。'
    },
    see: {
      title: '視覺藝術探索',
      titleEn: 'Visual Arts Explorer',
      systemContext: 'Christian art, icons, architecture, paintings, sculptures, manuscripts',
      greeting: '您好！我是文化探索助手。我可以回答關於基督教藝術、聖像、建築等方面的問題。'
    },
    read: {
      title: '經典文獻探索',
      titleEn: 'Sacred Texts Explorer',
      systemContext: 'Biblical manuscripts, church fathers, theological writings, devotional literature',
      greeting: '您好！我是文化探索助手。我可以回答關於聖經抄本、教父著作、神學文獻等方面的問題。'
    },
    meditate: {
      title: '靈修實踐探索',
      titleEn: 'Spiritual Practice Explorer',
      systemContext: 'Christian meditation, contemplative prayer, spiritual exercises, mysticism',
      greeting: '您好！我是文化探索助手。我可以回答關於基督教靈修、默觀祈禱、靈性操練等方面的問題。'
    }
  };

  const config = categoryConfig[category];

  useEffect(() => {
    if (isOpen && messages.length === 0 && createChatSession && sendChatMessage) {
      initializeChat();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeChat = useCallback(() => {
    const chat = createChatSession();
    if (!chat) return;

    chatRef.current = chat;
    setMessages([
      {
        role: 'model',
        content: config.greeting
      }
    ]);
  }, [config.greeting]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chat = chatRef.current;
      const stream = await sendChatMessage(chat, input);

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
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        { role: 'model', content: '抱歉，我遇到了技術問題。請稍後再試。' }
      ]);
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
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40 flex items-center gap-2"
        aria-label="Open Cultural Explorer"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="hidden md:inline text-sm font-semibold">文化探索</span>
      </button>

      {/* Sidebar Chat Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full animate-slide-in-right">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{config.title}</h2>
                <p className="text-sm opacity-90">{config.titleEn}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    msg.role === 'user' ? 'justify-end' : ''
                  }`}
                >
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] p-3 rounded-lg shadow whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="max-w-[75%] p-3 rounded-lg bg-white text-gray-800 rounded-bl-none border border-gray-200 flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-500">思考中...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="詢問文化探索助手..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
};
