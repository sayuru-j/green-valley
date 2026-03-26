import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "@/lib/auth";

interface Action {
  label: string;
  path?: string;
  triggerMessage?: string;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  actions?: Action[];
}

const initialMessage: Message = {
  id: "init",
  text: "Hi! Welcome to Green Valley Resort. How can I assist you today?",
  sender: "bot",
  actions: [
    { label: "Room Prices", triggerMessage: "What are the room prices?" },
    { label: "Banquet Info", triggerMessage: "Tell me about banquet halls" },
    { label: "Contact Support", path: "/contact" }
  ]
};

const ChatWidget = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  // Load from local storage
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("chat_messages");
    if (saved) return JSON.parse(saved);
    return [initialMessage];
  });
  
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [fallbackCount, setFallbackCount] = useState(() => {
    const saved = localStorage.getItem("chat_fallback_count");
    return saved ? parseInt(saved) : 0;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
    localStorage.setItem("chat_fallback_count", fallbackCount.toString());
  }, [messages, fallbackCount]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const getBotResponse = async (userText: string, currentMessages: Message[]) => {
    setIsTyping(true);
    
    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: userText,
          history: currentMessages,
        }),
      });

      const data = await response.json();

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: data.response || "I am currently unavailable. Please try again later.",
        sender: "bot"
      }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "I encountered an error connecting to the server. Please check your connection or contact support.",
        sender: "bot",
        actions: [{ label: "Contact Us", path: "/contact" }]
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = (overrideText?: string) => {
    const text = overrideText || inputValue.trim();
    if (!text) return;

    const newMessages: Message[] = [...messages, { 
      id: Date.now().toString(), 
      text, 
      sender: "user" 
    }];
    
    setMessages(newMessages);
    setInputValue("");
    
    getBotResponse(text, newMessages);
  };

  const handleActionClick = (action: Action) => {
    if (action.path) {
      navigate(action.path);
      setIsOpen(false);
    } else if (action.triggerMessage) {
      handleSend(action.triggerMessage);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[90vw] sm:w-[380px] max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
            style={{ height: "480px", transformOrigin: "bottom right" }}
          >
            {/* Header */}
            <div className="bg-green-800 p-4 text-white flex justify-between items-center shadow-md">
              <h3 className="font-semibold text-lg font-serif">Resort Concierge</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors text-xl leading-none h-6 w-6 flex items-center justify-center rounded-full bg-white/10"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-[15px] shadow-sm leading-relaxed ${
                      msg.sender === "user" 
                        ? "bg-yellow-500 text-white rounded-br-none" 
                        : "bg-gray-200 text-black rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  
                  {/* Action Buttons */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 w-full justify-start pl-1">
                      {msg.actions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionClick(act)}
                          className="px-3 py-1.5 bg-white border border-gray-200 text-green-800 text-sm rounded-full font-medium shadow-sm hover:bg-gray-50 transition-colors"
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="bg-gray-200 text-gray-600 self-start rounded-2xl rounded-bl-none px-4 py-3 text-sm italic w-fit flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                </div>
              )}
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-green-800 focus:ring-1 focus:ring-green-800 transition-shadow bg-gray-50"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputValue.trim()}
                className="bg-green-800 text-white rounded-full p-2 h-10 w-10 flex items-center justify-center font-semibold hover:bg-green-700 transition-colors shadow-md disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-green-800 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
