import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Shield, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuth } from '../context/AuthContext';

const Landing = () => {
    const { user, logout } = useAuth();

    const features = [
        {
            icon: Zap,
            title: 'Realistic AI Try-On',
            description: 'Advanced AI technology creates photorealistic try-on results that preserve body proportions and fabric textures.',
            color: 'from-yellow-500 to-orange-500',
        },
        {
            icon: Shield,
            title: 'Privacy First',
            description: 'Your photos are processed securely with end-to-end encryption. You have full control over your data.',
            color: 'from-green-500 to-emerald-500',
        },
        {
            icon: Sparkles,
            title: 'Fast Results',
            description: 'Get your virtual try-on results in seconds. No waiting, no hassle - just instant fashion transformation.',
            color: 'from-purple-500 to-pink-500',
        },
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">

                            <div className="text-center lg:text-left">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
                                        <span className="block">Try clothes on yourself</span>
                                        <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            before you buy
                                        </span>
                                    </h1>
                                    <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-xl sm:max-w-xl sm:mx-auto md:mt-5 md:text-2xl lg:mx-0 lg:max-w-2xl">
                                        AI powered virtual try-on experience
                                    </p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start gap-4"
                                >
                                    {user ? (
                                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                                            <Link
                                                to="/tryon"
                                                className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-2xl md:py-4 md:text-lg md:px-10 transition-all transform hover:scale-105 active:scale-95"
                                            >
                                                Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                                            </Link>
                                            <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 rounded-lg border border-indigo-100">
                                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                                    <button
                                                        onClick={logout}
                                                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Link
                                                to="/register"
                                                className="w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-2xl md:py-4 md:text-lg md:px-10 transition-all transform hover:scale-105 active:scale-95"
                                            >
                                                Try Now <ArrowRight className="ml-2 w-5 h-5" />
                                            </Link>
                                            <Link
                                                to="/login"
                                                className="mt-3 sm:mt-0 w-full sm:w-auto flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-base font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 md:py-4 md:text-lg md:px-10 transition-all"
                                            >
                                                Login
                                            </Link>
                                        </>
                                    )}

                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-600"
                                >
                                    <div className="flex items-center gap-2">
                                        <Check className="w-5 h-5 text-green-500" />
                                        <span>No credit card required</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="w-5 h-5 text-green-500" />
                                        <span>Free to try</span>
                                    </div>
                                </motion.div>
                            </div>
                        </main>
                    </div>
                </div>

                {/* Demo Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 mt-12 lg:mt-0"
                >
                    <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center overflow-hidden relative">
                        <img
                            className="h-full w-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                            alt="Fashion model showcasing virtual try-on"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
                    </div>
                </motion.div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-white sm:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Why Choose TryOnix?
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
                            Experience the future of online shopping with our cutting-edge AI technology
                        </p>
                    </motion.div>

                    <div className="mt-16">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all"
                                >
                                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color} rounded-t-2xl`}></div>
                                    <div className={`inline-flex items-center justify-center p-3 bg-gradient-to-br ${feature.color} rounded-xl shadow-lg mb-4`}>
                                        <feature.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-base text-gray-600 leading-relaxed">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="mt-20 text-center"
                    >
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
                            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                                Ready to transform your shopping experience?
                            </h2>
                            <p className="mt-4 text-lg text-indigo-100">
                                Join thousands of users already using TryOnix
                            </p>
                            <Link
                                to="/register"
                                className="mt-8 inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-indigo-600 bg-white hover:bg-gray-50 transition-all transform hover:scale-105 active:scale-95 shadow-xl"
                            >
                                Get Started for Free <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
