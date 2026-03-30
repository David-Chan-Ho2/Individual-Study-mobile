import { useCallback, useEffect, useState } from 'react'

import { fetchLambdaData, type LambdaResponse } from '@/services/lambda'

type State = {
  data: LambdaResponse | null
  loading: boolean
  error: string | null
}

export function useLambdaData() {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null })

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await fetchLambdaData()
      setState({ data, loading: false, error: null })
    } catch (err) {
      setState({ data: null, loading: false, error: (err as Error).message })
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { ...state, refetch: load }
}
