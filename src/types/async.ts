export type Status = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  data: T | null
  status: Status
  error: string | null
}

export function initAsync<T>(): AsyncState<T> {
  return { data: null, status: 'idle', error: null }
}
