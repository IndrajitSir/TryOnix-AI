import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
    const [settings, setSettings] = useState({
        autoDeleteImages: false,
        faceBlur: false,
    });
    const [saved, setSaved] = useState(false);

    const handleToggle = (key) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
        setSaved(false);
    };

    const handleSave = () => {
        // Save settings to localStorage or backend
        localStorage.setItem('userSettings', JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <SettingsIcon className="w-6 h-6 text-white" />
                    </div>
                    Settings
                </h1>
                <p className="text-lg text-gray-600">Manage your preferences and privacy settings</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
                {/* Privacy Settings */}
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy & Data</h2>

                    {/* Auto Delete Images */}
                    <div className="flex items-center justify-between py-4">
                        <div className="flex-1">
                            <h3 className="text-base font-medium text-gray-900 mb-1">
                                Auto-delete uploaded images
                            </h3>
                            <p className="text-sm text-gray-500">
                                Automatically delete your uploaded images after processing is complete
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggle('autoDeleteImages')}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.autoDeleteImages ? 'bg-indigo-600' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${settings.autoDeleteImages ? 'translate-x-7' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Face Blur */}
                    <div className="flex items-center justify-between py-4 border-t border-gray-100">
                        <div className="flex-1">
                            <h3 className="text-base font-medium text-gray-900 mb-1">
                                Face blur
                            </h3>
                            <p className="text-sm text-gray-500">
                                Apply blur to facial features for additional privacy protection
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggle('faceBlur')}
                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${settings.faceBlur ? 'bg-indigo-600' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${settings.faceBlur ? 'translate-x-7' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Save Button */}
                <div className="p-6 bg-gray-50">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        className={`w-full py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${saved
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg'
                            }`}
                    >
                        {saved ? (
                            <>
                                <Check className="w-5 h-5" />
                                Settings Saved!
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Settings
                            </>
                        )}
                    </motion.button>
                </div>
            </motion.div>

            {/* Additional Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg"
            >
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Your privacy is important to us. All images are processed securely and you have full control over your data.
                </p>
            </motion.div>
        </div>
    );
};

export default Settings;
