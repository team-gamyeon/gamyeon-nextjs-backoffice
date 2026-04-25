import { BetaAnalyticsDataClient } from '@google-analytics/data'

const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n')

const client = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: privateKey,
  },
})

const propertyId = process.env.GA_PROPERTY_ID

export async function getFirstUserChannel() {
  const [data] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'firstUserDefaultChannelGroup' }],
    metrics: [{ name: 'totalUsers' }],
  })
  return data.rows?.map((row) => ({
    channel: row.dimensionValues?.[0].value ?? 'unknown',
    totalUsers: Number(row.metricValues?.[0].value ?? 0),
  }))
}

export async function getPagePerformance() {
  const [data] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'activeUsers' },
      { name: 'userEngagementDuration' },
    ],
    orderBys: [
      {
        metric: { metricName: 'screenPageViews' },
        desc: true,
      },
    ],
    limit: 10,
  })
  console.log(
    data.rows?.map((row) => ({
      route: row.dimensionValues?.[0].value,
    })),
  )
  return data.rows?.map((row) => ({
    routePage: row.dimensionValues?.[0].value, // 페이지 경로
    pageViews: Number(row.metricValues?.[0].value), // 조회수
    activeUsers: Number(row.metricValues?.[1].value), // 사용자수
    userDurations: Number(row.metricValues?.[2].value), // 총 시간(초)
  }))
}
