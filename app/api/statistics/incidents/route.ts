import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('[API] Attempting to fetch historical incidents...');
  try {
    const supabase = createClient();
    
    // Query historical_events table directly (1.4M real records)
    const { data: events, error } = await supabase
      .from('historical_events')
      .select('*')
      .order('BEGIN_DATE_TIME', { ascending: false })
      .limit(5000); // Get recent 5000 events for performance

    if (error) {
      console.error('[API] Supabase error:', error);
      throw new Error(error.message);
    }

    // Transform historical_events to match expected HistoricalIncident format
    const transformedData = events?.map((event: any) => {
      // Parse damage values (handles "1.00K", "5.00M", null, etc.)
      const parseDamage = (damageStr: string | null): number => {
        if (!damageStr) return 0;
        const cleaned = damageStr.replace(/[^0-9.KM]/gi, '');
        const value = parseFloat(cleaned);
        if (isNaN(value)) return 0;
        if (damageStr.includes('M')) return value * 1000000;
        if (damageStr.includes('K')) return value * 1000;
        return value;
      };

      const propertyDamage = parseDamage(event.DAMAGE_PROPERTY);
      const cropDamage = parseDamage(event.DAMAGE_CROPS);
      const totalDamage = propertyDamage + cropDamage;

      // Calculate severity from event type
      const eventType = (event.EVENT_TYPE || '').toLowerCase();
      let severity = 5; // default
      if (eventType.includes('tornado') || eventType.includes('hurricane')) severity = 9;
      else if (eventType.includes('flood') || eventType.includes('earthquake')) severity = 8;
      else if (eventType.includes('thunderstorm') || eventType.includes('wind') || eventType.includes('hail')) severity = 6;

      return {
        id: event.id,
        type: event.EVENT_TYPE || 'Other',
        location: `${event.STATE || ''}${event.CZ_NAME ? ', ' + event.CZ_NAME : ''}`,
        date: event.BEGIN_DATE_TIME,
        description: event.EPISODE_NARRATIVE || `${event.EVENT_TYPE} event in ${event.CZ_NAME || event.STATE}`,
        severity,
        casualties: parseInt(event.DEATHS_DIRECT || '0') + parseInt(event.DEATHS_INDIRECT || '0'),
        evacuees: 0, // Not available in historical_events
        reported_losses: totalDamage > 0 ? totalDamage : null,
        damage_level: totalDamage > 0 ? `$${(totalDamage / 1000000).toFixed(2)}M` : 'Unknown',
        impact_areas: event.CZ_NAME ? [event.CZ_NAME] : [],
        status: 'resolved',
      };
    }) || [];

    console.log(`[API] Successfully fetched and transformed ${transformedData.length} incidents.`);

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('[API] Catch block error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch historical incidents' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}