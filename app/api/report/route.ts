import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { FloodReportSchema } from '@/lib/schemas';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('flood_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: `Internal server error: ${(error as Error).message}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = FloodReportSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { errors: validationResult.error.issues, message: 'Invalid input data.' },
        { status: 400 }
      );
    }

    const { error: insertError } = await supabaseAdmin
      .from('flood_reports')
      .insert([validationResult.data]);

    if (insertError) {
      console.error('Error inserting report:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Report successfully received.' }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: `Internal server error: ${(error as Error).message}` }, { status: 500 });
  }
}