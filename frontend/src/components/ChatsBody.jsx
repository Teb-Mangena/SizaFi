import { useState, useRef, useEffect } from 'react';
import { Send, User, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

const ChatsBody = ({ chat, messages, loading, error, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    onSendMessage(newMessage);
    setNewMessage('');
  };

  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={24} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No chat selected</h2>
          <p className="text-gray-500">
            Select a conversation from the sidebar to start chatting
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 flex items-center">
          <Link to="/messages" className="lg:hidden mr-3">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              {chat.profilePic ? (
                <img 
                  src={chat.profilePic} 
                  alt={chat.fullname} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User size={20} className="text-primary" />
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{chat.fullname}</h2>
              <p className="text-sm text-gray-500 capitalize">{chat.role}</p>
            </div>
          </div>
        </div>

        {/* Loading messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className="animate-pulse bg-gray-100 rounded-lg px-4 py-2 max-w-xs">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-16 mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 flex items-center">
        <Link to="/messages" className="lg:hidden mr-3">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            {chat.profilePic ? (
              <img 
                src={chat.profilePic} 
                alt={chat.fullname} 
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User size={20} className="text-primary" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{chat.fullname}</h2>
            <p className="text-sm text-gray-500 capitalize">{chat.role}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-b border-red-200 text-red-700 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-600">Send a message to start the conversation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${message.senderId === chat._id ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === chat._id
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-primary text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div className={`text-xs mt-1 flex items-center ${message.senderId === chat._id ? 'text-gray-500' : 'text-primary-100'}`}>
                    <Clock size={12} className="mr-1" />
                    {formatTime(message.createdAt)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-primary text-white rounded-lg px-4 py-2 flex items-center justify-center hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatsBody;