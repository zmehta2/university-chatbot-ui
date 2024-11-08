import React, { useState } from 'react';
import { Send, User, Bot, LogOut } from 'lucide-react';
import FAQDashboard from './components/FAQDashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showFAQ, setShowFAQ] = useState(false);  // Add this state to toggle between views

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessage = {
      text: inputMessage,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, newMessage]);

    try {
      // Simulate bot response
      const botResponse = {
        text: `Thanks for your question! Let me help you with that: ${inputMessage}`,
        isUser: false,
        timestamp: new Date().toISOString()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botResponse]);
      }, 1000);

    } catch (error) {
      console.error('Error:', error);
    }

    setInputMessage('');
  };



  // ... rest of your handleSendMessage function ...

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
        /* Your existing chat container */
        <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-80px)] flex flex-col">
          <div className="min-h-screen bg-gray-100">
            {/* Chat Container */}
            <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-80px)] flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto mb-4 rounded-lg bg-white shadow-md p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <Bot size={48} className="mb-2" />
                    <p>Ask me anything about the university!</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start space-x-2 ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.isUser ? 'bg-blue-500' : 'bg-gray-200'
                        }`}>
                        {message.isUser ?
                          <User className="w-5 h-5 text-white" /> :
                          <Bot className="w-5 h-5 text-gray-600" />
                        }
                      </div>

                      {/* Message Bubble */}
                      <div className={`max-w-[80%] p-3 rounded-lg ${message.isUser
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                        }`}>
                        {message.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

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
                    disabled={!inputMessage.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Send size={18} />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

