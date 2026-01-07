'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { invitationService, Invitation } from '@/lib/services/invitation.service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/form-elements';
import { Button } from '@/components/ui/button';
import { Building2, UserPlus, X, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function AcceptInvitePage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const token = params.token as string;
    const action = searchParams.get('action');

    const [loading, setLoading] = useState(true);
    const [invitation, setInvitation] = useState<Invitation | null>(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }

        // Check if user is logged in
        const authToken = localStorage.getItem('token');
        if (!authToken) {
            // Not logged in, save invitation token for after signup
            sessionStorage.setItem('pendingInviteToken', token);
            // Redirect to login/signup
            router.push(`/login?redirect=/accept-invite/${token}`);
            return;
        }

        // Auto-decline if action=decline
        if (action === 'decline') {
            handleDecline();
            return;
        }

        fetchInvitation();
    }, [token, action, router]);

    // Auto-accept invitation if user just signed up
    useEffect(() => {
        const checkAutoAccept = async () => {
            // Check if user just came from signup
            const justSignedUp = sessionStorage.getItem('justSignedUp');
            const pendingToken = sessionStorage.getItem('pendingInviteToken');

            console.log('🔍 Auto-accept check:', {
                justSignedUp,
                pendingToken,
                currentToken: token,
                invitationStatus: invitation?.status,
                hasInvitation: !!invitation
            });

            if (justSignedUp === 'true' && pendingToken === token && invitation && invitation.status === 'pending') {
                console.log('✨ Auto-accepting invitation for new user...');

                // Clean up session storage
                sessionStorage.removeItem('justSignedUp');
                sessionStorage.removeItem('pendingInviteToken');

                // Auto-accept the invitation
                await handleAccept();
            } else {
                console.log('⏭️ Skipping auto-accept:', {
                    reason: justSignedUp !== 'true' ? 'not just signed up' :
                        pendingToken !== token ? 'token mismatch' :
                            !invitation ? 'no invitation' :
                                invitation.status !== 'pending' ? 'not pending' : 'unknown'
                });
            }
        };

        if (invitation) {
            checkAutoAccept();
        }
    }, [invitation, token]);

    const fetchInvitation = async () => {
        try {
            setLoading(true);
            const data = await invitationService.getInvitationByToken(token);
            setInvitation(data.invitation);
        } catch (error: any) {
            console.error('Failed to fetch invitation:', error);
            if (error.response?.status === 404) {
                toast.error('Invitation not found');
            } else {
                toast.error('Failed to load invitation');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        if (!invitation) return;

        try {
            setProcessing(true);
            console.log('🔄 Accepting invitation...', token);
            const result = await invitationService.acceptInvitation(token);
            console.log('✅ Invitation accepted successfully:', result);
            toast.success(result.message || 'Successfully joined organization!');

            // Redirect to individual dashboard (not organization dashboard)
            // Individual users should see their organizations in the sidebar
            setTimeout(() => {
                console.log('➡️ Redirecting to individual dashboard...');
                router.push('/dashboard');
            }, 1500);
        } catch (error: any) {
            console.error('❌ Failed to accept invitation:', error);
            const errorMsg = error.response?.data?.error || 'Failed to accept invitation';
            toast.error(errorMsg);
            setProcessing(false);
        }
    };

    const handleDecline = async () => {
        if (!token) return;

        if (!processing && !confirm('Are you sure you want to decline this invitation?')) {
            return;
        }

        try {
            setProcessing(true);
            await invitationService.declineInvitation(token);
            // Refresh to show declined state
            if (invitation) {
                setInvitation({ ...invitation, status: 'declined' });
            }
            toast.info('Invitation declined');
        } catch (error: any) {
            toast.error('Failed to decline invitation');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!invitation) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
                <Card className="max-w-md w-full border-none shadow-2xl">
                    <CardContent className="pt-6 text-center">
                        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Invitation Not Found</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            This invitation link is invalid or has been removed.
                        </p>
                        <Button onClick={() => router.push('/dashboard')}>
                            Go to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const isExpired = new Date(invitation.expiresAt) < new Date();
    const isPending = invitation.status === 'pending' && !isExpired;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-6">
            <Card className="max-w-2xl w-full border-none shadow-2xl bg-white dark:bg-gray-800">
                <CardHeader className="text-center border-b dark:border-gray-700 pb-6">
                    <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {isPending ? 'Join ' : ''}{invitation.organizationName}
                    </CardTitle>
                </CardHeader>

                <CardContent className="pt-6">
                    {/* Pending Status */}
                    {isPending && (
                        <div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                                <div className="flex items-start gap-3">
                                    <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                            You've been invited!
                                        </h3>
                                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                                            {invitation.invitedByName} has invited you to join <strong>{invitation.organizationName}</strong> as a <strong>{invitation.role}</strong>.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Organization</span>
                                    <span className="font-semibold">{invitation.organizationName}</span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Your Role</span>
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                        {invitation.role}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Invited By</span>
                                    <span className="font-semibold">{invitation.invitedByName}</span>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-gray-600 dark:text-gray-400">Expires</span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(invitation.expiresAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    onClick={handleAccept}
                                    disabled={processing}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    size="lg"
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Accepting...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="mr-2 h-5 w-5" />
                                            Accept Invitation
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={handleDecline}
                                    disabled={processing}
                                    variant="outline"
                                    className="flex-1"
                                    size="lg"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Decline
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Expired Status */}
                    {isExpired && invitation.status === 'pending' && (
                        <div className="text-center py-8">
                            <Clock className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Invitation Expired</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                This invitation expired on {new Date(invitation.expiresAt).toLocaleDateString()}.
                                Please contact {invitation.invitedByName} to request a new invitation.
                            </p>
                            <Button variant="outline" onClick={() => router.push('/dashboard')}>
                                Go to Dashboard
                            </Button>
                        </div>
                    )}

                    {/* Accepted Status */}
                    {invitation.status === 'accepted' && (
                        <div className="text-center py-8">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Already Accepted</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                You've already joined this organization.
                            </p>
                            <Button onClick={() => router.push('/organization/dashboard')}>
                                Go to Organization Dashboard
                            </Button>
                        </div>
                    )}

                    {/* Declined Status */}
                    {invitation.status === 'declined' && (
                        <div className="text-center py-8">
                            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">Invitation Declined</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                You declined this invitation.
                            </p>
                            <Button variant="outline" onClick={() => router.push('/dashboard')}>
                                Go to Dashboard
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
