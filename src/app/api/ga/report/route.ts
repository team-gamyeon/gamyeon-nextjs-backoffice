import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { NextResponse } from 'next/server'

const client = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
})

const propertyId = process.env.GA_PROPERTY_ID

export async function GET() {
  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }, { name: 'eventCount' }],
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('GA4 API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch GA4 data' }, { status: 500 })
  }
}
