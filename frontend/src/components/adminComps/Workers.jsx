import { useState, useEffect } from 'react';
import { Users, Mail, Phone, MapPin, Wrench, Search, Filter } from 'lucide-react';
import { axiosInstance } from '../../lib/axios';

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState('all');
  
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await axiosInstance.get('/workers');
        setWorkers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching workers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const services = [...new Set(workers.map(worker => worker.role))];

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = filterService === 'all' || worker.role === filterService;
    return matchesSearch && matchesService;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h3 className="font-semibold text-gray-900">Workers Management</h3>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search workers..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
          >
            <option value="all">All Services</option>
            {services.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkers.map((worker) => (
          <div key={worker._id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                {worker.profilePic ? (
                  <img 
                    src={worker.profilePic} 
                    alt={worker.fullname} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <Wrench size={20} className="text-primary" />
                )}
              </div>
              <div>
                <h4 className="font-semibold">{worker.fullname}</h4>
                <p className="text-sm text-gray-500 capitalize">{worker.role}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={14} />
                <span>{worker.email}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={14} />
                <span>{worker.phone || 'Not provided'}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={14} />
                <span>{worker.location || 'Location not specified'}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Joined {new Date(worker.createdAt).toLocaleDateString()}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredWorkers.length === 0 && (
        <div className="text-center py-8">
          <Wrench size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No workers found</p>
        </div>
      )}
    </div>
  );
};

export default Workers;