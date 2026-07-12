import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export const THEMES = {
  indigo: {
    name: 'Indigo',
    colors: {
      50: '240 244 255', 100: '224 233 255', 200: '199 214 254', 300: '165 184 252',
      400: '129 140 248', 500: '99 102 241', 600: '79 70 229', 700: '67 56 202',
      800: '55 48 163', 900: '49 46 129', 950: '30 27 75',
    }
  },
  emerald: {
    name: 'Emerald',
    colors: {
      50: '236 253 245', 100: '209 250 229', 200: '167 243 208', 300: '110 231 183',
      400: '52 211 153', 500: '16 185 129', 600: '5 150 105', 700: '4 120 87',
      800: '6 95 70', 900: '6 78 59', 950: '2 44 34',
    }
  },
  rose: {
    name: 'Rose',
    colors: {
      50: '255 241 242', 100: '255 228 230', 200: '254 205 211', 300: '253 164 175',
      400: '251 113 133', 500: '244 63 94', 600: '225 29 72', 700: '190 18 60',
      800: '159 18 57', 900: '136 19 55', 950: '76 5 25',
    }
  },
  violet: {
    name: 'Violet',
    colors: {
      50: '245 243 255', 100: '237 233 254', 200: '221 214 254', 300: '196 181 253',
      400: '167 139 250', 500: '139 92 246', 600: '124 58 237', 700: '109 40 217',
      800: '91 33 182', 900: '76 29 149', 950: '46 16 101',
    }
  },
  sky: {
    name: 'Sky',
    colors: {
      50: '240 249 255', 100: '224 242 254', 200: '186 230 253', 300: '125 211 252',
      400: '56 189 248', 500: '14 165 233', 600: '2 132 199', 700: '3 105 161',
      800: '7 89 133', 900: '12 74 110', 950: '8 47 73',
    }
  }
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('apiflow-theme')
    return saved ? saved === 'dark' : true
  })

  const [colorTheme, setColorTheme] = useState(() => {
    const saved = localStorage.getItem('apiflow-color')
    return THEMES[saved] ? saved : 'indigo'
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('apiflow-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    const root = document.documentElement
    const themeColors = THEMES[colorTheme].colors
    
    Object.entries(themeColors).forEach(([shade, hex]) => {
      root.style.setProperty(`--color-primary-${shade}`, hex)
    })
    
    localStorage.setItem('apiflow-color', colorTheme)
  }, [colorTheme])

  const toggleTheme = () => setIsDark(prev => !prev)

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colorTheme, setColorTheme, THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
