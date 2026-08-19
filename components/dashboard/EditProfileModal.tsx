'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  X,
  Loader2,
  User,
  Phone,
  Globe,
  MapPin,
  FileText,
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  AlertCircle
} from 'lucide-react';
import { User as UserType } from '@/lib/types';
import { userService } from '@/lib/services/user.service';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/form-elements';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  bio: z.string().max(200, 'Bio must be under 200 characters').optional().nullable(),
  socialLinks: z.object({
    instagram: z.string().url('Invalid URL').or(z.literal('')).optional().nullable(),
    linkedin: z.string().url('Invalid URL').or(z.literal('')).optional().nullable(),
    facebook: z.string().url('Invalid URL').or(z.literal('')).optional().nullable(),
    x: z.string().url('Invalid URL').or(z.literal('')).optional().nullable(),
  }).optional().nullable(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  onUpdate: (updatedUser: UserType) => void;
}

export function EditProfileModal({ isOpen, onClose, user, onUpdate }: EditProfileModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'social'>('general');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phoneNumber: user.phoneNumber || '',
      country: user.country || '',
      address: user.address || '',
      bio: user.bio || '',
      socialLinks: {
        instagram: user.socialLinks?.instagram || '',
        linkedin: user.socialLinks?.linkedin || '',
        facebook: user.socialLinks?.facebook || '',
        x: user.socialLinks?.x || '',
      },
    },
  });

  const bioValue = watch('bio') || '';

  useEffect(() => {
    if (isOpen) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        country: user.country || '',
        address: user.address || '',
        bio: user.bio || '',
        socialLinks: {
          instagram: user.socialLinks?.instagram || '',
          linkedin: user.socialLinks?.linkedin || '',
          facebook: user.socialLinks?.facebook || '',
          x: user.socialLinks?.x || '',
        },
      });
      setError(null);
    }
  }, [isOpen, user, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const updateData: Record<string, unknown> = {
        ...data,
        socialLinks: data.socialLinks
          ? {
              instagram: data.socialLinks.instagram || undefined,
              linkedin: data.socialLinks.linkedin || undefined,
              facebook: data.socialLinks.facebook || undefined,
              x: data.socialLinks.x || undefined,
            }
          : null,
      };

      const response = await userService.updateProfile(updateData);
      if (response?.data) {
        onUpdate(response.data as UserType);
        onClose();
      }
    } catch (err: unknown) {
      console.error('Update profile error:', err);
      const apiError = err as { response?: { data?: { error?: string } } };
      setError(apiError.response?.data?.error || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-3xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-card">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-foreground">Edit Executive Profile</h2>
              <p className="text-xs text-muted-foreground">Keep your digital business card details up to date</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border bg-secondary/30 px-6 gap-2">
          {[
            { id: 'general', label: 'General Info', icon: User },
            { id: 'contact', label: 'Contact Details', icon: Phone },
            { id: 'social', label: 'Social Presence', icon: Globe },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as 'general' | 'contact' | 'social')}
              className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3.5 bg-destructive/10 border border-destructive/20 rounded-xl text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: General Info */}
          {activeTab === 'general' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    className="rounded-xl"
                    {...register('firstName')}
                  />
                  {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    className="rounded-xl"
                    {...register('lastName')}
                  />
                  {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    Executive Bio / Tagline
                  </Label>
                  <span className={`text-[10px] font-mono ${bioValue.length > 180 ? 'text-amber-500 font-bold' : 'text-muted-foreground'}`}>
                    {bioValue.length}/200
                  </span>
                </div>
                <textarea
                  id="bio"
                  rows={3}
                  placeholder="E.g. Managing Partner @ Apex Ventures · AI & B2B SaaS Investor"
                  className="w-full p-3.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm leading-relaxed"
                  {...register('bio')}
                />
              </div>
            </div>
          )}

          {/* TAB 2: Contact Details */}
          {activeTab === 'contact' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phoneNumber" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    placeholder="+1 (555) 000-0000"
                    className="rounded-xl font-mono"
                    {...register('phoneNumber')}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="country" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" />
                    Country / Region
                  </Label>
                  <Input
                    id="country"
                    placeholder="e.g. United States"
                    className="rounded-xl"
                    {...register('country')}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  Office Address
                </Label>
                <Input
                  id="address"
                  placeholder="500 Howard St, San Francisco, CA"
                  className="rounded-xl"
                  {...register('address')}
                />
              </div>
            </div>
          )}

          {/* TAB 3: Social Presence */}
          {activeTab === 'social' && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1.5">
                <Label htmlFor="linkedin" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Linkedin className="h-3.5 w-3.5 text-blue-500" />
                  LinkedIn Profile URL
                </Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/username"
                  className="rounded-xl font-mono text-xs"
                  {...register('socialLinks.linkedin')}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="x" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Twitter className="h-3.5 w-3.5 text-cyan-400" />
                  X (Twitter) URL
                </Label>
                <Input
                  id="x"
                  placeholder="https://x.com/username"
                  className="rounded-xl font-mono text-xs"
                  {...register('socialLinks.x')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="instagram" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Instagram className="h-3.5 w-3.5 text-pink-500" />
                    Instagram URL
                  </Label>
                  <Input
                    id="instagram"
                    placeholder="https://instagram.com/username"
                    className="rounded-xl font-mono text-xs"
                    {...register('socialLinks.instagram')}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="facebook" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Facebook className="h-3.5 w-3.5 text-blue-600" />
                    Facebook URL
                  </Label>
                  <Input
                    id="facebook"
                    placeholder="https://facebook.com/username"
                    className="rounded-xl font-mono text-xs"
                    {...register('socialLinks.facebook')}
                  />
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-card flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl text-xs"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="btn-primary-glow rounded-xl font-semibold text-xs px-6"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                Saving Changes...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
