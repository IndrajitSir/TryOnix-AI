import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import MainLayout from './layouts/MainLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TryOn from './pages/TryOn';
import History from './pages/History';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<MainLayout><Landing /></MainLayout>} />
                <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
                <Route path="/register" element={<MainLayout><Register /></MainLayout>} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
                    <Route path="/try-on" element={<MainLayout><TryOn /></MainLayout>} />
                    <Route path="/history" element={<MainLayout><History /></MainLayout>} />
                    <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
                </Route>
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans text-gray-900">
                    <Navbar />
                    <AnimatedRoutes />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
