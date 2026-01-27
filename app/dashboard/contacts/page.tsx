'use client';

import { useEffect, useState } from 'react';
import { contactService, Contact } from '@/lib/services/contact.service';
import {
    Search, User, Mail, Phone, Building, Loader2, MoreVertical,
    Trash2, Edit3, Share2, X, ExternalLink
} from 'lucide-react';
import { Input } from '@/components/ui/form-elements';
import { Button } from '@/components/ui/button';

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchContacts = async () => {
        try {
            setError(null);
            const response = await contactService.getContacts(1, 100);
            setContacts(response.data || []);
        } catch (err: any) {
            console.error('Failed to fetch contacts:', err);
            setError(err.response?.data?.error || err.message || 'Failed to fetch contacts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            setDeleting(true);
            await contactService.deleteContact(id);
            setContacts(contacts.filter(c => c.id !== id));
            setShowDeleteConfirm(null);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to delete contact');
        } finally {
            setDeleting(false);
        }
    };

    const handleShare = (contact: Contact) => {
        const text = `${contact.name}${contact.email ? `\nEmail: ${contact.email}` : ''}${contact.phone ? `\nPhone: ${contact.phone}` : ''}${contact.company ? `\nCompany: ${contact.company}` : ''}`;

        if (navigator.share) {
            navigator.share({
                title: contact.name,
                text: text,
            });
        } else {
            navigator.clipboard.writeText(text);
            alert('Contact info copied to clipboard!');
        }
    };

    const filteredContacts = contacts.filter((contact) =>
        contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen gradient-bg-subtle p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Contacts</h1>
                        <p className="text-muted-foreground mt-1">
                            {contacts.length > 0 ? `${contacts.length} contacts` : 'Manage your professional network'}
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search contacts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 input-focus"
                        />
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6 text-destructive flex items-center justify-between">
                        <span>{error}</span>
                        <button onClick={() => setError(null)}>
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Loading contacts...</p>
                        </div>
                    </div>
                ) : filteredContacts.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredContacts.map((contact) => (
                            <div
                                key={contact.id}
                                className="bg-card border border-border rounded-xl overflow-hidden card-hover group"
                            >
                                {/* Card Image */}
                                {contact.cardImageUrls && contact.cardImageUrls.length > 0 && (
                                    <div className="h-32 bg-muted overflow-hidden">
                                        <img
                                            src={contact.cardImageUrls[0]}
                                            alt="Business Card"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className="p-5">
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        {contact.displayPictureUrl ? (
                                            <img
                                                src={contact.displayPictureUrl}
                                                alt={contact.name}
                                                className="h-12 w-12 rounded-full object-cover ring-2 ring-border flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-base font-semibold text-primary ring-2 ring-border flex-shrink-0">
                                                {contact.name?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                        )}

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-foreground truncate">{contact.name}</h3>
                                            {contact.jobTitle && (
                                                <p className="text-sm text-muted-foreground truncate">{contact.jobTitle}</p>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleShare(contact)}
                                                className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                                title="Share"
                                            >
                                                <Share2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(contact.id)}
                                                className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="mt-4 space-y-2">
                                        {contact.company && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Building className="h-4 w-4 flex-shrink-0" />
                                                <span className="truncate">{contact.company}</span>
                                            </div>
                                        )}
                                        {contact.email && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Mail className="h-4 w-4 flex-shrink-0" />
                                                <a href={`mailto:${contact.email}`} className="truncate hover:text-primary transition-colors">
                                                    {contact.email}
                                                </a>
                                            </div>
                                        )}
                                        {contact.phone && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Phone className="h-4 w-4 flex-shrink-0" />
                                                <a href={`tel:${contact.phone}`} className="truncate hover:text-primary transition-colors">
                                                    {contact.phone}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                            <User className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">No contacts found</h3>
                        <p className="text-muted-foreground max-w-md">
                            {searchQuery
                                ? `No contacts match "${searchQuery}"`
                                : 'You haven\'t added any contacts yet. Scan a business card from the mobile app to get started!'}
                        </p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background border border-border rounded-xl p-6 max-w-sm w-full shadow-xl">
                        <h3 className="text-lg font-semibold mb-2">Delete Contact?</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            This action cannot be undone. The contact will be permanently removed.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteConfirm(null)}
                                disabled={deleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => handleDelete(showDeleteConfirm)}
                                disabled={deleting}
                            >
                                {deleting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
