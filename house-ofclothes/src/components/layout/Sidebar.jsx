import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  X,
  Home,
  ShoppingBag,
  LayoutGrid,
  ShoppingCart,
  Heart,
  Package,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Shirt,
} from 'lucide-react';
import { closeSidebar } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/products', label: 'Products', icon: ShoppingBag },
  { to: '/categories', label: 'Categories', icon: LayoutGrid },
  { to: '/cart', label: 'Cart', icon: ShoppingCart },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/orders', label: 'Orders', icon: Package },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const sidebarRef = useRef(null);

  // Close on route change
  useEffect(() => {
    dispatch(closeSidebar());
  }, [location.pathname, dispatch]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        dispatch(closeSidebar());
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, dispatch]);

  // Prevent scroll when open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(closeSidebar());
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <Link
            to="/"
            onClick={() => dispatch(closeSidebar())}
            className="flex items-center gap-2"
          >
            <Shirt className="w-6 h-6 text-rose-500" />
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
              HOUSE <span className="text-rose-500">OF</span> CLOTHES
            </span>
          </Link>
          <button
            onClick={() => dispatch(closeSidebar())}
            className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        {isAuthenticated && user && (
          <div className="px-4 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <User className="w-5 h-5" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <LogIn className="w-5 h-5" />
                Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <UserPlus className="w-5 h-5" />
                Sign Up
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
