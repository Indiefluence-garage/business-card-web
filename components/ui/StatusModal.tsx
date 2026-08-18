'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Sparkles, X, ArrowRight, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type StatusModalType = 'success' | 'warning' | 'auth' | 'error' | 'info';

export interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: StatusModalType;
  title: string;
  message: string;
  details?: string;
  actionLabel?: string;
  onAction?: () => void;
  cancelLabel?: string;
}

export function StatusModal({
  isOpen,
  onClose,
  type = 'info',
  title,
  message,
  details,
  actionLabel,
  onAction,
  cancelLabel = 'Close',
}: StatusModalProps) {
  if (!isOpen) return null;

  const config = {
    success: {
      icon: CheckCircle2,
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20',
      glow: 'from-emerald-500/10 via-transparent to-transparent',
      primaryBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25',
    },
    warning: {
      icon: AlertTriangle,
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/20',
      glow: 'from-amber-500/10 via-transparent to-transparent',
      primaryBtn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/25',
    },
    auth: {
      icon: LogIn,
      badgeColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
      iconBg: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 ring-sky-500/20',
      glow: 'from-sky-500/10 via-transparent to-transparent',
      primaryBtn: 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/25',
    },
    error: {
      icon: AlertCircle,
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      iconBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 ring-rose-500/20',
      glow: 'from-rose-500/10 via-transparent to-transparent',
      primaryBtn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/25',
    },
    info: {
      icon: Sparkles,
      badgeColor: 'bg-primary/10 text-primary border-primary/20',
      iconBg: 'bg-primary/15 text-primary ring-primary/20',
      glow: 'from-primary/10 via-transparent to-transparent',
      primaryBtn: 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/25',
    },
  }[type];

  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border/80 bg-card/95 p-6 md:p-8 shadow-2xl backdrop-blur-xl transition-all animate-scale-in">
        {/* Ambient Top Glow */}
        <div
          className={`pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-80 bg-gradient-to-b ${config.glow} rounded-full blur-2xl opacity-80`}
        />

        {/* Close Icon Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Status Icon */}
          <div
            className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ring-4 shadow-lg ${config.iconBg}`}
          >
            <IconComponent className="h-8 w-8" />
          </div>

          {/* Title */}
          <h3 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-3">
            {title}
          </h3>

          {/* Message */}
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line mb-6 max-w-sm">
            {message}
          </p>

          {/* Optional Details Box */}
          {details && (
            <div className="w-full mb-6 rounded-2xl bg-secondary/50 border border-border/60 p-4 text-left">
              <p className="text-xs font-mono text-muted-foreground break-words">
                {details}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex w-full flex-col sm:flex-row gap-3">
            {actionLabel && onAction ? (
              <Button
                onClick={onAction}
                className={`w-full flex-1 py-6 text-base font-semibold rounded-2xl shadow-lg transition-all active:scale-[0.98] ${config.primaryBtn}`}
              >
                <span>{actionLabel}</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : null}

            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-6 rounded-2xl border-border hover:bg-secondary text-foreground font-medium transition-all"
            >
              {cancelLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
