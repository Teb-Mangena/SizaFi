import { useState, useEffect } from 'react';
import { MessageCircle, Clock, CheckCircle2 } from 'lucide-react';

const ChartSideBar = ({ onSelectChat, selectedChat }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockConversations = [
      {
        id: 1,
        name: 'Sarah Johnson',
        lastMessage: 'Thanks for your help with the plumbing issue!',
        timestamp: '2 hours ago',
        unread: 3,
        avatar: '',
        service: 'Plumbing Repair'
      },
      {
        id: 2,
        name: 'Michael Brown',
        lastMessage: 'When are you available for an electrical inspection?',
        timestamp: '1 day ago',
        unread: 0,
        avatar: '',
        service: 'Electrical Work'
      },
      {
        id: 3,
        name: 'Emily Davis',
        lastMessage: 'The painting looks amazing, thank you!',
        timestamp: '3 days ago',
        unread: 0,
        avatar: '',
        service: 'Painting Service'
      },
      {
        id: 4,
        name: 'Robert Wilson',
        lastMessage: 'I need help with a leaky faucet.',
        timestamp: '1 week ago',
        unread: 1,
        avatar: '',
        service: 'Plumbing Repair'
      }
    ];
    
    setConversations(mockConversations);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center space-x-3 p-3 border-b border-gray-100">
            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map(conversation => (
        <div
          key={conversation.id}
          className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
            selectedChat?.id === conversation.id ? 'bg-blue-50' : ''
          }`}
          onClick={() => onSelectChat(conversation)}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {conversation.avatar ? (
                <img
                  src={conversation.avatar}
                  alt={conversation.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                  {conversation.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 truncate">{conversation.name}</h3>
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock size={12} className="mr-1" />
                  {conversation.timestamp}
                </span>
              </div>
              
              <p className="text-sm text-gray-500 truncate">{conversation.service}</p>
              
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                
                {conversation.unread > 0 && (
                  <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {conversation.unread}
                  </span>
                )}
                
                {conversation.unread === 0 && (
                  <CheckCircle2 size={14} className="text-green-500" />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChartSideBar;