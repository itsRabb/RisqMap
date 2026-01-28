import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Page Not Found | RisqMap',
    description: 'Sorry, the page you are looking for cannot be found.',
};

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-9xl font-bold text-slate-800 dark:text-slate-900 absolute opacity-20 select-none">404</h1>

            <div className="z-10 relative space-y-6 max-w-lg">
                <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/20">
                    <span className="text-4xl">🌊</span>
                </div>

                <h2 className="text-3xl font-bold text-white font-display">Wrong Current</h2>
                <p className="text-slate-400">
                    Like water that has gone astray, the page you are looking for was not found on our server.
                    It may have receded or changed course.
                </p>

                <div className="pt-6">
                    <Link
                        href="/"
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 px-8 rounded-full transition duration-300 inline-block"
                    >
                        Back to Main Dashboard
                    </Link>
                </div>

                <div className="text-xs font-mono text-slate-600 mt-12">
                    ERROR_CODE: PAGE_NOT_FOUND_EXCEPTION
                </div>
            </div>
        </div>
    );
}