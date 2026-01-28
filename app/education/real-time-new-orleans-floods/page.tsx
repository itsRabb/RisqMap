import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Real-time Flood Status & Vulnerable Locations | RisqMap',
    description: 'Real-time flood monitoring map. Check upstream gauge status, vulnerable river points, pump conditions, and coastal tidal flood information.',
};

export default function FloodStatusPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <Link href="/education" className="text-cyan-500 hover:text-cyan-400 mb-6 inline-block font-mono text-sm">
                    &larr; BACK TO EDUCATION HUB
                </Link>

                <article className="prose prose-lg dark:prose-invert max-w-none">
                    <h1 className="text-4xl font-bold mb-4 font-display">Real-time Flood Status</h1>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-8 font-mono">
                        <span>Category: Local Insight</span>
                        <span>•</span>
                        <span>Update: Today</span>
                    </div>

                    <p className="lead text-xl text-slate-600 dark:text-slate-300 mb-8">
                        Urban flood risk is driven by upstream rainfall, drainage capacity, and coastal conditions. Identifying vulnerable locations and monitoring upstream gauges is key to early response.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">1. Lake Pontchartrain & Mississippi: The Flood's Lifeline</h2>
                    <p>
                        Major river systems feeding into cities should be monitored at multiple upstream gauges and control structures. Timely data from these points enables predictive alerts for downstream communities.
                        <br />
                        <em>Note: Typical travel times from upstream gauges to downstream urban centers depend on river morphology; modeling and historical data provide lead-time estimates for alerts.</em>
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">2. Vulnerable Points & Routine Flooding</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Lower Ninth Ward:</strong> St. Claude, St. Roch (Low-lying basins, levee concerns).</li>
                        <li><strong>Gentilly:</strong> Gentilly Terrace, Pontchartrain Park (canal overflow concerns).</li>
                        <li><strong>Lakeview:</strong> Areas adjacent to Lake Pontchartrain vulnerable to surge and overtopping.</li>
                        <li><strong>Algiers/West Bank:</strong> Drainage overload and limited outfall capacity in heavy events.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">3. The Role of Pump Houses</h2>
                    <p>
                        Many low-lying areas are protected by levees and pumping stations. Water cannot always flow out naturally; pump stations (e.g., London Avenue, 17th Street) run continuously to move water into Lake Pontchartrain and outfall canals. Pump failure or levee overtopping causes rapid inundation.
                    </p>
                    <div className="my-4">
                        <Link href="/dashboard" className="text-cyan-500 hover:underline font-bold">
                            &rarr; Check Pump Operational Status on the RisqMap Map
                        </Link>
                    </div>

                    <h2 className="text-2xl font-bold mt-8 mb-4">4. Solutions: Infiltration Wells & Naturalization?</h2>
                    <p>
                        Besides giant flood canals, micro solutions like infiltration wells are being promoted. However, the best solution for residents is <strong>Data-Based Vigilance</strong>.
                    </p>
<div className="mt-12 p-6 border border-slate-200 dark:border-slate-800 rounded-lg">
                        <h3 className="text-lg font-bold mb-4">Is Your Home Safe?</h3>
                        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                            Use the flood simulation feature on RisqMap to see the flood radius in your specific area.
                        </p>
                        <Link href="/dashboard" className="w-full block text-center bg-slate-900 dark:bg-slate-800 text-white py-3 rounded font-bold hover:bg-slate-800 transition">
                            Check Flood Radius
                        </Link>
                    </div>
                </article>
            </div>
        </div>
    );
}
