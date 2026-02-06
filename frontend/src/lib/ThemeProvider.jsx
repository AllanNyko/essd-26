import { createContext, useContext, useEffect, useState } from 'react'
import { getTheme, THEMES } from './themes'

const ThemeContext = createContext({
  currentTheme: THEMES.ostensiva,
  setTheme: () => {},
})

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children, initialThemeId = 'ostensiva' }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const theme = getTheme(initialThemeId)
    console.log('🎨 ThemeProvider inicializado com tema:', initialThemeId, theme)
    return theme
  })

  const setTheme = (themeId) => {
    const theme = getTheme(themeId)
    console.log('🎨 Mudando tema para:', themeId, theme)
    setCurrentTheme(theme)
  }

  // Aplica as CSS variables no documento
  useEffect(() => {
    const root = document.documentElement
    const { colors } = currentTheme

    console.log('🎨 Aplicando cores do tema:', currentTheme.name, colors)

    root.style.setProperty('--color-primary', colors.primary)
    root.style.setProperty('--color-primary-hover', colors.primaryHover)
    root.style.setProperty('--color-primary-light', colors.primaryLight)
    root.style.setProperty('--color-secondary', colors.secondary)
    root.style.setProperty('--color-secondary-hover', colors.secondaryHover)
    root.style.setProperty('--color-accent', colors.accent)
    root.style.setProperty('--color-accent-light', colors.accentLight)
    
    // Adiciona as cores do tema no body para uso em data attributes
    document.body.setAttribute('data-theme', currentTheme.id)
    
    console.log('✅ CSS Variables aplicadas no :root')
  }, [currentTheme])

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
