import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

export default function CreateOrder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ product_id: '', quantity: 1 }]);

  useEffect(() => {
    Promise.all([api.get('/customers'), api.get('/products')])
      .then(([custRes, prodRes]) => {
        setCustomers(custRes.data);
        setProducts(prodRes.data);
      })
      .catch(() => setError("Failed to load customers and products."));
  }, []);

  const handleAddItem = () => setItems([...items, { product_id: '', quantity: 1 }]);
  const handleRemoveItem = (index) => setItems(items.filter((_, i) => i !== index));
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      customer_id: parseInt(customerId),
      items: items.map(item => ({
        product_id: parseInt(item.product_id),
        quantity: parseInt(item.quantity)
      }))
    };

    try {
      await api.post('/orders', payload);
      navigate('/orders');
    } catch (err) {
      // Robust 422 and Exception Handling
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map(e => `${e.loc[e.loc.length - 1]}: ${e.msg}`).join(' | '));
      } else if (typeof detail === 'string') {
        setError(detail); // Captures things like "Insufficient inventory"
      } else {
        setError('Failed to create order. Please verify your stock levels.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <Link to="/orders" className="flex items-center text-gray-500 hover:text-blue-600 mb-6 w-fit transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
      </Link>
      
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Create New Order</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}
          
          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Customer</label>
            <select required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              value={customerId} onChange={e => setCustomerId(e.target.value)}>
              <option value="" disabled>-- Choose a customer --</option>
              {/* FIX: Mapped to c.full_name instead of c.name */}
              {customers.map(c => <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>)}
            </select>
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Order Items</h3>
            
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Product</label>
                    <select required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      value={item.product_id} onChange={e => handleItemChange(index, 'product_id', e.target.value)}>
                      <option value="" disabled>Select product...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id} disabled={p.quantity_in_stock === 0}>
                          {p.name} - ${p.price} ({p.quantity_in_stock} in stock)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Qty</label>
                    <input required type="number" min="1" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} />
                  </div>
                  {items.length > 1 && (
                    <button type="button" onClick={() => handleRemoveItem(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mb-0.5">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button type="button" onClick={handleAddItem} className="mt-4 flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-800">
              <Plus className="w-4 h-4" /> Add another product
            </button>
          </div>

          <div className="pt-4 flex justify-end">
            <button disabled={loading} type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium disabled:opacity-50">
              <Save className="w-4 h-4" /> {loading ? 'Processing...' : 'Complete Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}