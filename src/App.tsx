import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WorkoutProvider } from './context/WorkoutContext';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Pages
import { Index } from './pages/Index';
import { Auth } from './pages/Auth';
import { Library } from './pages/Library';
import { Home } from './pages/Home';
import { WorkoutPlayer } from './pages/WorkoutPlayer';
import { WorkoutDone } from './pages/WorkoutDone';
import { History } from './pages/History';
import { Notification } from './pages/Notification';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <WorkoutProvider>
        <Router>
          <div className="min-h-screen bg-[#15171A] text-[#EEF1F4] flex flex-col">
            <Header />
            <div className="flex-1">
              <Routes>
                {/* 1. Beranda Publik */}
                <Route path="/" element={<Index />} />

                {/* 2. Akun (Auth) */}
                <Route path="/akun" element={<Auth />} />

                {/* 3. Custom Library (Protected) */}
                <Route
                  path="/library"
                  element={
                    <ProtectedRoute>
                      <Library />
                    </ProtectedRoute>
                  }
                />

                {/* 4. Dashboard Utama (Protected) */}
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />

                {/* 5. Player Latihan (Protected) */}
                <Route
                  path="/latihan/:sessionId"
                  element={
                    <ProtectedRoute>
                      <WorkoutPlayer />
                    </ProtectedRoute>
                  }
                />

                {/* 6. Selesai Latihan (Protected) */}
                <Route
                  path="/selesai/:logId"
                  element={
                    <ProtectedRoute>
                      <WorkoutDone />
                    </ProtectedRoute>
                  }
                />

                {/* 7. Riwayat Latihan (Protected) */}
                <Route
                  path="/riwayat"
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  }
                />

                {/* 8. Notifikasi (Protected) */}
                <Route
                  path="/notifikasi"
                  element={
                    <ProtectedRoute>
                      <Notification />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <BottomNav />
          </div>
        </Router>
      </WorkoutProvider>
    </AuthProvider>
  );
};

export default App;
