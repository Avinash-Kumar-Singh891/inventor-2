import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Activity,
} from "lucide-react";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import Customers from "./components/Customers";
import AddProduct from "./components/AddProduct";
import AddCustomer from "./components/AddCustomer";
import CreateOrder from "./components/CreateOrder";
import Orders from "./components/Orders";

export default function App() {
  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <Router>
      <div className="flex h-screen bg-[#F8FAFC] font-sans text-gray-900">
        {/* Modern Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
          <div className="p-6 flex items-center gap-3 border-b border-gray-100">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              InventoryPro
            </h2>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            <NavLink to="/" className={navLinkStyle}>
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </NavLink>
            <NavLink to="/products" className={navLinkStyle}>
              <Package className="w-5 h-5" /> Products
            </NavLink>
            <NavLink to="/customers" className={navLinkStyle}>
              <Users className="w-5 h-5" /> Customers
            </NavLink>
            <NavLink to="/orders" className={navLinkStyle}>
              <ShoppingCart className="w-5 h-5" /> Orders
            </NavLink>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/products/new" element={<AddProduct />} />
              <Route path="/customers/new" element={<AddCustomer />} />
              <Route path="/orders/new" element={<CreateOrder />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}
