import React, { useState, useEffect } from 'react';
import { Send, User, Bot, LogOut } from 'lucide-react';
import FAQDashboard from './components/FAQDashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showFAQ, setShowFAQ] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchQuickReplies();
  }, []);

  const fetchQuickReplies = async () => {
    try {
      const response = await fetch('http://localhost:9090/api/university/quick-replies');
      const data = await response.json();
      setQuickReplies(data);
    } catch (error) {
      console.error('Error fetching quick replies:', error);
    }
  };

  const handleQuickReply = async (category) => {
    try {
      const userMessage = {
        text: category,
        isUser: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessage]);

      const response = await fetch(`http://localhost:9090/api/university/faqs/category/${encodeURIComponent(category)}`);
      const faqs = await response.json();

      const botResponse = {
        text: `Here are the FAQs for ${category}:`,
        isUser: false,
        timestamp: new Date().toISOString(),
        faqs: faqs
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      text: inputMessage,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, userMessage]);
    setIsSearching(true);

    try {
      const response = await fetch(`http://localhost:9090/api/university/faqs/search?keyword=${encodeURIComponent(inputMessage)}`);
      const searchResults = await response.json();

      const botResponse = {
        text: searchResults.length > 0 
          ? "Here are some relevant FAQs I found:" 
          : "I couldn't find any FAQs matching your query. Please try different keywords or select from the quick replies below.",
        isUser: false,
        timestamp: new Date().toISOString(),
        faqs: searchResults
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botResponse]);
        setIsSearching(false);
      }, 1000);

    } catch (error) {
      console.error('Error:', error);
      setIsSearching(false);
    }

    setInputMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">University FAQ Chatbot</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFAQ(!showFAQ)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              {showFAQ ? 'Chat Mode' : 'FAQ Mode'}
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toggle between Chat and FAQ */}
      {showFAQ ? (
        <FAQDashboard />
      ) : (
        <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-80px)] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto mb-4 rounded-lg bg-white shadow-md p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <Bot size={48} className="mb-2" />
                <p>Ask me anything about the university!</p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-2 ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.isUser ? 'bg-blue-500' : 'bg-gray-200'
                  }`}>
                    {message.isUser ? 
                      <User className="w-5 h-5 text-white" /> : 
                      <Bot className="w-5 h-5 text-gray-600" />
                    }
                  </div>

                  {/* Message Content */}
                  <div className={`max-w-[80%] space-y-2 ${
                    message.isUser ? 'text-right' : 'text-left'
                  }`}>
                    <div className={`p-3 rounded-lg ${
                      message.isUser 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {message.text}
                    </div>

                    {/* FAQ Results */}
                    {message.faqs && message.faqs.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {message.faqs.map((faq, faqIndex) => (
                          <div 
                            key={faqIndex}
                            className="bg-white border rounded-lg p-3 shadow-sm"
                          >
                            <h4 className="font-medium text-gray-900">{faq.question}</h4>
                            <p className="text-gray-700 mt-1">{faq.answer}</p>
                            <span className="text-sm text-gray-500">{faq.category}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Replies */}
          {messages.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your question here..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isSearching}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Send size={18} />
                )}
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}