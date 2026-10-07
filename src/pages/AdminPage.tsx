import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Order, Customer, ContactMessage, NewsletterSubscriber, BlogPost } from '../types';
import {
  Shield,
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  Mail,
  BookOpen,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  LogOut,
  RefreshCw,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { products, categories, blogPosts, siteConfig, refreshProducts, updateSiteConfig } = useStore();

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('zk_admin_token'));
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'blog' | 'inquiries' | 'subscribers' | 'settings'>('overview');

  // Admin Data States
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Product Editing / Modal State
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [prodSaveSuccess, setProdSaveSuccess] = useState(false);

  // Settings State
  const [configForm, setConfigForm] = useState(siteConfig);
  const [configSuccess, setConfigSuccess] = useState(false);

  // Fetch admin protected data
  const fetchAdminData = async (authToken: string) => {
    setLoadingData(true);
    try {
      const headers = { Authorization: `Bearer ${authToken}` };
      const [ordRes, custRes, contRes, subRes] = await Promise.all([
        fetch('/api/orders', { headers }).catch(() => null),
        fetch('/api/customers', { headers }).catch(() => null),
        fetch('/api/contact', { headers }).catch(() => null),
        fetch('/api/newsletter', { headers }).catch(() => null),
      ]);

      if (ordRes && ordRes.ok) {
        const ordData = await ordRes.json();
        if (ordData.success) setOrders(ordData.data);
      }
      if (custRes && custRes.ok) {
        const custData = await custRes.json();
        if (custData.success) setCustomers(custData.data);
      }
      if (contRes && contRes.ok) {
        const contData = await contRes.json();
        if (contData.success) setContacts(contData.data);
      }
      if (subRes && subRes.ok) {
        const subData = await subRes.json();
        if (subData.success) setSubscribers(subData.data);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData(token);
    }
  }, [token]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('zk_admin_token', data.token);
        setToken(data.token);
        setPasswordInput('');
      } else {
        setLoginError('Invalid password. Default password is admin123');
      }
    } catch {
      // Local fallback in case server was restarting
      if (passwordInput === 'admin123') {
        const dummyToken = 'admin_local_fallback';
        localStorage.setItem('zk_admin_token', dummyToken);
        setToken(dummyToken);
      } else {
        setLoginError('Invalid password. Default password is admin123');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zk_admin_token');
    setToken(null);
  };

  // Product CRUD Handlers
  const handleOpenAddProduct = () => {
    setIsNewProduct(true);
    setEditingProduct({
      name: '',
      price: 1499,
      oldPrice: 2200,
      discountBadge: 'Save 30%',
      category: "Men's Watches",
      brand: 'ZK Royal',
      image: 'images/watch-01.jpg',
      sku: `ZK-NEW-${Math.floor(100 + Math.random() * 900)}`,
      stock: 20,
      isAvailable: true,
      shortDescription: '',
      description: '',
      features: ['Stainless steel finish', 'Water resistant', 'Warranty included'],
      specs: {
        movement: 'Japanese Quartz',
        caseDiameter: '41mm',
        strapMaterial: 'Stainless Steel',
        waterResistance: '3ATM',
        glassType: 'Hardened Mineral Crystal',
        warranty: '7-Day Checking Warranty',
      },
      rating: 4.8,
      reviewsCount: 15,
    });
  };

  const handleEditProduct = (p: Product) => {
    setIsNewProduct(false);
    setEditingProduct({ ...p });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !token) return;

    try {
      const method = isNewProduct ? 'POST' : 'PUT';
      const endpoint = isNewProduct ? '/api/products' : `/api/products/${editingProduct.id}`;

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingProduct),
      });

      if (res.ok) {
        await refreshProducts();
        setProdSaveSuccess(true);
        setTimeout(() => {
          setProdSaveSuccess(false);
          setEditingProduct(null);
        }, 1200);
      }
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this watch from the catalog?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await refreshProducts();
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  // Order Status Update Handler
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(prev =>
          prev.map(o => (o.id === orderId || o.orderNumber === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  // Save Site Configuration
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch('/api/site-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(configForm),
      });
      if (res.ok) {
        updateSiteConfig(configForm);
        setConfigSuccess(true);
        setTimeout(() => setConfigSuccess(false), 2000);
      }
    } catch (err) {
      console.error('Failed to update config:', err);
    }
  };

  // Summary Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  // LOGIN VIEW IF NOT AUTHENTICATED
  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-stone-900 text-white rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold font-luxury text-stone-900">ZK.pk Admin Portal</h1>
            <p className="text-xs text-stone-500">
              Manage products, view customer orders, and update store configuration.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Admin Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password (default: admin123)"
                required
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:border-stone-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-950 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
            >
              Sign In to Dashboard
            </button>
          </form>

          <p className="text-[11px] text-stone-400 text-center">
            Default credentials: <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700">admin123</code>
          </p>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-stone-900">ZK.pk Management Console</h1>
            <p className="text-xs text-stone-500">Live MongoDB / Express REST Backend Connected</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => token && fetchAdminData(token)}
            className="p-2 text-stone-600 hover:text-stone-900 bg-stone-100 rounded-lg text-xs flex items-center gap-1 font-medium transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
          <button
            onClick={handleLogout}
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs flex items-center gap-1 font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-stone-200 pb-2 text-xs">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
          { id: 'blog', label: `Blog Articles (${blogPosts.length})`, icon: BookOpen },
          { id: 'inquiries', label: `Inquiries (${contacts.length})`, icon: MessageSquare },
          { id: 'subscribers', label: `Subscribers (${subscribers.length})`, icon: Mail },
          { id: 'settings', label: 'Store Settings', icon: Settings },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-stone-500">Total Store Revenue</span>
              <h3 className="text-2xl font-bold font-mono text-stone-900">
                Rs. {totalRevenue.toLocaleString()}
              </h3>
              <p className="text-[11px] text-emerald-700">Cash on Delivery Orders</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-stone-500">Orders Received</span>
              <h3 className="text-2xl font-bold font-mono text-stone-900">{orders.length}</h3>
              <p className="text-[11px] text-amber-700">{pendingOrders} Pending Verification</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-stone-500">Active Watches</span>
              <h3 className="text-2xl font-bold font-mono text-stone-900">{products.length}</h3>
              <p className="text-[11px] text-stone-500">Across 7 Price Tiers</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs font-semibold text-stone-500">Inquiries & Subscribers</span>
              <h3 className="text-2xl font-bold font-mono text-stone-900">
                {contacts.length + subscribers.length}
              </h3>
              <p className="text-[11px] text-stone-500">{contacts.length} Messages, {subscribers.length} Emails</p>
            </div>
          </div>

          {/* Recent Orders Preview */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Recent Customer Orders</h3>
            {orders.length === 0 ? (
              <p className="text-xs text-stone-500 py-4 text-center">
                No orders yet. Place a test order from the checkout page to see it appear here!
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-stone-200 text-stone-500">
                    <tr>
                      <th className="py-2.5 font-semibold">Order #</th>
                      <th className="py-2.5 font-semibold">Customer</th>
                      <th className="py-2.5 font-semibold">City</th>
                      <th className="py-2.5 font-semibold">Total</th>
                      <th className="py-2.5 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono">
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id}>
                        <td className="py-2.5 font-bold text-stone-900">{o.orderNumber}</td>
                        <td className="py-2.5 font-sans font-medium text-stone-800">{o.customerName}</td>
                        <td className="py-2.5 font-sans text-stone-600">{o.city}</td>
                        <td className="py-2.5 font-bold text-stone-900">Rs. {o.total.toLocaleString()}</td>
                        <td className="py-2.5 font-sans">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                            o.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' :
                            o.status === 'Processing' ? 'bg-amber-100 text-amber-800' :
                            'bg-stone-100 text-stone-800'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">Watches Catalog ({products.length})</h2>
              <p className="text-xs text-stone-500">
                You can easily edit prices, stock, images (e.g. images/watch-01.jpg), and details.
              </p>
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="py-2 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Watch</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Image</th>
                    <th className="py-3 px-4 font-semibold">Name & SKU</th>
                    <th className="py-3 px-4 font-semibold">Price</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Stock</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map(prod => (
                    <tr key={prod.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <img
                          src={prod.image || `/images/watch-${String(prod.id).padStart(2, '0')}.jpg`}
                          alt={prod.name}
                          className="w-12 h-12 object-cover rounded-lg border border-stone-200"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <strong className="block text-stone-900 font-semibold">{prod.name}</strong>
                        <span className="font-mono text-[11px] text-stone-400">SKU: {prod.sku}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-stone-900 tabular-nums">
                        Rs. {prod.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-stone-600">{prod.category}</td>
                      <td className="py-3 px-4">
                        <span className={`font-mono font-semibold ${prod.stock > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {prod.stock} in stock
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleEditProduct(prod)}
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                          title="Edit Watch Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete Watch"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / ADD PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          <div
            onClick={() => setEditingProduct(null)}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 z-10 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-bold text-stone-900">
                {isNewProduct ? 'Add New Watch' : `Edit: ${editingProduct.name}`}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 text-stone-400 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {prodSaveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Product saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Product Name</label>
                  <input
                    type="text"
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    required
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Category</label>
                  <select
                    value={editingProduct.category || "Men's Watches"}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Price (PKR / Rs.)</label>
                  <input
                    type="number"
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    required
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Old Price (Anchor)</label>
                  <input
                    type="number"
                    value={editingProduct.oldPrice || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, oldPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Stock Count</label>
                  <input
                    type="number"
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    required
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Image Path / URL</label>
                  <input
                    type="text"
                    value={editingProduct.image || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    placeholder="e.g. /images/watch-01.jpg"
                    required
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">SKU Code</label>
                  <input
                    type="text"
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    required
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Short Summary</label>
                <input
                  type="text"
                  value={editingProduct.shortDescription || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Full Description</label>
                <textarea
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-950 text-white rounded-lg font-bold"
                >
                  Save Watch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">Customer Orders ({orders.length})</h2>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-500">
              No orders registered yet. Test placing an order in the store to see full order details here.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <span className="font-mono font-bold text-base text-stone-900">{order.orderNumber}</span>
                      <span className="text-xs text-stone-500 ml-2">({new Date(order.createdAt).toLocaleDateString()})</span>
                    </div>

                    {/* Status updater */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-500 font-medium">Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                        className="p-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-800"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <strong className="block text-stone-900 font-semibold">Customer Details:</strong>
                      <p className="text-stone-700">{order.customerName}</p>
                      <p className="font-mono text-stone-600">{order.phone}</p>
                      {order.email && <p className="text-stone-500">{order.email}</p>}
                    </div>

                    <div>
                      <strong className="block text-stone-900 font-semibold">Delivery Address:</strong>
                      <p className="text-stone-700">{order.address}</p>
                      <p className="text-stone-600 font-medium">{order.city} {order.postalCode && `(${order.postalCode})`}</p>
                      {order.notes && <p className="text-[11px] text-amber-800 italic mt-1">Note: {order.notes}</p>}
                    </div>

                    <div className="text-right">
                      <strong className="block text-stone-900 font-semibold">Payment & Total:</strong>
                      <p className="text-emerald-800 font-semibold">{order.paymentMethod}</p>
                      <p className="text-base font-bold font-mono text-stone-900 tabular-nums">
                        Rs. {order.total.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-2 text-xs">
                    {order.items.map((it, idx) => (
                      <span key={idx} className="bg-stone-50 border border-stone-200 px-2.5 py-1 rounded-md text-stone-700">
                        {it.productName} × {it.quantity} (Rs. {it.price.toLocaleString()})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CUSTOMERS DIRECTORY */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <h2 className="text-base font-bold text-stone-900">Customer Directory ({customers.length})</h2>
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            {customers.length === 0 ? (
              <p className="text-xs text-stone-500 p-8 text-center">Customers will be listed as orders are placed.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Name</th>
                      <th className="py-3 px-4 font-semibold">Phone</th>
                      <th className="py-3 px-4 font-semibold">City</th>
                      <th className="py-3 px-4 font-semibold">Total Orders</th>
                      <th className="py-3 px-4 font-semibold">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {customers.map(c => (
                      <tr key={c.id}>
                        <td className="py-3 px-4 font-semibold text-stone-900">{c.name}</td>
                        <td className="py-3 px-4 font-mono text-stone-600">{c.phone}</td>
                        <td className="py-3 px-4 text-stone-700">{c.city}</td>
                        <td className="py-3 px-4 font-mono">{c.totalOrders}</td>
                        <td className="py-3 px-4 font-mono font-bold text-stone-900">Rs. {c.totalSpent.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: INQUIRIES & CONTACTS */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <h2 className="text-base font-bold text-stone-900">Inquiries Received ({contacts.length})</h2>
          {contacts.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-2xl border border-stone-200 text-xs text-stone-500">
              No inquiries submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map(c => (
                <div key={c.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="font-bold text-stone-900">{c.name} ({c.phone})</span>
                    <span className="text-stone-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="font-semibold text-amber-800">{c.subject}</p>
                  <p className="text-stone-700 leading-relaxed">{c.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: SUBSCRIBERS */}
      {activeTab === 'subscribers' && (
        <div className="space-y-6">
          <h2 className="text-base font-bold text-stone-900">Newsletter Subscribers ({subscribers.length})</h2>
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs p-4">
            {subscribers.length === 0 ? (
              <p className="text-xs text-stone-500 p-4 text-center">No subscribers yet.</p>
            ) : (
              <div className="divide-y divide-stone-100 text-xs">
                {subscribers.map(s => (
                  <div key={s.id} className="py-2.5 flex items-center justify-between">
                    <span className="font-medium text-stone-800">{s.email}</span>
                    <span className="text-stone-400 font-mono text-[11px]">{new Date(s.subscribedAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: BLOG MANAGER */}
      {activeTab === 'blog' && (
        <div className="space-y-6">
          <h2 className="text-base font-bold text-stone-900">Blog Articles ({blogPosts.length})</h2>
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs divide-y divide-stone-100">
            {blogPosts.map(post => (
              <div key={post.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase">{post.category}</span>
                  <h4 className="font-bold text-stone-900 text-sm">{post.title}</h4>
                  <span className="text-stone-400">{post.date} · by {post.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: STORE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-stone-900">Store Contact & Branding Configuration</h2>
            <p className="text-xs text-stone-500">Edit business phone, WhatsApp, and announcement text in real-time.</p>
          </div>

          {configSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Store settings saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-stone-700">Website Name</label>
                <input
                  type="text"
                  value={configForm.siteName}
                  onChange={(e) => setConfigForm({ ...configForm, siteName: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">WhatsApp Number</label>
                <input
                  type="text"
                  value={configForm.whatsapp}
                  onChange={(e) => setConfigForm({ ...configForm, whatsapp: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-stone-700">Phone Display</label>
                <input
                  type="text"
                  value={configForm.phone}
                  onChange={(e) => setConfigForm({ ...configForm, phone: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Support Email</label>
                <input
                  type="email"
                  value={configForm.email}
                  onChange={(e) => setConfigForm({ ...configForm, email: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700">Physical Hub Address</label>
              <input
                type="text"
                value={configForm.address}
                onChange={(e) => setConfigForm({ ...configForm, address: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700">Top Announcement Banner</label>
              <input
                type="text"
                value={configForm.announcementText}
                onChange={(e) => setConfigForm({ ...configForm, announcementText: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-stone-900 hover:bg-stone-950 text-white rounded-xl font-bold transition-colors"
            >
              Save Store Configuration
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
