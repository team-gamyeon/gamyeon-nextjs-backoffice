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
    const [data] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }, { name: 'eventCount' }],
    })

    return NextResponse.json({success:true,data})
  } catch (error) {
    console.error('GA4 API Error:', error)
    const err = error as { status?: number; message?: string; code?: string }
    return NextResponse.json({ success:false,code:err.code??'ERROR',message:err.message??'ga4 조회 실패'}, { status: 500 })
  }
}
