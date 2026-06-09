import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { ArrowLeft, Save } from 'lucide-react';

export default function AddCustomer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // FIX 1: Updated the state keys to match FastAPI exactly
  const [formData, setFormData] = useState({ full_name: '', email: '', phone_number: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/customers', formData);
      navigate('/customers');
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map(e => `${e.loc[e.loc.length - 1]}: ${e.msg}`).join(' | '));
      } else if (typeof detail === 'string') {
        setError(detail);
      } else {
        setError('Failed to create customer.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      <Link to="/customers" className="flex items-center text-gray-500 hover:text-blue-600 mb-6 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Customers
      </Link>
      
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Add New Customer</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            {/* FIX 2: Updated value and onChange to target full_name */}
            <input required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input required type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              {/* FIX 3: Updated value and onChange to target phone_number */}
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button disabled={loading} type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium disabled:opacity-50">
              <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}