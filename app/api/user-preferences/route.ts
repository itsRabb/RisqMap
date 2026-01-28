import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: cookieStore as any });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single(); // Fetch a single preference entry for this user

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
    console.error('Error fetching user preferences:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || null); // Return null if no preferences exist
}

export async function POST(request: Request) {
  const { default_location, preferences_data } = await request.json();
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: cookieStore as any });
  const { data: { user } = {} } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Try to fetch existing preferences
  const { data: existingPreferences, error: fetchError } = await supabase
    .from('user_preferences')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error checking existing preferences:', fetchError);
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  let result;
  if (existingPreferences) {
    // If exists, update
    result = await supabase
      .from('user_preferences')
      .update({ default_location, preferences_data, updated_at: new Date().toISOString() })
      .eq('id', existingPreferences.id)
      .select()
      .single();
  } else {
    // If not exists, insert new
    result = await supabase
      .from('user_preferences')
      .insert({ user_id: user.id, default_location, preferences_data })
      .select()
      .single();
  }

  if (result.error) {
    console.error('Error saving user preferences:', result.error);
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  return NextResponse.json(result.data);
}