import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Flood Technology & How to Read Flood Data: IoT, Sensors, & BPBD | RisqMap',
    description: 'Understanding how IoT water level sensors work, the differences between RisqMap and official data sources, and how to read flood alert level charts.',
};

export default function TechnologyPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <Link href="/education" className="text-cyan-500 hover:text-cyan-400 mb-6 inline-block font-mono text-sm">
                    &larr; BACK TO EDUCATION CENTER
                </Link>

                <article className="prose prose-lg dark:prose-invert max-w-none">
                    <h1 className="text-4xl font-bold mb-4 font-display">Flood Technology & How to Read Data</h1>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-8 font-mono">
                        <span>Category: Tech</span>
                        <span>•</span>
                        <span>Reading Time: 6 Minutes</span>
                    </div>

                    <p className="lead text-xl text-slate-600 dark:text-slate-300 mb-8">
                        Data is not just numbers. At RisqMap, data is translated into safety signals. Let's dissect the technology behind modern flood early warning.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">1. How Do IoT Sensors Work?</h2>
                    <p>
                        RisqMap uses ultrasonic sensors installed under bridges or sluice gates. These sensors fire sound waves at the water surface and measure the reflection time.
                        <br />
                        <strong>Advantage:</strong> Does not touch the water (non-contact), so it's safe from floating debris. Data is sent every 60 seconds (Realtime) via LoRaWAN or cellular networks.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">2. How to Read Sluice Gate Status</h2>
                    <p>Sluice gates have 4 standard alert statuses:</p>
                    <ul className="list-none space-y-3 pl-0">
                        <li className="flex items-center gap-4">
                            <span className="w-4 h-4 rounded-full bg-green-500 block"></span>
                            <span><strong>Normal (Alert 4):</strong> Safe. No flood potential.</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <span className="w-4 h-4 rounded-full bg-yellow-400 block"></span>
                            <span><strong>Caution (Alert 3):</strong> Water is starting to rise, residents should be aware.</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <span className="w-4 h-4 rounded-full bg-orange-500 block"></span>
                            <span><strong>Critical (Alert 2):</strong> Prepare for evacuation. Waterlogging may begin to occur.</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <span className="w-4 h-4 rounded-full bg-red-600 block shadow-lg shadow-red-500/50 animate-pulse"></span>
                            <span><strong>Disaster (Alert 1):</strong> Major flood is certain within minutes/hours. <strong>EVACUATE NOW.</strong></span>
                        </li>
                    </ul>
<h2 className="text-2xl font-bold mt-8 mb-4">3. Official Data vs Crowdsourced Data</h2>
                    <p>
                        <strong>Official (Government):</strong> Often accurate but periodic. <br />
                        <strong>Crowdsourced & IoT:</strong> Real-time, high-frequency data that complements official feeds.
                    </p>

                    <div className="bg-slate-900 text-white p-6 rounded-lg my-8 font-mono text-sm border border-slate-700">
                        <div>&gt;&gt; SYSTEM_STATUS: ONLINE</div>
                        <div className="text-green-400">&gt;&gt; SENSORS_ACTIVE: 98%</div>
                        <div className="text-cyan-400">&gt;&gt; PREDICTION_MODEL: RUNNING</div>
                    </div>
                </article>
            </div>
        </div>
    );
}
