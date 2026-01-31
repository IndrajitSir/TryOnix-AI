import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Wand2, History, Settings } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                <Wand2 className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                TryOnix
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all ${isActive('/dashboard')
                                            ? 'bg-indigo-50 text-indigo-700'
                                            : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Link>
                                <Link
                                    to="/try-on"
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all ${isActive('/try-on')
                                            ? 'bg-purple-50 text-purple-700'
                                            : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Wand2 className="w-4 h-4" />
                                    Try-On
                                </Link>
                                <Link
                                    to="/history"
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all ${isActive('/history')
                                            ? 'bg-pink-50 text-pink-700'
                                            : 'text-gray-600 hover:text-pink-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <History className="w-4 h-4" />
                                    History
                                </Link>
                                <Link
                                    to="/settings"
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all ${isActive('/settings')
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </Link>
                                <div className="flex items-center gap-3 pl-4 ml-2 border-l border-gray-200">
                                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105 active:scale-95"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
