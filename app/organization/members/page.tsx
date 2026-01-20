'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as invitationService from '@/lib/services/invitation';
import { Member, Invitation } from '@/lib/services/invitation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/form-elements';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/form-elements';
import { Users, Mail, Send, RefreshCw, Trash2, UserPlus, Shield, User as UserIcon, X } from 'lucide-react';
import { toast } from 'sonner';

export default function MembersPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [joinedMembers, setJoinedMembers] = useState<Member[]>([]);
    const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>([]);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'member' | 'admin'>('member');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        fetchMembers();
    }, [router]);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const data = await invitationService.getMembers();
            setJoinedMembers(data.members.joined);
            setPendingInvitations(data.members.pending);
        } catch (error: any) {
            console.error('Failed to fetch members:', error);
            toast.error('Failed to load members');
        } finally {
            setLoading(false);
        }
    };

    const handleSendInvitation = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error('Please enter an email address');
            return;
        }

        try {
            setSending(true);
            await invitationService.sendInvitation(email, role);
            toast.success('Invitation sent successfully!');
            setEmail('');
            setRole('member');
            fetchMembers(); // Refresh the list
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || 'Failed to send invitation';
            toast.error(errorMsg);
        } finally {
            setSending(false);
        }
    };

    const handleResend = async (invitationId: string) => {
        try {
            await invitationService.resendInvitation(invitationId);
            toast.success('Invitation resent successfully!');
            fetchMembers();
        } catch (error: any) {
            toast.error('Failed to resend invitation');
        }
    };

    const handleCancel = async (invitationId: string) => {
        if (!confirm('Are you sure you want to cancel this invitation?')) {
            return;
        }

        try {
            await invitationService.cancelInvitation(invitationId);
            toast.success('Invitation cancelled');
            fetchMembers();
        } catch (error: any) {
            toast.error('Failed to cancel invitation');
        }
    };

    const handleRemoveMember = async (memberId: string, memberName: string) => {
        if (!confirm(`Are you sure you want to remove ${memberName} from the organization?`)) {
            return;
        }

        try {
            await invitationService.removeMember(memberId);
            toast.success('Member removed successfully');
            fetchMembers(); // Refresh the list
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || 'Failed to remove member';
            toast.error(errorMsg);
        }
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const isExpired = (expiresAt: Date | string) => {
        return new Date(expiresAt) < new Date();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Team Members
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your organization members and invitations</p>
                </div>

                {/* Invite Form */}
                <Card className="mb-8 border-none shadow-xl bg-white dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-primary" />
                            Invite New Member
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSendInvitation} className="flex flex-col gap-4 md:flex-row md:items-end">
                            <div className="flex-1">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative mt-1">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="member@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="w-full md:w-48">
                                <Label htmlFor="role">Role</Label>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as 'member' | 'admin')}
                                    className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="member">Member</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <Button type="submit" disabled={sending} className="w-full md:w-auto">
                                {sending ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Send Invitation
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Joined Members */}
                <Card className="mb-8 border-none shadow-xl bg-white dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-green-600" />
                            Joined Members ({joinedMembers.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {joinedMembers.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No members yet</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b dark:border-gray-700">
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Member</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Email</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Role</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Joined</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {joinedMembers.map((member) => (
                                            <tr key={member.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        {member.image ? (
                                                            <img src={member.image} alt={member.name} className="w-10 h-10 rounded-full" />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                                                {member.name?.charAt(0)?.toUpperCase() || 'M'}
                                                            </div>
                                                        )}
                                                        <span className="font-medium">{member.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{member.email}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${member.role === 'owner' || member.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                        }`}>
                                                        {member.role === 'admin' || member.role === 'owner' ? (
                                                            <Shield className="h-3 w-3" />
                                                        ) : (
                                                            <UserIcon className="h-3 w-3" />
                                                        )}
                                                        {member.role}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{formatDate(member.joinedAt)}</td>
                                                <td className="py-3 px-4">
                                                    {member.role !== 'owner' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleRemoveMember(member.id, member.name)}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pending Invitations */}
                <Card className="border-none shadow-xl bg-white dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-orange-600" />
                            Pending Invitations ({pendingInvitations.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pendingInvitations.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No pending invitations</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b dark:border-gray-700">
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Email</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Role</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Invited By</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Expires</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                                            <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingInvitations.map((inv) => {
                                            const expired = isExpired(inv.expiresAt);
                                            return (
                                                <tr key={inv.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                                    <td className="py-3 px-4 font-medium">{inv.email}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${inv.role === 'admin'
                                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                            }`}>
                                                            {inv.role === 'admin' ? <Shield className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                                                            {inv.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{inv.invitedByName}</td>
                                                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{formatDate(inv.expiresAt)}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${expired
                                                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                            }`}>
                                                            {expired ? 'Expired' : 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleResend(inv.id)}
                                                                disabled={expired}
                                                            >
                                                                <RefreshCw className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleCancel(inv.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-600" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
