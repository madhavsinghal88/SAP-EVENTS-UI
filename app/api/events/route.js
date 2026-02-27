import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data/events.json');

export async function GET() {
  try {
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { id, status } = await request.json();
    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

    const updatedData = data.map(event =>
      event.id === id ? { ...event, status } : event
    );

    fs.writeFileSync(DATA_PATH, JSON.stringify(updatedData, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}

// Simulated refresh function
export async function PATCH() {
  // In a real app, this would be a cron job or triggered by a webhook
  // Here we just simulate adding a "new" event or updating dates
  try {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    // In a real scraper, you would add new events found on the site here
    return NextResponse.json({ message: 'Sync complete', count: data.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to refresh data' }, { status: 500 });
  }
}
