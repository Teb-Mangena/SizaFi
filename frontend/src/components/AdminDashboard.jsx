import { useState } from 'react';
import { useAuthStore } from "../store/authStore";
import Overview from "./adminComps/Overview";
import Workers from "./adminComps/Workers";
import Applications from "./adminComps/Applications";

function AdminDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.fullname}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-lg overflow-hidden">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'workers', label: 'Workers' },
            { id: 'applications', label: 'Applications' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary bg-gray-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-lg shadow-sm p-6">
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'workers' && <Workers />}
          {activeTab === 'applications' && <Applications />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;