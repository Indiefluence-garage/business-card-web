'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Building2, Phone, Globe, MapPin, AlignLeft, CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react';
import { userService } from '@/lib/services/user.service';
import { ProfileImageUpload } from '@/components/ui/ProfileImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input, Label, Textarea } from '@/components/ui/form-elements';

type OnboardingStep = 'logo' | 'details' | 'success';

export default function OrganizationOnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState<OnboardingStep>('logo');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        phoneNumber: '',
        whatsappNumber: '',
        country: '',
        address: '',
        bio: ''
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/login');
            return;
        }
        const parsedUser = JSON.parse(userData);

        // Redirect logic
        if (parsedUser.userType !== 'organization') {
            router.push('/dashboard');
            return;
        }

        if (parsedUser.onboardingComplete) {
            router.push('/organization/dashboard');
            return;
        }
        setUser(parsedUser);
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const updateProfile = async (data: any, isComplete: boolean = false) => {
        try {
            setLoading(true);
            const updateData = { ...data };
            if (isComplete) {
                updateData.onboardingComplete = true;
            }

            const response = await userService.updateProfile(updateData);

            if (response?.data) {
                // Update local user data
                const updatedUser = { ...user, ...response.data };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);

                if (isComplete) {
                    setStep('success');
                    setTimeout(() => {
                        router.push('/organization/dashboard');
                    }, 2000);
                }
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to save details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (step === 'logo') setStep('details');
    };

    const handleSkipLogo = () => {
        setStep('details');
    };

    const handleSubmitDetails = async () => {
        await updateProfile(formData, true);
    };

    const handleSkipDetails = async () => {
        await updateProfile({}, true);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-xl">
                {/* Progress bar */}
                <div className="mb-8 flex items-center justify-between px-2">
                    {[
                        { id: 'logo', label: 'Logo' },
                        { id: 'details', label: 'Details' },
                        { id: 'success', label: 'Finish' }
                    ].map((s, idx) => (
                        <div key={s.id} className="flex items-center flex-1 last:flex-none">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-colors ${step === s.id ? 'bg-primary text-white' :
                                (idx < ['logo', 'details', 'success'].indexOf(step) ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-400')
                                }`}>
                                {idx < ['logo', 'details', 'success'].indexOf(step) ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                            </div>
                            {idx < 2 && (
                                <div className={`h-1 flex-1 mx-2 rounded ${idx < ['logo', 'details', 'success'].indexOf(step) ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-800'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>

                {step === 'logo' && (
                    <Card className="border-none shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
                                <Building2 className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-2xl font-bold tracking-tight">Organization Logo</CardTitle>
                            <CardDescription>Upload your brand logo for a professional look.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center py-8">
                            <ProfileImageUpload
                                image={user.image}
                                userInitials={user.name?.[0] || 'O'}
                                onUploadSuccess={(newImage) => {
                                    const userData = localStorage.getItem('user');
                                    if (userData) {
                                        const parsed = JSON.parse(userData);
                                        parsed.image = newImage;
                                        localStorage.setItem('user', JSON.stringify(parsed));
                                        setUser(parsed);
                                    }
                                }}
                                size="lg"
                            />
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3 px-8 pb-8">
                            <Button onClick={handleNext} className="w-full group">
                                Continue to Details
                                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button variant="ghost" onClick={handleSkipLogo} className="w-full text-muted-foreground">
                                Skip for now
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {step === 'details' && (
                    <Card className="border-none shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold tracking-tight">Business Details</CardTitle>
                            <CardDescription>Tell us more about your organization.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input id="phoneNumber" name="phoneNumber" placeholder="+1 234 567 890" className="pl-9" value={formData.phoneNumber} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input id="whatsappNumber" name="whatsappNumber" placeholder="+1 234 567 890" className="pl-9" value={formData.whatsappNumber} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input id="country" name="country" placeholder="USA" className="pl-9" value={formData.country} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input id="address" name="address" placeholder="123 Business St" className="pl-9" value={formData.address} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">About the Organization</Label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Textarea id="bio" name="bio" placeholder="Briefly describe your organization..." className="pl-9 min-h-[100px]" value={formData.bio} onChange={handleInputChange} />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3 px-8 pb-8">
                            <Button onClick={handleSubmitDetails} className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                                Complete Onboarding
                            </Button>
                            <Button variant="ghost" onClick={handleSkipDetails} className="w-full text-muted-foreground" disabled={loading}>
                                Skip & Go to Dashboard
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {step === 'success' && (
                    <Card className="border-none shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 text-center animate-in zoom-in duration-500">
                        <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="h-10 w-10 text-green-500" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">You're all set!</h2>
                        <p className="text-muted-foreground mb-8">Welcome to your new organization workspace.</p>
                        <div className="flex items-center justify-center text-primary font-medium">
                            <span>Redirecting to dashboard</span>
                            <ArrowRight className="ml-2 h-4 w-4 animate-pulse" />
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
