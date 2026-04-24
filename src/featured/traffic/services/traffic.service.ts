import { serverApi } from '@/shared/lib/api'

export async function getGa4Traffic() {
  try{
    return await serverApi.get('/api/traffic')
  }catch (error) {
    return null
  }
}