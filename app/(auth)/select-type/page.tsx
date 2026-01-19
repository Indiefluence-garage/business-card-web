'use client';

import Link from 'next/link';
import { User, Building2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function SelectTypePage() {
    return (
        <div className="min-h-[calc(100-3.5rem)] w-full bg-background flex items-center justify-center p-6">
            <div className="w-full max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 tracking-tight">
                        How would you like to use <span className="text-primary">Lukewarm</span>?
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                        Choose the account type that best fits your needs. You can always change your plan later.
                    </p>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Individual Option */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ y: -4 }}
                        className="relative group"
                    >
                        <Link href="/signup" className="block h-full">
                            <div className="relative h-full bg-card border border-border group-hover:border-primary/50 group-hover:shadow-xl transition-all duration-300 rounded-3xl p-8 flex flex-col items-center text-center">
                                <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110 duration-300">
                                    <User className="h-10 w-10" />
                                </div>

                                <h3 className="text-2xl font-bold text-foreground mb-3">Individual Project</h3>
                                <p className="text-muted-foreground mb-8 leading-relaxed">
                                    Digitalize your business cards, organize your network, and sync contacts seamlessly across all your devices.
                                </p>

                                <div className="mt-auto w-full">
                                    <div className="flex items-center justify-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
                                        Select Individual <ArrowRight className="ml-2 h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Organization Option */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ y: -4 }}
                        className="relative group"
                    >
                        <Link href="/register-organization" className="block h-full">
                            <div className="relative h-full bg-card border border-border group-hover:border-primary/50 group-hover:shadow-xl transition-all duration-300 rounded-3xl p-8 flex flex-col items-center text-center">
                                <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110 duration-300">
                                    <Building2 className="h-10 w-10" />
                                </div>

                                <h3 className="text-2xl font-bold text-foreground mb-3">Organization / Team</h3>
                                <p className="text-muted-foreground mb-8 leading-relaxed">
                                    Centrally manage team members, share company contacts, and get advanced insights for your enterprise.
                                </p>

                                <div className="mt-auto w-full">
                                    <div className="flex items-center justify-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
                                        Join as Organization <ArrowRight className="ml-2 h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 text-center"
                >
                    <p className="text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary font-semibold hover:underline underline-offset-4">
                            Log in here
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
