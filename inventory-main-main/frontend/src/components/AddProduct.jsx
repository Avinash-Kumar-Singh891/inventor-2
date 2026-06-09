import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { ArrowLeft, Save } from 'lucide-react';

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    sku: '', name: '', description: '', price: '', quantity_in_stock: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/products', {
        ...formData,
        price: parseFloat(formData.price),
        quantity_in_stock: parseInt(formData.quantity_in_stock, 10)
      });
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create product');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      <Link to="/products" className="flex items-center text-gray-500 hover:text-blue-600 mb-6 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Inventory
      </Link>
      
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU Code</label>
              <input required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} placeholder="e.g. PROD-001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input required type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input required type="number" step="0.01" min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock</label>
              <input required type="number" min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                value={formData.quantity_in_stock} onChange={e => setFormData({...formData, quantity_in_stock: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" rows="3"
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>

          <div className="pt-4 flex justify-end">
            <button disabled={loading} type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium disabled:opacity-50">
              <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}