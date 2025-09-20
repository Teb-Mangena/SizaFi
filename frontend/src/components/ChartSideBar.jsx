import { useState, useEffect } from 'react';
import { axiosInstance } from '../lib/axios';
import { MessageCircle, Clock, CheckCircle2, Users, Search, User, Mail } from 'lucide-react';

const ChartSideBar = ({ onSelectChat, selectedChat }) => {
  const [chats, setChats] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chats');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch chats data
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axiosInstance.get('/message/chats');
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    // Fetch contacts data
    const fetchContacts = async () => {
      try {
        const response = await axiosInstance.get('/message/contacts');
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
    fetchContacts();
  }, []);

  // Filter chats and contacts based on search term
  const filteredChats = chats.filter(chat => 
    chat.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContacts = contacts.filter(contact => 
    contact.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full h-full bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
          <div className="mt-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <div className="h-10 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
        
        <div className="flex border-b border-gray-200">
          <div className="flex-1 py-3 text-center border-b-2 border-primary text-primary font-medium">Chats</div>
          <div className="flex-1 py-3 text-center text-gray-500">Contacts</div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3 p-3 rounded-lg mb-2">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <MessageCircle size={24} className="text-primary" />
          Messages
        </h2>
        
        {/* Search Bar */}
        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search chats or contacts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 text-center flex items-center justify-center gap-2 ${
            activeTab === 'chats' 
              ? 'border-b-2 border-primary text-primary font-medium' 
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('chats')}
        >
          <MessageCircle size={18} />
          Chats
        </button>
        <button
          className={`flex-1 py-3 text-center flex items-center justify-center gap-2 ${
            activeTab === 'contacts' 
              ? 'border-b-2 border-primary text-primary font-medium' 
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('contacts')}
        >
          <Users size={18} />
          Contacts
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chats' ? (
          filteredChats.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageCircle size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">
                {searchTerm ? 'No matching chats found' : 'No chats yet'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {searchTerm ? 'Try a different search term' : 'Your conversations will appear here'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredChats.map(chat => (
                <div
                  key={chat._id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedChat?._id === chat._id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => onSelectChat(chat)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {chat.profilePic ? (
                        <img
                          src={chat.profilePic}
                          alt={chat.fullname}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <User size={20} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">{chat.fullname}</h3>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {new Date(chat.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-500 truncate capitalize">{chat.role}</p>
                      
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600 truncate">Start a conversation...</p>
                        <CheckCircle2 size={14} className="text-green-500" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          filteredContacts.length === 0 ? (
            <div className="text-center py-8 px-4">
              <Users size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">
                {searchTerm ? 'No matching contacts found' : 'No contacts available'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredContacts.map(contact => (
                <div
                  key={contact._id}
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => onSelectChat(contact)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {contact.profilePic ? (
                        <img
                          src={contact.profilePic}
                          alt={contact.fullname}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          <User size={20} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">{contact.fullname}</h3>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500 capitalize">{contact.role}</span>
                        {contact.role !== 'user' && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                            {contact.role}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Mail size={12} className="mr-1" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ChartSideBar;