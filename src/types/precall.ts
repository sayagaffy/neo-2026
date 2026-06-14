export type PrecallStatus = 'not-tested' | 'running' | 'ok' | 'failed'

export interface PrecallTest {
  id: 'camera' | 'microphone' | 'speaker' | 'network'
  label: string
  status: PrecallStatus
}
