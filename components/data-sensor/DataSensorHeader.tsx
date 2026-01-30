'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DataSensorHeader() {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors duration-200">
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sensor Data & Monitoring</h1>
            </div>
        </div>
    );
}
