import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, Image, Smile } from 'lucide-react';

const ChatsBody = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Mock messages - replace with actual API call
  useEffect(() => {
    if (chat) {
      const mockMessages = [
        {
          id: 1,
          text: "Hello! I need help with a plumbing issue in my kitchen.",
          sender: "them",
          timestamp: "2023-06-15T10:30:00"
        },
        {
          id: 2,
          text: "Hi there! I'd be happy to help. Can you describe the issue?",
          sender: "me",
          timestamp: "2023-06-15T10:32:00"
        },
        {
          id: 3,
          text: "The sink is draining very slowly and sometimes backs up.",
          sender: "them",
          timestamp: "2023-06-15T10:33:00"
        },
        {
          id: 4,
          text: "That sounds like a clog. I can come by tomorrow to take a look. What time works for you?",
          sender: "me",
          timestamp: "2023-06-15T10:35:00"
        },
        {
          id: 5,
          text: "How about 2 PM?",
          sender: "them",
          timestamp: "2023-06-15T10:36:00"
        },
        {
          id: 6,
          text: "2 PM works perfectly. I'll see you then!",
          sender: "me",
          timestamp: "2023-06-15T10:37:00"
        }
      ];
      
      setMessages(mockMessages);
    }
  }, [chat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "me",
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!chat) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {chat.avatar ? (
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
              {chat.name.charAt(0).toUpperCase()}
            </div>
          )}
          
          <div>
            <h2 className="font-semibold text-gray-900">{chat.name}</h2>
            <p className="text-sm text-gray-500">{chat.service}</p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
                message.sender === 'me'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p>{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <button className="btn btn-ghost btn-sm">
              <Paperclip size={18} />
            </button>
            <button className="btn btn-ghost btn-sm">
              <Image size={18} />
            </button>
            <button className="btn btn-ghost btn-sm">
              <Smile size={18} />
            </button>
          </div>
          
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type a message..."
              className="input input-bordered w-full pr-10"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            
            <button className="btn btn-ghost btn-sm absolute right-1 top-1">
              <Mic size={18} />
            </button>
          </div>
          
          <button
            className="btn btn-primary btn-circle"
            onClick={handleSendMessage}
            disabled={newMessage.trim() === ''}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatsBody;