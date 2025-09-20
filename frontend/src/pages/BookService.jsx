import { useState, useEffect } from 'react';
import { axiosInstance } from "../lib/axios";
import { Search, Filter, Star, MapPin, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router';

function BookService() {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/workers');
        setWorkers(res.data);
        setFilteredWorkers(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = workers;
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(worker => 
        worker.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by role
    if (selectedRole !== 'all') {
      result = result.filter(worker => worker.role === selectedRole);
    }
    
    // Sort results
    if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.fullname.localeCompare(b.fullname));
    } else if (sortBy === 'role') {
      result = [...result].sort((a, b) => a.role.localeCompare(b.role));
    }
    
    setFilteredWorkers(result);
  }, [searchTerm, selectedRole, sortBy, workers]);

  // const roles = ['all', 'plumber', 'electrician', 'carpenter', 'painter', 'gardener', 'cleaner'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book a Service</h1>
          <p className="text-gray-600 mt-2">Find the right professional for your needs</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or service..."
                className="input input-bordered w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={20} className="text-gray-400" />
              </div>
              <select
                className="select select-bordered w-full pl-10"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="all">All Services</option>
                <option value="plumber">Plumbing</option>
                <option value="electrician">Electrical</option>
                <option value="carpenter">Carpentry</option>
                <option value="painter">Painting</option>
                <option value="gardener">Gardening</option>
                <option value="cleaner">Cleaning</option>
              </select>
            </div>

            {/* Sort By */}
            <select
              className="select select-bordered"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="role">Sort by Service</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Found {filteredWorkers.length} {filteredWorkers.length === 1 ? 'professional' : 'professionals'}
          </p>
        </div>

        {/* Workers Grid */}
        {filteredWorkers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-700">No professionals found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map(worker => (
              <div key={worker._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <Link to={`/worker-details/${worker._id}`}>
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-full bg-primary text-primary-content flex items-center justify-center mr-4">
                        {worker.profilePic ? (
                          <img 
                            src={worker.profilePic} 
                            alt={worker.fullname} 
                            className="rounded-full w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-semibold">
                            {worker.fullname.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold uppercase">{worker.fullname}</h3>
                        <p className="text-gray-600 capitalize">{worker.role}</p>
                        <div className="flex items-center mt-1">
                          <Star size={16} className="text-yellow-400 fill-current" />
                          <span className="text-sm ml-1">4.8</span>
                          <span className="text-sm text-gray-500 ml-2">(24 reviews)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin size={16} className="mr-1" />
                        <span>Available in your area</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock size={16} className="mr-1" />
                        <span>Responds within 2 hours</span>
                      </div>
                    </div>
                    
                    {/* <div className="mt-6 flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-primary">R45</span>
                        <span className="text-gray-500 ml-1">/hr</span>
                      </div>
                      <button className="btn btn-primary">
                        <Calendar size={18} className="mr-2" />
                        Book Now
                      </button>
                    </div> */}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookService;