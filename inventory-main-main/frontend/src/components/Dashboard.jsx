import { useEffect, useState } from 'react';
import { getDashboardSummary } from '../api';
import { Package, Users, ShoppingCart, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardSummary()
      .then((res) => {
        setSummary(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching dashboard:", err);
        setLoading(false); // <--- ADD THIS LINE so it stops spinning on an error!
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 animate-in fade-in duration-500">
        <div className="text-gray-500 font-medium flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          Loading dashboard metrics...
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
        <p className="text-gray-500 mt-1">Here is what is happening with your store today.</p>
      </div>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Products Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-5 transition-all hover:shadow-md">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-lg">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-0.5">Total Products</p>
            <h3 className="text-2xl font-bold text-gray-900">{summary.total_products}</h3>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-5 transition-all hover:shadow-md">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-0.5">Total Customers</p>
            <h3 className="text-2xl font-bold text-gray-900">{summary.total_customers}</h3>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-5 transition-all hover:shadow-md">
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-lg">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-0.5">Total Orders</p>
            <h3 className="text-2xl font-bold text-gray-900">{summary.total_orders}</h3>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts - Redesigned as a Premium Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-gray-900">Low Stock Alerts</h2>
          </div>
          <span className="bg-red-100 text-red-700 py-1 px-3 rounded-full text-xs font-bold tracking-wide">
            {summary.low_stock_products.length} ACTION REQUIRED
          </span>
        </div>
        
        <div className="p-0">
          {summary.low_stock_products.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6" />
              </div>
              <p className="text-gray-900 font-medium">Inventory is looking healthy.</p>
              <p className="text-gray-500 text-sm mt-1">All products are adequately stocked.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {summary.low_stock_products.map(product => (
                <li key={product.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-0.5">{product.name}</h4>
                    <p className="text-xs text-gray-500 font-medium">SKU: {product.sku}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Remaining</p>
                      <p className="text-sm font-bold text-red-600">{product.quantity_in_stock} units</p>
                    </div>
                    {/* Optional: Quick link to edit that specific product */}
                    <Link to="/products" className="text-gray-400 hover:text-blue-600 transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}