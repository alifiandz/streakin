'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { MobileContainer } from '@/components/layout/MobileContainer';

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentUser, login, register } = useAuth();

  const tabParam = searchParams?.get('tab');
  const nextParam = searchParams?.get('next');

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
      router.replace(nextParam ? decodeURIComponent(nextParam) : '/home');
    }
  }, [currentUser, router, nextParam]);

  // Register state
  const [regNama, setRegNama] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [forgotPasswordMsg, setForgotPasswordMsg] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setIsSubmitting(true);
    const res = await register(regNama, regEmail, regPassword);
    setIsSubmitting(false);
    if (res.success) {
      router.replace('/library');
    } else {
      setRegError(res.error || 'Gagal mendaftar');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setForgotPasswordMsg(false);
    setIsSubmitting(true);
    const res = await login(loginEmail, loginPassword);
    setIsSubmitting(false);
    if (res.success) {
      const destination = nextParam ? decodeURIComponent(nextParam) : '/home';
      router.replace(destination);
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
    <div className="min-h-[100dvh] bg-[#15171A] text-[#EEF1F4] flex flex-col justify-center py-2.5 sm:py-8 overflow-x-hidden">
      <MobileContainer maxWidth="xl" withBottomNav={false}>
        {/* Brand Header */}
        <div className="text-center mb-3 sm:mb-6">
          <div className="inline-flex w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#FF7A03] text-[#15171A] items-center justify-center mb-2 sm:mb-2.5 shadow-lg shadow-[#FF7A03]/20">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-current stroke-[#15171A]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#EEF1F4]">
            Streak<span className="text-[#FF7A03]">In</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8A929C] mt-0.5">
            Kawan Latihan Kalistenik untuk Pelajar SMA / SMK
          </p>
        </div>

        {/* Auth Card */}
        <div className="card-surface p-3.5 sm:p-7 border-[#2E3238] shadow-2xl relative">
          {/* Quick Demo Helper Banner - Touch friendly */}
          <div className="mb-3 p-2.5 sm:p-3 rounded-xl bg-[#FF7A03]/10 border border-[#FF7A03]/20 flex items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[#FF7A03]">
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              <span>Coba cepat pakai akun demo?</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                fillDemoLogin();
              }}
              className="min-h-[44px] px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#15171A] bg-[#FF7A03] hover:bg-[#E66E00] flex items-center justify-center active:scale-95 transition-all flex-shrink-0"
            >
              Isi Demo
            </button>
          </div>

          {/* Tab Switcher - Area sentuh min 44px */}
          <div className="grid grid-cols-2 p-1 bg-[#15171A] rounded-xl border border-[#2E3238] mb-3 sm:mb-5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setRegError('');
              }}
              className={`min-h-[44px] py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center active:scale-95 ${
                activeTab === 'register'
                  ? 'bg-[#FF7A03] text-[#15171A] shadow-sm'
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
              className={`min-h-[44px] py-2 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center active:scale-95 ${
                activeTab === 'login'
                  ? 'bg-[#FF7A03] text-[#15171A] shadow-sm'
                  : 'text-[#8A929C] hover:text-[#EEF1F4]'
              }`}
            >
              Masuk
            </button>
          </div>

          {/* Register Form */}
          {activeTab === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#8A929C] mb-1">
                  Nama Panggilan <span className="text-[11px] text-[#8A929C] font-normal">(misal: Rizky)</span>
                </label>
                <input
                  type="text"
                  required
                  value={regNama}
                  onChange={(e) => setRegNama(e.target.value)}
                  placeholder="Rizky Maulana"
                  className="w-full min-h-[46px] bg-[#15171A] border border-[#2E3238] focus:border-[#FF7A03] focus:outline-none rounded-xl px-3.5 py-2.5 text-sm text-[#EEF1F4] placeholder-[#5C636B] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A929C] mb-1">
                  Email Siswa / Sekolah
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="rizky@sma11.sch.id"
                  className="w-full min-h-[46px] bg-[#15171A] border border-[#2E3238] focus:border-[#FF7A03] focus:outline-none rounded-xl px-3.5 py-2.5 text-sm text-[#EEF1F4] placeholder-[#5C636B] transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
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
                    className="w-full min-h-[46px] bg-[#15171A] border border-[#2E3238] focus:border-[#FF7A03] focus:outline-none rounded-xl px-3.5 py-2.5 text-sm text-[#EEF1F4] placeholder-[#5C636B] pr-12 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    aria-label="Lihat kata sandi"
                    className="absolute right-1 top-0 bottom-0 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#8A929C] hover:text-[#EEF1F4]"
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
                disabled={isSubmitting}
                className="w-full btn-brand min-h-[48px] py-3 text-sm font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-50 active:scale-98 transition-all"
              >
                <span>{isSubmitting ? 'Memproses...' : 'Buat Akun'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <div className="p-3 rounded-xl bg-[#15171A] border border-[#2E3238] text-[11px] text-[#8A929C] flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF7A03] flex-shrink-0 mt-0.5" />
                <span>Setelah mendaftar, kamu akan menyusun library latihan pertamamu (durasi 10, 15, atau 30 menit).</span>
              </div>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#8A929C] mb-1">
                  Email Terdaftar
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="rizky@sma11.sch.id"
                  className="w-full min-h-[46px] bg-[#15171A] border border-[#2E3238] focus:border-[#FF7A03] focus:outline-none rounded-xl px-3.5 py-2.5 text-sm text-[#EEF1F4] placeholder-[#5C636B] transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#8A929C]">Kata Sandi</label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordMsg(true)}
                    className="min-h-[44px] px-2 flex items-center text-[11px] text-[#FF7A03] hover:underline"
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
                    className="w-full min-h-[46px] bg-[#15171A] border border-[#2E3238] focus:border-[#FF7A03] focus:outline-none rounded-xl px-3.5 py-2.5 text-sm text-[#EEF1F4] placeholder-[#5C636B] pr-12 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    aria-label="Lihat kata sandi"
                    className="absolute right-1 top-0 bottom-0 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#8A929C] hover:text-[#EEF1F4]"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {forgotPasswordMsg && (
                <div className="p-3 rounded-xl bg-[#FF7A03]/10 border border-[#FF7A03]/30 text-xs text-[#FF7A03]">
                  Tautan atur ulang kata sandi dikirim ke emailmu (simulasi demo).
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
                disabled={isSubmitting}
                className="w-full btn-brand min-h-[48px] py-3 text-sm font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-50 active:scale-98 transition-all"
              >
                <span>{isSubmitting ? 'Memproses...' : 'Masuk ke Akun'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          )}

          {/* Bottom helper */}
          <div className="mt-5 pt-3.5 border-t border-[#2E3238] text-center text-xs text-[#8A929C]">
            {activeTab === 'register' ? (
              <p className="flex items-center justify-center gap-1">
                <span>Sudah punya akun?</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="min-h-[44px] px-2 font-bold text-[#FF7A03] hover:underline inline-flex items-center"
                >
                  Masuk di sini
                </button>
              </p>
            ) : (
              <p className="flex items-center justify-center gap-1">
                <span>Belum punya akun?</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="min-h-[44px] px-2 font-bold text-[#FF7A03] hover:underline inline-flex items-center"
                >
                  Daftar sekarang (Gratis)
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-5">
          <Link
            href="/"
            className="min-h-[44px] inline-flex items-center justify-center px-4 text-xs text-[#8A929C] hover:text-[#EEF1F4] transition-colors"
          >
            ← Kembali ke Beranda Publik
          </Link>
        </div>
      </MobileContainer>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-[#15171A] flex items-center justify-center text-[#8A929C]">Memuat...</div>}>
      <AuthContent />
    </Suspense>
  );
}
