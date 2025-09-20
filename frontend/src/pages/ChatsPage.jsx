import { useState, useEffect } from 'react';
import { axiosInstance } from '../lib/axios';
import { MessageCircle, Search, Menu, X } from 'lucide-react';
import ChartSideBar from '../components/ChartSideBar';
import ChatsBody from '../components/ChatsBody';

function ChatsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);

  // Fetch messages when a chat is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;
      
      setLoadingMessages(true);
      setError(null);
      
      try {
        const response = await axiosInstance.get(`/message/${selectedChat._id}`);
        setMessages(response.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleSendMessage = async (text) => {
    if (!selectedChat) return;
    
    try {
      const response = await axiosInstance.post(`/message/send/${selectedChat._id}`, {
        text: text
      });
      
      // Add the new message to our local state
      setMessages(prevMessages => [...prevMessages, response.data]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="btn btn-circle btn-sm bg-white shadow-md"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <MessageCircle className="text-primary" size={24} />
                Messages
              </h1>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <ChartSideBar 
              onSelectChat={handleSelectChat} 
              selectedChat={selectedChat} 
            />
          </div>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatsBody 
            chat={selectedChat} 
            messages={messages}
            loading={loadingMessages}
            error={error}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white p-4">
            <div className="text-center max-w-md">
              <MessageCircle size={64} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Messages</h2>
              <p className="text-gray-500 mb-6">
                Select a conversation from the sidebar to start chatting, or start a new conversation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatsPage;