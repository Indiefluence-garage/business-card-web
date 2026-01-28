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
    Twitter
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

    const {
        register,
        handleSubmit,
        reset,
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

    // Reset form when user or isOpen changes
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
        }
    }, [isOpen, user, reset]);

    if (!isOpen) return null;

    const onSubmit = async (data: ProfileFormValues) => {
        setIsSubmitting(true);
        setError(null);
        try {
            // Clean up data for the API (remove nulls from socialLinks)
            const updateData: any = {
                ...data,
                socialLinks: data.socialLinks ? {
                    instagram: data.socialLinks.instagram || undefined,
                    linkedin: data.socialLinks.linkedin || undefined,
                    facebook: data.socialLinks.facebook || undefined,
                    x: data.socialLinks.x || undefined,
                } : null
            };

            const response = await userService.updateProfile(updateData);
            if (response?.data) {
                onUpdate(response.data as UserType);
                onClose();
            }
        } catch (err: any) {
            console.error('Update profile error:', err);
            setError(err.response?.data?.error || 'Failed to update profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-bold text-foreground">Edit Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    {/* Basic Info Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    placeholder="Enter first name"
                                    {...register('firstName')}
                                    className={errors.firstName ? 'border-destructive focus-visible:ring-destructive' : ''}
                                />
                                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    placeholder="Enter last name"
                                    {...register('lastName')}
                                    className={errors.lastName ? 'border-destructive focus-visible:ring-destructive' : ''}
                                />
                                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Bio
                            </Label>
                            <Input
                                id="bio"
                                placeholder="Tell us a bit about yourself"
                                {...register('bio')}
                            />
                            <p className="text-[10px] text-muted-foreground text-right italic">Max 200 characters</p>
                        </div>
                    </div>

                    {/* Contact Details Section */}
                    <div className="space-y-4 pt-4 border-t border-border">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Contact Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    placeholder="e.g. +1 234 567 890"
                                    {...register('phoneNumber')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    placeholder="e.g. United States"
                                    {...register('country')}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address" className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Address
                            </Label>
                            <Input
                                id="address"
                                placeholder="Enter your address"
                                {...register('address')}
                            />
                        </div>
                    </div>

                    {/* Social Links Section */}
                    <div className="space-y-4 pt-4 border-t border-border">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Social Presence
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="instagram" className="flex items-center gap-2">
                                    <Instagram className="h-3 w-3" />
                                    Instagram URL
                                </Label>
                                <Input
                                    id="instagram"
                                    placeholder="https://instagram.com/..."
                                    {...register('socialLinks.instagram')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="linkedin" className="flex items-center gap-2">
                                    <Linkedin className="h-3 w-3" />
                                    LinkedIn URL
                                </Label>
                                <Input
                                    id="linkedin"
                                    placeholder="https://linkedin.com/in/..."
                                    {...register('socialLinks.linkedin')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="facebook" className="flex items-center gap-2">
                                    <Facebook className="h-3 w-3" />
                                    Facebook URL
                                </Label>
                                <Input
                                    id="facebook"
                                    placeholder="https://facebook.com/..."
                                    {...register('socialLinks.facebook')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="x" className="flex items-center gap-2">
                                    <Twitter className="h-3 w-3" />
                                    X (Twitter) URL
                                </Label>
                                <Input
                                    id="x"
                                    placeholder="https://x.com/..."
                                    {...register('socialLinks.x')}
                                />
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-border bg-muted/30 flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="min-w-[120px]"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
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
