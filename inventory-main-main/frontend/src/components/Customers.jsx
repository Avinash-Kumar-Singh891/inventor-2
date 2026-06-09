import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Mail, UserPlus, Phone, Users } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/customers')
      .then(res => { 
        setCustomers(res.data); 
        setLoading(false); 
      })
      .catch(err => { 
        console.error("Error fetching customers:", err); 
        setLoading(false); 
      });
  }, []);

  // Helper function to safely get initials for the avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Customers</h1>
          <p className="text-gray-500 mt-1">Manage your client base and contact details.</p>
        </div>
        <Link to="/customers/new" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors font-medium">
          <UserPlus className="w-4 h-4" /> Add Customer
        </Link>
      </div>

      {/* Data Table Card */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 font-medium flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div> 
              Loading customers...
            </div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center">
                    <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6" />
                    </div>
                    <p className="text-gray-900 font-medium">No customers found.</p>
                    <p className="text-gray-500 text-sm mt-1">Get started by adding your first client.</p>
                  </td>
                </tr>
              ) : (
                customers.map(customer => (
                  <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100">
                          {getInitials(customer.full_name)}
                        </div>
                        <div className="text-sm font-semibold text-gray-900">{customer.full_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col gap-1.5">
                        <span className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                          <Mail className="w-3.5 h-3.5 text-gray-400"/> {customer.email}
                        </span>
                        {customer.phone_number && (
                          <span className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-gray-400"/> {customer.phone_number}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-medium">
                      #{customer.id.toString().padStart(4, '0')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}