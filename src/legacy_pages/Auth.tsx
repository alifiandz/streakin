import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Zap, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MobileContainer } from '../components/layout/MobileContainer';

export const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser, login, register } = useAuth();

  const tabParam = searchParams.get('tab');
  const nextParam = searchParams.get('next');

  const [activeTab, setActiveTab] = useState<'register' | 'login'>(
    tabParam === 'register' ? 'register' : 'login'
  );

  useEffect(() => {
    if (tabParam === 'register') {
      setActiveTab('register');
    } else if (tabParam === 'login') {
      setActiveTab('login');
    }
  }, [tabParam]);

  // If already logged in, redirect to next or home
  useEffect(() => {
    if (currentUser) {
      navigate(nextParam ? decodeURIComponent(nextParam) : '/home', { replace: true });
    }
  }, [currentUser, navigate, nextParam]);

  // Register state
  const [regNama, setRegNama] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    const res = register(regNama, regEmail, regPassword);
    if (res.success) {
      // Mandatory onboarding redirect to /library
      navigate('/library', { replace: true });
    } else {
      setRegError(res.error || 'Gagal mendaftar');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setForgotPasswordMsg(false);
    const res = login(loginEmail, loginPassword);
    if (res.success) {
      const destination = nextParam ? decodeURIComponent(nextParam) : '/home';
      navigate(destination, { replace: true });
    } else {
      setLoginError(res.error || 'Email atau kata sandi salah');
    }
  };

  // Demo auto-fill helper for quick review
  const fillDemoLogin = () => {
    setLoginEmail('rizky@sma11.sch.id');
    setLoginPassword('rahasia123');
    setLoginError('');
  };

  return (
    <div className="min-h-screen bg-[#15171A] text-[#EEF1F4] flex flex-col justify-center">
      <MobileContainer maxWidth="xl" withBottomNav={false}>
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-[#C8F135] text-[#15171A] items-center justify-center mb-3 shadow-lg shadow-[#C8F135]/20">
            <Zap className="w-6 h-6 fill-current stroke-[#15171A]" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#EEF1F4]">
            Calisthenic <span className="text-[#C8F135]">Siswa Sibuk</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8A929C] mt-1">
            Platform Kebugaran Singkat & Terukur untuk Pelajar Menengah
          </p>
        </div>

        {/* Auth Card */}
        <div className="card-surface p-6 sm:p-8 border-[#2E3238] shadow-2xl relative">
          {/* Quick Demo Helper Banner */}
          <div className="mb-5 p-3 rounded-xl bg-[#C8F135]/10 border border-[#C8F135]/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#C8F135]">
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              <span>Coba cepat dengan akun siswa demo?</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                fillDemoLogin();
              }}
              className="text-xs font-bold text-[#15171A] bg-[#C8F135] hover:bg-[#b8e026] px-2.5 py-1 rounded-lg transition-colors"
            >
              Isi Demo
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-[#15171A] rounded-xl border border-[#2E3238] mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setRegError('');
              }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === 'register'
                  ? 'bg-[#C8F135] text-[#15171A] shadow-sm'
                  : 'text-[#8A929C] hover:text-[#EEF1F4]'
              }`}
            >
              Buat Akun
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setLoginError('');
              }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeTab === 'login'
                  ? 'bg-[#C8F135] text-[#15171A] shadow-sm'
                  : 'text-[#8A929C] hover:text-[#EEF1F4]'
              }`}
            >
              Masuk
            </button>
          </div>

          {/* Register Form */}
          {activeTab === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8A929C] mb-1.5">
                  Nama Panggilan <span className="text-[11px] text-[#8A929C] font-normal">(misal: Rizky)</span>
                </label>
                <input
                  type="text"
                  required
                  value={regNama}
                  onChange={(e) => setRegNama(e.target.value)}
                  placeholder="Rizky Maulana"
                  className="w-full bg-[#15171A] border border-[#2E3238] focus:border-[#C8F135] focus:outline-none rounded-xl px-4 py-3 text-sm text-[#EEF1F4] placeholder-[#5C636B] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A929C] mb-1.5">
                  Email Siswa / Sekolah
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="rizky@sma11.sch.id"
                  className="w-full bg-[#15171A] border border-[#2E3238] focus:border-[#C8F135] focus:outline-none rounded-xl px-4 py-3 text-sm text-[#EEF1F4] placeholder-[#5C636B] transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#8A929C]">Kata Sandi</label>
                  <span className="text-[11px] text-[#8A929C]">min. 8 karakter</span>
                </div>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#15171A] border border-[#2E3238] focus:border-[#C8F135] focus:outline-none rounded-xl px-4 py-3 text-sm text-[#EEF1F4] placeholder-[#5C636B] pr-10 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-3.5 text-[#8A929C] hover:text-[#EEF1F4]"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {regError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-brand py-3.5 text-sm font-bold flex items-center justify-center gap-2 mt-2"
              >
                <span>Buat Akun</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <div className="p-3 rounded-xl bg-[#15171A] border border-[#2E3238] text-[11px] text-[#8A929C] flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C8F135] flex-shrink-0 mt-0.5" />
                <span>Setelah mendaftar, kamu akan memilah library latihan pertamamu (durasi 10, 15, atau 30 menit).</span>
              </div>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8A929C] mb-1.5">
                  Email Terdaftar
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="rizky@sma11.sch.id"
                  className="w-full bg-[#15171A] border border-[#2E3238] focus:border-[#C8F135] focus:outline-none rounded-xl px-4 py-3 text-sm text-[#EEF1F4] placeholder-[#5C636B] transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#8A929C]">Kata Sandi</label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordMsg(true)}
                    className="text-[11px] text-[#C8F135] hover:underline"
                  >
                    Lupa kata sandi?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#15171A] border border-[#2E3238] focus:border-[#C8F135] focus:outline-none rounded-xl px-4 py-3 text-sm text-[#EEF1F4] placeholder-[#5C636B] pr-10 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-3.5 text-[#8A929C] hover:text-[#EEF1F4]"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {forgotPasswordMsg && (
                <div className="p-3 rounded-xl bg-[#C8F135]/10 border border-[#C8F135]/30 text-xs text-[#C8F135]">
                  Tautan atur ulang dikirim ke emailmu (simulasi).
                </div>
              )}

              {loginError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-brand py-3.5 text-sm font-bold flex items-center justify-center gap-2 mt-2"
              >
                <span>Masuk ke Akun</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          )}

          {/* Bottom helper */}
          <div className="mt-6 pt-4 border-t border-[#2E3238] text-center text-xs text-[#8A929C]">
            {activeTab === 'register' ? (
              <p>
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="font-bold text-[#C8F135] hover:underline"
                >
                  Masuk di sini
                </button>
              </p>
            ) : (
              <p>
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="font-bold text-[#C8F135] hover:underline"
                >
                  Daftar sekarang (Gratis)
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-[#8A929C] hover:text-[#EEF1F4] transition-colors">
            ← Kembali ke Beranda Publik
          </Link>
        </div>
      </MobileContainer>
    </div>
  );
};
