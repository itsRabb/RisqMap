import Link from 'next/link';

export const metadata = {
    title: 'Why Do Coastal Cities Flood? Hydrological Analysis & Solutions | RisqMap Education',
    description: 'Understanding causes of coastal urban flooding from hydrology, land subsidence, and extreme rainfall. Learn how to read early warnings and prepare.',
};

export default function ArticlePage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <Link href="/education" className="text-cyan-500 hover:text-cyan-400 mb-6 inline-block font-mono text-sm">
                    &larr; BACK TO EDUCATION CENTER
                </Link>

                <article className="prose prose-lg dark:prose-invert max-w-none">
                    <h1 className="text-4xl font-bold mb-4 font-display">Why Do Coastal Cities Flood?</h1>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-8 font-mono">
                        <span>By: RisqMap Team</span>
                        <span>•</span>
                        <span>Hydrological Analysis</span>
                    </div>

                    <p className="lead text-xl text-slate-600 dark:text-slate-300 mb-8">
                        Urban coastal flooding is not just a problem of "heavy rain". It is a complex combination of natural topography, land subsidence, aging drainage, and climate-driven extreme rainfall. Let's examine the data and mitigation strategies.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">1. Topography: A Natural Bowl</h2>
                    <p>
                        Many coastal cities have large low-lying areas and rivers that drain from higher ground into dense urban basins. Heavy upstream rainfall increases river discharge into the city; if coastal tide levels are high, outflow is restricted and flooding occurs.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">2. Land Subsidence</h2>
                    <p>
                        Some coastal cities face land subsidence from groundwater extraction and development, reducing natural drainage capacity. Pumps and managed infrastructure are essential; monitoring systems like the Water Pump Monitoring dashboard help detect failures and prevent catastrophic flooding.
                    </p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">3. Extreme Weather & Climate Change</h2>
                    <p>
                        The 5-year rainfall cycle now comes more frequently with higher intensity. The city's drainage, designed for rainfall of 100mm/day, is often overwhelmed by rain of 300mm/day.
                    </p>

                    <div className="bg-slate-100 dark:bg-slate-900 border-l-4 border-cyan-500 p-6 my-8 rounded-r-lg">
                        <h3 className="text-lg font-bold mb-2">The Importance of Early Warning</h3>
                        <p className="mb-4">
                            Because these factors are hard to change quickly, access to timely <strong>information</strong> and early warnings gives valuable time for evacuation and response. Upstream level monitoring can provide multi-hour lead time in many river systems.
                        </p>
                        <Link href="/dashboard" className="inline-block bg-cyan-600 text-white px-4 py-2 rounded font-bold hover:bg-cyan-700 transition">
                            Check the RisqMap Dashboard Now
                        </Link>
                    </div>
<h2 className="text-2xl font-bold mt-8 mb-4">How RisqMap Works</h2>
<p>
RisqMap uses IoT sensors at main water gates and satellite data to predict potential waterlogging. Our AI analyzes rainfall patterns and topography to provide warnings before floods occur.
</p>
</article>
</div>
</div>
    );
}