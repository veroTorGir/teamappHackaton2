/**
 * Global reactive company theme state shared across layout, pages, and components.
 * Set colors after fetching the collaborator data.
 *
 * Usage:
 *   const { primaryColor, secondaryColor, isLightPrimary } = useCompanyTheme()
 *   primaryColor.value = company.primary_color   // to set
 *   // isLightPrimary → true when primary color is bright (e.g. Suno #D0FF41)
 *   //   → use dark text/icons on primary-colored backgrounds
 */
export const useCompanyTheme = () => {
  const primaryColor = useState('company.primaryColor', () => '#753BBD')
  const secondaryColor = useState('company.secondaryColor', () => '#1E1E1E')

  const isLightPrimary = computed(() => isLightColor(primaryColor.value))

  return { primaryColor, secondaryColor, isLightPrimary }
}
