import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wand2, History as HistoryIcon, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user } = useAuth();

    const quickActions = [
        {
            title: 'Start New Try-On',
            description: 'Upload your photo and clothing to create a new virtual try-on',
            icon: Wand2,
            link: '/try-on',
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'View History',
            description: 'Browse your previous try-on results and download them',
            icon: HistoryIcon,
            link: '/history',
            color: 'from-blue-500 to-indigo-500',
            bgColor: 'bg-blue-50',
        },
    ];

    const stats = [
        {
            label: 'Total Try-Ons',
            value: '12',
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            label: 'Today Used Tries',
            value: '3',
            icon: Zap,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Welcome back, {user?.name || 'User'}! 👋
                </h1>
                <p className="text-lg text-gray-600">Ready to try on some new outfits today?</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <div className={`${stat.bgColor} p-4 rounded-xl`}>
                                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quickActions.map((action, index) => (
                        <motion.div
                            key={action.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <Link
                                to={action.link}
                                className="block bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl transition-all group"
                            >
                                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${action.color} mb-4 group-hover:scale-110 transition-transform`}>
                                    <action.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{action.title}</h3>
                                <p className="text-gray-600">{action.description}</p>
                                <div className="mt-4 flex items-center text-indigo-600 font-medium group-hover:translate-x-2 transition-transform">
                                    Get Started
                                    <svg
                                        className="w-5 h-5 ml-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Tips Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl"
            >
                <h3 className="text-2xl font-bold mb-4">💡 Pro Tips</h3>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                        <span className="text-indigo-200 mt-1">•</span>
                        <span>Use well-lit photos for best results</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-indigo-200 mt-1">•</span>
                        <span>Stand straight and face the camera directly</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-indigo-200 mt-1">•</span>
                        <span>Choose clothing images with clear, visible details</span>
                    </li>
                </ul>
            </motion.div>
        </div>
    );
};

export default Dashboard;
