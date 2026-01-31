import React, { useState } from 'react';
import { Upload, X, Wand2, Download, Save, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const TryOn = () => {
    const [personImage, setPersonImage] = useState(null);
    const [clothImage, setClothImage] = useState(null);
    const [personPreview, setPersonPreview] = useState(null);
    const [clothPreview, setClothPreview] = useState(null);
    const [resultImage, setResultImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sliderPosition, setSliderPosition] = useState(50);

    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }
            if (type === 'person') {
                setPersonImage(file);
                setPersonPreview(URL.createObjectURL(file));
            } else {
                setClothImage(file);
                setClothPreview(URL.createObjectURL(file));
            }
            setError('');
            if (resultImage) setResultImage(null);
        }
    };

    const handleDrop = (e, type) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const fakeEvent = { target: { files: [file] } };
            handleImageChange(fakeEvent, type);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const removeImage = (type) => {
        if (type === 'person') {
            setPersonImage(null);
            setPersonPreview(null);
        } else {
            setClothImage(null);
            setClothPreview(null);
        }
        setResultImage(null);
        setError('');
    };

    const handleSubmit = async () => {
        if (!personImage || !clothImage) {
            setError('Please upload both images.');
            return;
        }

        setError('');
        setLoading(true);
        setResultImage(null);

        const formData = new FormData();
        formData.append('personImage', personImage);
        formData.append('clothImage', clothImage);

        try {
            const { data } = await api.post('/tryon', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResultImage(data.resultImageUrl);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        // Save functionality - already handled by backend when generating
        alert('Result saved to your history!');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Virtual Try-On Studio</h1>
                <p className="text-lg text-gray-600">Upload your photo and clothing item to see yourself in a new outfit</p>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md"
                    >
                        <p className="text-red-700 font-medium">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="space-y-6">
                    {/* Person Image Upload */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <Upload className="w-4 h-4 text-white" />
                                </div>
                                Your Photo
                            </h3>
                            {personPreview && (
                                <button
                                    onClick={() => removeImage('person')}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <div
                            onDrop={(e) => handleDrop(e, 'person')}
                            onDragOver={handleDragOver}
                            className={`border-2 border-dashed rounded-xl h-80 flex flex-col items-center justify-center transition-all ${personPreview
                                    ? 'border-blue-200 bg-blue-50/30'
                                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50/20'
                                }`}
                        >
                            {personPreview ? (
                                <motion.img
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    src={personPreview}
                                    alt="Person"
                                    className="h-full w-full object-contain rounded-lg"
                                />
                            ) : (
                                <label className="cursor-pointer flex flex-col items-center w-full h-full justify-center group">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    </div>
                                    <span className="text-base font-medium text-gray-700 mb-1">
                                        Click to upload or drag & drop
                                    </span>
                                    <span className="text-sm text-gray-500">JPG, PNG (Max 5MB)</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, 'person')}
                                    />
                                </label>
                            )}
                        </div>
                    </motion.div>

                    {/* Clothing Image Upload */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Upload className="w-4 h-4 text-white" />
                                </div>
                                Clothing Item
                            </h3>
                            {clothPreview && (
                                <button
                                    onClick={() => removeImage('cloth')}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <div
                            onDrop={(e) => handleDrop(e, 'cloth')}
                            onDragOver={handleDragOver}
                            className={`border-2 border-dashed rounded-xl h-80 flex flex-col items-center justify-center transition-all ${clothPreview
                                    ? 'border-pink-200 bg-pink-50/30'
                                    : 'border-gray-300 hover:border-pink-500 hover:bg-pink-50/20'
                                }`}
                        >
                            {clothPreview ? (
                                <motion.img
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    src={clothPreview}
                                    alt="Clothing"
                                    className="h-full w-full object-contain rounded-lg"
                                />
                            ) : (
                                <label className="cursor-pointer flex flex-col items-center w-full h-full justify-center group">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-pink-100 transition-colors">
                                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-pink-500 transition-colors" />
                                    </div>
                                    <span className="text-base font-medium text-gray-700 mb-1">
                                        Click to upload or drag & drop
                                    </span>
                                    <span className="text-sm text-gray-500">JPG, PNG (Max 5MB)</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, 'cloth')}
                                    />
                                </label>
                            )}
                        </div>
                    </motion.div>

                    {/* Generate Button */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        onClick={handleSubmit}
                        disabled={loading || !personImage || !clothImage}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Generating Magic...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-6 h-6" />
                                Generate Try-On
                            </>
                        )}
                    </motion.button>
                </div>

                {/* Result Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-8"
                >
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                            <Wand2 className="w-4 h-4 text-white" />
                        </div>
                        Result
                    </h3>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl min-h-[600px] flex items-center justify-center relative overflow-hidden">
                        {loading && (
                            <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center backdrop-blur-sm">
                                <div className="relative">
                                    <div className="w-24 h-24 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                                    <Wand2 className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                <p className="text-purple-600 font-semibold mt-6 text-lg animate-pulse">
                                    Creating your perfect look...
                                </p>
                            </div>
                        )}

                        {resultImage ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full h-full p-4"
                            >
                                {/* Before/After Slider */}
                                <div className="relative w-full h-[550px] rounded-lg overflow-hidden">
                                    {/* After Image (Result) */}
                                    <img
                                        src={resultImage}
                                        alt="Result"
                                        className="absolute inset-0 w-full h-full object-contain"
                                    />
                                    {/* Before Image (Person) with slider */}
                                    {personPreview && (
                                        <div
                                            className="absolute inset-0 overflow-hidden"
                                            style={{ width: `${sliderPosition}%` }}
                                        >
                                            <img
                                                src={personPreview}
                                                alt="Before"
                                                className="absolute inset-0 w-full h-full object-contain"
                                                style={{ width: `${(100 / sliderPosition) * 100}%` }}
                                            />
                                        </div>
                                    )}
                                    {/* Slider Control */}
                                    <div
                                        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 shadow-lg"
                                        style={{ left: `${sliderPosition}%` }}
                                        onMouseDown={(e) => {
                                            const container = e.currentTarget.parentElement;
                                            const handleMove = (moveEvent) => {
                                                const rect = container.getBoundingClientRect();
                                                const x = moveEvent.clientX - rect.left;
                                                const percentage = (x / rect.width) * 100;
                                                setSliderPosition(Math.max(0, Math.min(100, percentage)));
                                            };
                                            const handleUp = () => {
                                                document.removeEventListener('mousemove', handleMove);
                                                document.removeEventListener('mouseup', handleUp);
                                            };
                                            document.addEventListener('mousemove', handleMove);
                                            document.addEventListener('mouseup', handleUp);
                                        }}
                                    >
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                                            <ArrowRight className="w-4 h-4 text-gray-600" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center text-gray-400 p-8">
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Wand2 className="w-10 h-10 text-gray-400" />
                                </div>
                                <p className="text-xl font-semibold text-gray-600 mb-2">Ready to Transform</p>
                                <p className="text-sm text-gray-500">Upload both images and click Generate</p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    {resultImage && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 flex gap-4"
                        >
                            <a
                                href={resultImage}
                                download="tryon-result.jpg"
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Download className="w-5 h-5" />
                                Download
                            </a>
                            <button
                                onClick={handleSave}
                                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Save className="w-5 h-5" />
                                Save
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default TryOn;
