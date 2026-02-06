/**
 * Paletas de cores baseadas nas modalidades da Polícia Militar de São Paulo
 */

export const THEMES = {
  ostensiva: {
    id: 'ostensiva',
    name: 'Polícia Ostensiva',
    description: 'Policiamento ostensivo e preservação da ordem pública',
    colors: {
      primary: '#dc2626',      // Vermelho
      primaryHover: '#b91c1c',
      primaryLight: '#fee2e2',
      secondary: '#4b5563',    // Cinza escuro
      secondaryHover: '#374151',
      accent: '#1f2937',       // Preto suave
      accentLight: '#f3f4f6',
    }
  },
  rodoviaria: {
    id: 'rodoviaria',
    name: 'Polícia Rodoviária',
    description: 'Policiamento das rodovias estaduais',
    colors: {
      primary: '#eab308',      // Amarelo
      primaryHover: '#ca8a04',
      primaryLight: '#fef9c3',
      secondary: '#52525b',    // Cinza médio
      secondaryHover: '#3f3f46',
      accent: '#18181b',       // Preto
      accentLight: '#fafafa',
    }
  },
  ambiental: {
    id: 'ambiental',
    name: 'Polícia Ambiental',
    description: 'Proteção ao meio ambiente e fauna',
    colors: {
      primary: '#16a34a',      // Verde
      primaryHover: '#15803d',
      primaryLight: '#dcfce7',
      secondary: '#57534e',    // Cinza marrom
      secondaryHover: '#44403c',
      accent: '#1c1917',       // Preto marrom
      accentLight: '#fafaf9',
    }
  },
  bombeiros: {
    id: 'bombeiros',
    name: 'Corpo de Bombeiros',
    description: 'Prevenção e combate a incêndios',
    colors: {
      primary: '#dc2626',      // Vermelho
      primaryHover: '#b91c1c',
      primaryLight: '#fee2e2',
      secondary: '#ea580c',    // Laranja escuro
      secondaryHover: '#c2410c',
      accent: '#7c2d12',       // Marrom escuro
      accentLight: '#ffedd5',
    }
  },
  transito: {
    id: 'transito',
    name: 'Polícia de Trânsito',
    description: 'Fiscalização e educação no trânsito',
    colors: {
      primary: '#0284c7',      // Azul
      primaryHover: '#0369a1',
      primaryLight: '#e0f2fe',
      secondary: '#64748b',    // Cinza azulado
      secondaryHover: '#475569',
      accent: '#1e293b',       // Azul escuro
      accentLight: '#f8fafc',
    }
  },
  civil: {
    id: 'civil',
    name: 'Polícia Civil',
    description: 'Investigação e apuração de infrações penais',
    colors: {
      primary: '#1e40af',      // Azul escuro
      primaryHover: '#1e3a8a',
      primaryLight: '#dbeafe',
      secondary: '#475569',    // Cinza
      secondaryHover: '#334155',
      accent: '#0f172a',       // Azul muito escuro
      accentLight: '#f1f5f9',
    }
  },
  cientifica: {
    id: 'cientifica',
    name: 'Polícia Científica',
    description: 'Perícia criminal e identificação',
    colors: {
      primary: '#7c3aed',      // Roxo
      primaryHover: '#6d28d9',
      primaryLight: '#f5f3ff',
      secondary: '#6b7280',    // Cinza neutro
      secondaryHover: '#4b5563',
      accent: '#111827',       // Preto suave
      accentLight: '#f9fafb',
    }
  },
  ferroviaria: {
    id: 'ferroviaria',
    name: 'Polícia Ferroviária',
    description: 'Segurança no sistema ferroviário',
    colors: {
      primary: '#0891b2',      // Ciano
      primaryHover: '#0e7490',
      primaryLight: '#cffafe',
      secondary: '#71717a',    // Cinza neutro
      secondaryHover: '#52525b',
      accent: '#27272a',       // Cinza muito escuro
      accentLight: '#fafafa',
    }
  },
}

export const getTheme = (themeId) => {
  return THEMES[themeId] || THEMES.ostensiva
}

export const getThemesList = () => {
  return Object.values(THEMES)
}
