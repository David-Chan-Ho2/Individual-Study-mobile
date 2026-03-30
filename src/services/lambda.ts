import { HvacPayload } from "@/types/hvac.types"
import axios from 'axios'

export type LambdaResponse = {
  items: HvacPayload[]
  count: number
}

const API_URL = "https://oyhd0jydrg.execute-api.us-east-2.amazonaws.com/data"

export async function fetchLambdaData(): Promise<LambdaResponse> {
  const response = await axios.get(API_URL)
  return response.data
}