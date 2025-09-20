import { useState } from 'react';
import ChartSideBar from "../components/ChartSideBar";
import ChatsBody from "../components/ChatsBody";
import { MessageCircle, Search, Menu, X } from 'lucide-react';

function ChatsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

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
              <button className="btn btn-ghost btn-sm">
                <Search size={18} />
              </button>
            </div>
            
            <div className="mt-4 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search conversations..."
                className="input input-bordered w-full pl-10"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <ChartSideBar onSelectChat={setSelectedChat} selectedChat={selectedChat} />
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
          <ChatsBody chat={selectedChat} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white p-4">
            <div className="text-center max-w-md">
              <MessageCircle size={64} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Messages</h2>
              <p className="text-gray-500 mb-6">
                Select a conversation from the sidebar to start chatting, or start a new conversation.
              </p>
              <button className="btn btn-primary">
                Start New Conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatsPage;