export const metadata = {
    title: 'Privacy Policy | RisqMap',
    description: 'RisqMap privacy policy regarding location data and cookie usage.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-3xl prose dark:prose-invert">
                <h1>Privacy Policy</h1>
                <p>Last updated: {new Date().toLocaleDateString('en-US')}</p>

                <h2>1. Location Data Collection</h2>
                <p>
                    RisqMap uses your location data (GPS) solely to display flood warnings around you.
                    This data is anonymous and is not permanently stored on our servers.
                </p>

                <h2>2. Sensor & IoT Data</h2>
                <p>
                    The water level and rainfall data we display comes from public sensors and our partners.
                    We strive to maintain accuracy but are not responsible for decisions made based on this data.
                </p>

                <h2>3. Contact</h2>
                <p>
                    For privacy-related questions, please contact <a href="mailto:privacy@risqmap.com">privacy@risqmap.com</a>.
                </p>
            </div>
        </div>
    );
}