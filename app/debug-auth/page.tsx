'use client';

import { useEffect, useState } from 'react';
import * as authService from '@/lib/services/auth';

export default function DebugAuthPage() {
    const [status, setStatus] = useState('Checking...');
    const [exports, setExports] = useState<string[]>([]);

    useEffect(() => {
        console.log('Auth Service:', authService);
        const keys = Object.keys(authService);
        setExports(keys);

        if (typeof authService.login === 'function') {
            setStatus('✅ login function exists');
        } else {
            setStatus('❌ login function MISSING');
        }
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Debug Auth Service</h1>
            <p className="mb-4 text-xl">{status}</p>
            <div className="bg-gray-100 p-4 rounded">
                <h2 className="font-bold mb-2">Exports found:</h2>
                <ul className="list-disc pl-5">
                    {exports.map(k => (
                        <li key={k}>{k}: {typeof (authService as any)[k]}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
