'use client';

import { useState, useEffect } from 'react';
import { Timer, Sparkles } from 'lucide-react';

interface CountdownTimerProps {
  targetDate?: string;
  variant?: 'banner' | 'card' | 'hero';
  className?: string;
}

export function AzadiCountdownTimer({
  targetDate = '2026-08-30T23:59:59Z',
  variant = 'card',
  className = '',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const targetTime = new Date(targetDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) {
    // Return skeleton or SSR fallback to avoid hydration mismatches
    if (variant === 'banner') {
      return <span className="inline-flex items-center font-mono opacity-80">Loading sale timer...</span>;
    }
    return (
      <div className={`p-4 rounded-xl bg-[#01411C]/90 text-white animate-pulse ${className}`}>
        <div className="h-6 w-36 bg-emerald-800 rounded mx-auto mb-2" />
        <div className="h-10 w-48 bg-emerald-800 rounded mx-auto" />
      </div>
    );
  }

  if (timeLeft.isExpired) {
    return (
      <div className="inline-flex items-center gap-1.5 text-amber-400 font-semibold text-xs sm:text-sm">
        <span>Azadi Sale has ended</span>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm text-amber-300 font-bold ${className}`}>
        <Timer className="h-3.5 w-3.5 animate-pulse text-amber-300" />
        <span>Sale Ends In:</span>
        <span className="bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30 text-white">
          {String(timeLeft.days).padStart(2, '0')}d
        </span>
        <span>:</span>
        <span className="bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30 text-white">
          {String(timeLeft.hours).padStart(2, '0')}h
        </span>
        <span>:</span>
        <span className="bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30 text-white">
          {String(timeLeft.minutes).padStart(2, '0')}m
        </span>
        <span>:</span>
        <span className="bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30 text-amber-300">
          {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={`w-full max-w-lg mx-auto bg-gradient-to-r from-[#01411C] via-[#025624] to-[#013516] border border-amber-400/40 shadow-2xl rounded-2xl p-4 sm:p-6 text-white text-center relative overflow-hidden backdrop-blur-sm ${className}`}>
        {/* Subtle crescent background accent */}
        <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full border-4 border-amber-400/10 pointer-events-none" />
        
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xl">🇵🇰</span>
          <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-amber-300 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-400 animate-spin" />
            14% OFF Azadi Sale Ends In
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          <div className="bg-emerald-950/90 border border-amber-400/30 rounded-xl p-2 sm:p-3 shadow-inner">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-300 block">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs text-emerald-200 uppercase tracking-wider block font-medium mt-1">
              Days
            </span>
          </div>

          <div className="bg-emerald-950/90 border border-amber-400/30 rounded-xl p-2 sm:p-3 shadow-inner">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white block">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs text-emerald-200 uppercase tracking-wider block font-medium mt-1">
              Hours
            </span>
          </div>

          <div className="bg-emerald-950/90 border border-amber-400/30 rounded-xl p-2 sm:p-3 shadow-inner">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white block">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs text-emerald-200 uppercase tracking-wider block font-medium mt-1">
              Mins
            </span>
          </div>

          <div className="bg-emerald-950/90 border border-amber-400/30 rounded-xl p-2 sm:p-3 shadow-inner">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-300 block animate-pulse">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs text-emerald-200 uppercase tracking-wider block font-medium mt-1">
              Secs
            </span>
          </div>
        </div>

        <p className="text-[11px] sm:text-xs text-emerald-100/80 mt-3 font-sans">
          14% discount auto-applied at checkout until 30 August 2026
        </p>
      </div>
    );
  }

  // Card Variant
  return (
    <div className={`bg-[#01411C] border border-amber-400/30 rounded-xl p-3 sm:p-4 text-white text-center shadow-lg ${className}`}>
      <div className="flex items-center justify-center gap-1.5 mb-2 text-xs font-semibold text-amber-300 tracking-wide uppercase">
        <Timer className="h-4 w-4 text-amber-300" />
        Azadi Sale Ends In
      </div>
      <div className="flex items-center justify-center gap-2 font-mono text-lg sm:text-xl font-bold">
        <div className="bg-emerald-950 px-2 py-1 rounded border border-emerald-700">
          {String(timeLeft.days).padStart(2, '0')}d
        </div>
        <span>:</span>
        <div className="bg-emerald-950 px-2 py-1 rounded border border-emerald-700">
          {String(timeLeft.hours).padStart(2, '0')}h
        </div>
        <span>:</span>
        <div className="bg-emerald-950 px-2 py-1 rounded border border-emerald-700">
          {String(timeLeft.minutes).padStart(2, '0')}m
        </div>
        <span>:</span>
        <div className="bg-emerald-950 px-2 py-1 rounded border border-emerald-700 text-amber-300">
          {String(timeLeft.seconds).padStart(2, '0')}s
        </div>
      </div>
    </div>
  );
}
