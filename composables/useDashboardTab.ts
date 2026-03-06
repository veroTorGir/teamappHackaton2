export type DashboardTab = 'home' | 'food' | 'store'

export const useDashboardTab = () => {
  const tab = useState<DashboardTab>('dashboard.tab', () => 'home')
  return { tab }
}
