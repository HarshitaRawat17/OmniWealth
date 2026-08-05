import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, ArrowRight, Smartphone, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginPageProps {
  onLoginSuccess: () => void;
  isDark: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, isDark }) => {
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleGetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length === 10) {
      setStep('otp');
      setCountdown(30);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.every(d => d !== '')) {
      onLoginSuccess();
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
      isDark ? "bg-[#0B0F19] text-white" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* Hero Header */}
      <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-teal-500/30 blur-2xl rounded-full"></div>
          <div className={`relative w-20 h-20 mx-auto rounded-2xl flex items-center justify-center border shadow-xl ${
            isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <ShieldCheck className="w-10 h-10 text-teal-500" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
          OmniWealth <span className="text-teal-500">AI</span>
        </h1>
        <p className={`text-sm md:text-base font-medium tracking-wide uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Unified Intelligence & Portfolio Aggregation
        </p>
      </div>

      {/* Main Card */}
      <div className={`w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-500 border ${
        isDark ? "bg-slate-900/80 border-slate-800 backdrop-blur-xl" : "bg-white border-slate-200"
      }`}>
        
        <AnimatePresence mode="wait">
          {step === 'mobile' ? (
            <motion.div
              key="mobile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
                Secure Login
              </h2>
              <form onSubmit={handleGetOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Mobile Number
                  </label>
                  <div className={`flex items-center rounded-xl border focus-within:ring-2 focus-within:ring-teal-500/50 transition-all ${
                    isDark ? "bg-slate-950/50 border-slate-700" : "bg-slate-50 border-slate-300"
                  }`}>
                    <div className={`flex items-center gap-2 px-4 py-3.5 border-r ${isDark ? "border-slate-700" : "border-slate-300"}`}>
                      <span className="text-lg leading-none">🇮🇳</span>
                      <span className={`font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>+91</span>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 bg-transparent px-4 py-3.5 font-bold outline-none tracking-wider text-lg w-full"
                      placeholder="99999 99999"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={mobileNumber.length !== 10}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  Get OTP
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              {/* Alternative Logins */}
              <div className="mt-8 space-y-4">
                <div className="relative">
                  <div className={`absolute inset-0 flex items-center`}>
                    <div className={`w-full border-t ${isDark ? "border-slate-800" : "border-slate-200"}`}></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className={`px-4 text-[10px] font-bold uppercase tracking-widest ${
                      isDark ? "bg-slate-900 text-slate-500" : "bg-white text-slate-400"
                    }`}>
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border font-semibold text-xs transition-colors ${
                    isDark ? "bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300" : "bg-white border-slate-300 hover:bg-slate-50 text-slate-700"
                  }`}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google Login
                  </button>
                  <button className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border font-semibold text-xs transition-colors ${
                    isDark ? "bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300" : "bg-white border-slate-300 hover:bg-slate-50 text-slate-700"
                  }`}>
                    <Fingerprint className="w-4 h-4 text-teal-500" />
                    Enter MPIN
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Verify OTP
                </h2>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Enter the 4-digit code sent to +91 {mobileNumber.slice(0,5)} {mobileNumber.slice(5)}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className={`w-14 h-14 md:w-16 md:h-16 text-center text-2xl font-black rounded-xl border focus:ring-2 focus:ring-teal-500/50 outline-none transition-all ${
                        isDark 
                          ? "bg-slate-950/50 border-slate-700 text-white" 
                          : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <div className="text-center text-xs font-semibold">
                  {countdown > 0 ? (
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>
                      Resend code in <span className="text-teal-500">{countdown}s</span>
                    </span>
                  ) : (
                    <button 
                      onClick={() => setCountdown(30)}
                      className="text-teal-500 hover:text-teal-400 transition-colors"
                    >
                      Resend OTP Now
                    </button>
                  )}
                </div>

                <button
                  onClick={handleVerify}
                  disabled={!otp.every(d => d !== '')}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Verify & Connect AA
                </button>
                
                <button
                  onClick={() => setStep('mobile')}
                  className={`w-full text-xs font-bold uppercase tracking-wider ${
                    isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"
                  } transition-colors`}
                >
                  Change Number
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Trust Footer */}
      <div className="mt-8 flex items-center justify-center gap-2 opacity-60">
        <ShieldCheck className={`w-4 h-4 ${isDark ? "text-slate-400" : "text-slate-500"}`} />
        <span className={`text-[10px] font-bold uppercase tracking-widest ${
          isDark ? "text-slate-400" : "text-slate-500"
        }`}>
          100% Encrypted & RBI Account Aggregator Compliant
        </span>
      </div>

    </div>
  );
};
