import React from 'react';
import { User, Bot, Send, ThumbsUp, ThumbsDown } from 'lucide-react';

const ChatInterface = ({ 
  messages, 
  inputMessage, 
  setInputMessage, 
  handleSendMessage, 
  handleFeedback,
  quickReplies,
  handleQuickReply,
  isSearching 
}) => {
  return (
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
              key={message.id || index}
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
                  {!message.isUser && message.category && (
                    <div className="text-sm text-gray-500 mt-1">
                      Category: {message.category}
                    </div>
                  )}
                </div>

                {/* Feedback buttons */}
                {!message.isUser && message.id && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleFeedback(message.id, true)}
                      className="flex items-center space-x-1 text-sm text-gray-500 hover:text-green-500"
                    >
                      <ThumbsUp size={14} />
                      <span>Helpful</span>
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, false)}
                      className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-500"
                    >
                      <ThumbsDown size={14} />
                      <span>Not Helpful</span>
                    </button>
                  </div>
                )}

                {/* Suggestions */}
                {!message.isUser && message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-500">Related questions:</p>
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInputMessage(suggestion.question)}
                        className="block text-left text-sm text-blue-600 hover:underline"
                      >
                        {suggestion.question}
                        <span className="text-gray-500 text-xs ml-2">
                          ({suggestion.category})
                        </span>
                      </button>
                    ))}
                  </div>
                )}

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
  );
};

export default ChatInterface;