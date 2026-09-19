import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Calculator, LayoutDashboard, History, BarChart3, 
  Bot, Scale, Info, Sun, Moon, LogOut, User, Menu, X, Sparkles 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Predict', path: '/predict', icon: Calculator, badge: 'ML' },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'History', path: '/history', icon: History },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'AI Assistant', path: '/assistant', icon: Bot, highlight: true },
    { name: 'Compare', path: '/compare', icon: Scale },
    { name: 'About', path: '/about', icon: Info },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 dark:border-white/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">🏠</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
                  HouseAI
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded border border-teal-500/20">
                  Agent
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
                Intelligent House Price Prediction Agent
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-500' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[9px] px-1 py-0.2 bg-teal-500 text-white rounded font-mono uppercase">
                      {link.badge}
                    </span>
                  )}
                  {link.highlight && (
                    <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Auth / Profile Area */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-teal-500/40 bg-slate-50 dark:bg-slate-800/80 transition-all"
                >
                  <img
                    src={user.user_metadata?.avatar_url || '/avatar.jpg'}
                    alt="Avatar"
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-teal-500/50"
                  />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200 hidden md:block max-w-[100px] truncate">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 glass-card rounded-xl py-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-white/5">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.user_metadata?.full_name || 'HouseAI User'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-teal-500/10 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Profile & Settings</span>
                    </Link>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-500 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-500 text-white shadow-sm shadow-teal-500/25 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-white/10 glass-panel px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4 text-teal-500" />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-teal-500 text-white rounded font-mono">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
