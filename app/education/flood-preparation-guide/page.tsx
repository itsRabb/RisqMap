import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Flood Preparedness & Mitigation Guide: Evacuation, Checklist, & Tips | RisqMap',
    description: 'Complete flood preparedness guide. Family evacuation checklist, how to save documents, difference between flood vs. tidal inundation, and disaster mitigation steps.',
};

export default function MitigationPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <Link href="/education" className="text-cyan-500 hover:text-cyan-400 mb-6 inline-block font-mono text-sm">
                    &larr; BACK TO EDUCATION CENTER
                </Link>

                <article className="prose prose-lg dark:prose-invert max-w-none">
                    <h1 className="text-4xl font-bold mb-4 font-display">Flood Preparedness & Mitigation Guide</h1>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-8 font-mono">
                        <span>Category: Safety</span>
                        <span>•</span>
                        <span>Read Time: 7 Minutes</span>
                    </div>

                    <p className="lead text-xl text-slate-600 dark:text-slate-300 mb-8">
                        Floods often come suddenly. Your preparedness in the first 10 minutes can save lives and property. This is the RisqMap version of a survival guide.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">1. What to Do BEFORE a Flood?</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Prepare a "Disaster Preparedness Bag" (Go-Bag):</strong> Contains important documents (wrapped in plastic), flashlight, spare batteries, first aid kit, dry food, and drinking water.</li>
                        <li><strong>Know Evacuation Routes:</strong> Determine a family gathering point if separated.</li>
                        <li><strong>Monitor the RisqMap App:</strong> Enable notifications to get early warnings 1-3 hours before water arrives.</li>
                    </ul>

                    <h2 className="text-2xl font-bold mt-8 mb-4">2. "3-Minute Evacuation" Checklist</h2>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-6 my-4">
                        <p className="font-bold">When the siren sounds or Status Alert 1 is issued:</p>
                        <ol className="list-decimal pl-6 mt-2 space-y-2">
                            <li>Turn off the main electrical circuit breaker (Most Critical!).</li>
                            <li>Secure important documents to a high place/2nd floor.</li>
                            <li>Close drain/toilet holes to prevent backflow.</li>
                            <li>Lock the house and immediately head to the evacuation point.</li>
                        </ol>
                    </div>

                    <h2 className="text-2xl font-bold mt-8 mb-4">3. Understanding Flood Types</h2>
                    <h3 className="text-xl font-bold mt-4 mb-2">Downstream Flood vs. Local Flood</h3>
                    <p>
                        <strong>Downstream Flood:</strong> Occurs when heavy rain in upstream catchments increases river discharge that travels downstream into urban basins. Lead times vary by watershed but can offer hours of warning.
                        <br />
                        <strong>Local Flood:</strong> Caused by intense local rainfall combined with poor drainage; water can rise rapidly within minutes.
                    </p>

                    <h3 className="text-xl font-bold mt-4 mb-2">Tidal Inundation (Coastal Flooding)</h3>
                    <p>
                        Coastal flooding from tides and storm surge can inundate low-lying shoreline areas. This type of flooding is driven by coastal sea-level conditions rather than local rainfall.
                    </p>
<h2 className="text-2xl font-bold mt-8 mb-4">4. After the Flood</h2>
                    <p>
                        Do not turn on the electricity immediately. Check the cable installations. Clean the mud as quickly as possible before it hardens. Beware of skin diseases (athlete's foot) and Leptospirosis.
                    </p>

                    <div className="mt-12 p-6 bg-cyan-50 dark:bg-cyan-950/30 rounded-lg text-center">
                        <h3 className="text-lg font-bold mb-2">Check Disaster Alert Status Now</h3>
                        <p className="mb-4">Don't wait for the water to enter your house.</p>
                        <Link href="/dashboard" className="inline-block bg-cyan-600 text-white px-6 py-2 rounded-full font-bold hover:bg-cyan-700 transition">
                            Open Realtime Dashboard
                        </Link>
                    </div>
                </article>
            </div>
        </div>
    );
}