import Link from 'next/link';

export const metadata = {
    title: 'Flood & Hydrology Education Hub | RisqMap',
    description: 'Complete articles and guides on flood disaster mitigation, hydrology, and how to read weather sensor data.',
};

export default function EducationHubPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
            <div className="container mx-auto px-4">
                <header className="mb-12 text-center max-w-3xl mx-auto">
                    <div className="text-cyan-500 font-mono tracking-widest text-sm mb-4">KNOWLEDGE BASE</div>
                    <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">Edu-Center</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Understanding the science behind disasters to enhance our preparedness.
                        Data without understanding is just numbers.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Article Card 1: Analysis */}
                    <Link href="/education/why-is-new-orleans-flooding" className="group">
                        <article className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition border border-slate-200 dark:border-slate-800 h-full flex flex-col">
                            <div className="h-48 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                    <span className="text-white font-mono text-xs bg-cyan-600 px-2 py-1 rounded">ANALYSIS</span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-500 transition">Why Do Coastal Cities Flood?</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-1">
                                    A comprehensive breakdown of the topography factors, land subsidence, and extreme weather that make the capital vulnerable.
                                </p>
                                <div className="flex items-center text-xs text-slate-500 font-mono mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <span>5 MIN READ</span>
                                </div>
                            </div>
                        </article>
                    </Link>
{/* Article Card 2: Mitigation */}
                    <Link href="/education/flood-preparation-guide" className="group">
                        <article className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition border border-slate-200 dark:border-slate-800 h-full flex flex-col">
                            <div className="h-48 bg-yellow-100 dark:bg-yellow-900/20 relative overflow-hidden flex items-center justify-center">
                                <span className="text-6xl">🎒</span>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                    <span className="text-white font-mono text-xs bg-yellow-600 px-2 py-1 rounded">SAFETY</span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-500 transition">Readiness & Mitigation Guide</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-1">
                                    Family evacuation checklist, essential preparedness items, and critical steps when the siren sounds.
                                </p>
                                <div className="flex items-center text-xs text-slate-500 font-mono mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <span>7 MIN READ</span>
                                </div>
                            </div>
                        </article>
                    </Link>

                    {/* Article Card 3: Technology */}
                    <Link href="/education/technology" className="group">
                        <article className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition border border-slate-200 dark:border-slate-800 h-full flex flex-col">
                            <div className="h-48 bg-blue-100 dark:bg-blue-900/20 relative overflow-hidden flex items-center justify-center">
                                <span className="text-6xl">📡</span>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                    <span className="text-white font-mono text-xs bg-blue-600 px-2 py-1 rounded">TECH</span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-500 transition">Technology & How to Read Data</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-1">
                                    Understanding IoT sensors, satellites, and how to read sluice gate status on the RisqMap dashboard.
                                </p>
                                <div className="flex items-center text-xs text-slate-500 font-mono mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <span>6 MIN READ</span>
                                </div>
                            </div>
                        </article>
                    </Link>
{/* Article Card 4: Real-time flood status */}
                    <Link href="/education/real-time-new-orleans-floods" className="group">
                        <article className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition border border-slate-200 dark:border-slate-800 h-full flex flex-col">
                            <div className="h-48 bg-red-100 dark:bg-red-900/20 relative overflow-hidden flex items-center justify-center">
                                <span className="text-6xl">🏙️</span>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                    <span className="text-white font-mono text-xs bg-red-600 px-2 py-1 rounded">LOCAL</span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-500 transition">Real-time Flood Status</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-1">
                                    River vulnerable points, pump station conditions, and real-time coastal tidal flood information for urban areas.
                                </p>
                                <div className="flex items-center text-xs text-slate-500 font-mono mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <span>5 MIN READ</span>
                                </div>
                            </div>
                        </article>
                    </Link>
                </div>
            </div>
        </div>
    );
}