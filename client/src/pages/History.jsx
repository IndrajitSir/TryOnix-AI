import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Loader2, Trash2, Calendar, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const { data } = await api.get('/tryon/history');
            setHistory(data);
        } catch (error) {
            console.error('Failed to fetch history', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this try-on?')) return;
        try {
            await api.delete(`/tryon/${id}`);
            setHistory(history.filter(item => item._id !== id));
        } catch (error) {
            console.error('Failed to delete item', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <Calendar className="w-10 h-10 text-indigo-600" />
                    Your Try-On History
                </h1>
                <p className="text-lg text-gray-600">Browse and manage your virtual try-on results</p>
            </motion.div>

            {history.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300"
                >
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-700 mb-2">No try-ons yet</p>
                    <p className="text-gray-500 mb-6">Start creating amazing virtual try-ons!</p>
                    <a
                        href="/try-on"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
                    >
                        Create Your First Try-On
                    </a>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all"
                        >
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Date N/A'}
                                </span>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-1 p-2 bg-gray-50">
                                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-200 relative group">
                                    <img src={item.personImageUrl} alt="Person" className="object-cover w-full h-full" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold">
                                        Person
                                    </div>
                                </div>
                                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-200 relative group">
                                    <img src={item.clothImageUrl} alt="Cloth" className="object-cover w-full h-full" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold">
                                        Clothing
                                    </div>
                                </div>
                                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-200 ring-2 ring-indigo-500 relative">
                                    <img src={item.resultImageUrl} alt="Result" className="object-cover w-full h-full" />
                                    <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                        Result
                                    </div>
                                </div>
                            </div>
                            <div className="p-3">
                                <a
                                    href={item.resultImageUrl}
                                    download={`tryon-${item._id}.jpg`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Result
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
