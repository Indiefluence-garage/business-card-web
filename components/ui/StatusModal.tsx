'use client';

import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  UserCheck, 
  X, 
  ArrowRight,
  Info
} from 'lucide-react';
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
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      primaryBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-600 dark:text-amber-400',
      primaryBtn: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    auth: {
      icon: UserCheck,
      iconColor: 'text-primary',
      primaryBtn: 'btn-primary-glow',
    },
    error: {
      icon: AlertCircle,
      iconColor: 'text-rose-600 dark:text-rose-400',
      primaryBtn: 'bg-rose-600 hover:bg-rose-700 text-white',
    },
    info: {
      icon: Info,
      iconColor: 'text-primary',
      primaryBtn: 'btn-primary-glow',
    },
  }[type];

  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl transition-all">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Direct Clean Icon - No background box or border */}
          <IconComponent className={`h-10 w-10 mb-4 ${config.iconColor}`} strokeWidth={1.75} />

          {/* Title */}
          <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line mb-6 max-w-sm">
            {message}
          </p>

          {/* Optional Details Box */}
          {details && (
            <div className="w-full mb-6 rounded-lg bg-secondary border border-border p-3 text-left">
              <p className="text-[11px] font-mono text-muted-foreground break-words">
                {details}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex w-full flex-col sm:flex-row gap-2.5">
            {actionLabel && onAction ? (
              <Button
                onClick={onAction}
                className={`w-full flex-1 h-11 text-xs font-semibold rounded-lg ${config.primaryBtn}`}
              >
                <span>{actionLabel}</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            ) : null}

            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto px-5 h-11 rounded-lg border-border hover:bg-secondary text-foreground text-xs font-semibold"
            >
              {cancelLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
