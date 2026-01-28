import Link from 'next/link';

export const metadata = {
    title: 'Data Sources & Technology | RisqMap',
    description: 'Transparency on IoT sensor data sources and the RisqMap API.',
};

export default function DataSourcePage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-bold mb-6 font-display">Data Sources & Technology</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-cyan-500">📡</span> Independent IoT Sensors
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            RisqMap operates a network of independent ultrasonic sensors installed at flood-prone points (Community & Partners).
                            Data is sent every 60 seconds via LoRaWAN/GSM.
                        </p>
                        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm font-mono">
                            Update Frequency: Realtime (&lt; 1 min)
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-cyan-500">☁️</span> USGS & Meteorological Data
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            Macro weather data, earthquake alerts, and satellite imagery are obtained through integration with public sources such as the USGS and Open‑Meteo (no API key required).
                        </p>
                        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm font-mono">
                            Update Frequency: 15-60 min
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="mb-4">Want to contribute data or install a sensor?</p>
                    <Link href="/contact" className="text-cyan-500 font-bold hover:underline">
                        Contact the Technical Team &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}