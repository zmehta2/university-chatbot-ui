import React, { useState, useEffect } from 'react';
import { LogOut, BarChart2 } from 'lucide-react';
import FAQDashboard from './components/FAQDashboard';
import ChatInterface from './components/ChatInterface';
import AnalyticsView from './components/AnalyticsView';
import { chatApi } from './services/api';
import Login from './components/Login';

export default function App() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState('user123');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showFAQ, setShowFAQ] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [popularQuestions, setPopularQuestions] = useState({});

  useEffect(() => {
    fetchChatHistory();
    fetchPopularQuestions();
    fetchQuickReplies();
  }, [userId]);

  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem('auth');
    return savedAuth ? JSON.parse(savedAuth) : null;
  });
  
  const handleLogin = (userData) => {
    const authData = {
      user: userData,
      token: userData.token
    };
    setAuth(authData);
    localStorage.setItem('auth', JSON.stringify(authData));
  };
  
  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem('auth');
    setMessages([]);
    setShowFAQ(false);
    setShowAnalytics(false);
  };
  
  // Update your API calls to include the token
  const makeAuthenticatedRequest = async (url, options = {}) => {
    if (!auth?.token) throw new Error('No authentication token');
  
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${auth.token}`,
      },
    });
  };

  const handleToggleView = (view) => {
    if (view === 'analytics') {
      setShowAnalytics(true);
      setShowFAQ(false);
    } else if (view === 'faq') {
      setShowAnalytics(false);
      setShowFAQ(true);
    } else {
      setShowAnalytics(false);
      setShowFAQ(false);
    }
  };
  
  const fetchQuickReplies = async () => {
    try {
      const response = await makeAuthenticatedRequest('http://localhost:9090/api/university/quick-replies');
      const data = await response.json();
      setQuickReplies(data);
    } catch (error) {
      console.error('Error fetching quick replies:', error);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const history = await chatApi.getUserHistory(userId);
      setChatHistory(history);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const fetchPopularQuestions = async () => {
    try {
      const questions = await chatApi.getPopularQuestions();
      setPopularQuestions(questions || {}); // Ensure we always set an object
    } catch (error) {
      console.error('Error fetching popular questions:', error);
      setPopularQuestions({}); // Set empty object on error
    }
  };

  const handleFeedback = async (chatLogId, isHelpful, feedbackText = '') => {
    try {
      await chatApi.submitFeedback(chatLogId, {
        helpful: isHelpful,
        feedback: feedbackText
      });
      // Refresh chat history after feedback
      fetchChatHistory();
    } catch (error) {
      console.error('Error submitting feedback:', error);
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
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    };

    setMessages([...messages, userMessage]);
    setIsSearching(true);

    try {
      // First, store the chat message
      const chatLogResponse = await fetch('http://localhost:9090/api/chat-history/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId, // Replace with actual user ID from authentication
          question: inputMessage,
          timestamp: new Date().toISOString()
        })
      });

      if (!chatLogResponse.ok) {
        throw new Error('Failed to store chat message');
      }
    

      const response = await fetch(`http://localhost:9090/api/university/faqs/search?keyword=${encodeURIComponent(inputMessage)}`);
      const searchResults = await response.json();

      const botResponse = {
        text: searchResults.length > 0 
        ? "Here are some relevant FAQs I found:" 
        : "I couldn't find any FAQs matching your query. Please try different keywords or select from the quick replies below.",
        isUser: false,
        timestamp: new Date().toISOString(),
        // id: Date.now().toString(),
        // suggestions: response.suggestions,
        // category: response.category,
        faqs: searchResults
      };

      setMessages(prev => [...prev, botResponse]);
      console.log(botResponse);
      console.log(messages);
      // fetchChatHistory(); // Refresh chat history after new message
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSearching(false);
      setInputMessage('');
    }
  };


  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">University FAQ Chatbot</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleToggleView('analytics')}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <BarChart2 size={18} />
              <span>Analytics</span>
            </button>
            <button
              onClick={() => handleToggleView(showFAQ && user.role !== 'admin' ? 'chat' : 'faq')}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              {showFAQ && user.role !== 'admin'? 'Chat Mode': 'FAQ Mode'}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {showAnalytics ? (
        <div className="max-w-4xl mx-auto p-4">
          <AnalyticsView />
        </div>
      ) : showFAQ && user.role === 'admin' ? (
        <FAQDashboard />
      ) : (
        <ChatInterface
          messages={messages}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          handleFeedback={handleFeedback}
          quickReplies={quickReplies}
          handleQuickReply={handleQuickReply}
          isSearching={isSearching}
        />
      )}
    </div>
  );
}