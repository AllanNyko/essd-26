import { useTheme } from '../../lib/ThemeProvider'
import { getThemesList } from '../../lib/themes'
import './TestTheme.css'

const TestTheme = () => {
  const { currentTheme, setTheme } = useTheme()
  const themes = getThemesList()

  const testCSSVariables = () => {
    const root = document.documentElement
    const primaryColor = getComputedStyle(root).getPropertyValue('--color-primary')
    console.log('🎨 Cor primária atual:', primaryColor)
    console.log('🎨 Tema atual:', currentTheme.name)
    alert(`Cor primária: ${primaryColor}\nTema: ${currentTheme.name}`)
  }

  return (
    <div className="test-theme">
      <div className="card">
        <h2>🎨 Teste de Temas</h2>
        <p>Tema atual: <strong>{currentTheme.name}</strong></p>
        
        <button className="primary" onClick={testCSSVariables}>
          Testar CSS Variables (veja o console)
        </button>

        <div className="theme-buttons">
          {themes.map((theme) => (
            <button
              key={theme.id}
              className={`theme-test-button ${currentTheme.id === theme.id ? 'active' : ''}`}
              onClick={() => setTheme(theme.id)}
            >
              {theme.name}
            </button>
          ))}
        </div>

        <div className="visual-tests">
          <h3>Testes Visuais:</h3>
          
          <button className="primary">Botão Primário</button>
          
          <div className="test-box">
            Box com borda primária
          </div>
          
          <div className="test-gradient">
            Gradiente do tema
          </div>
          
          <input type="text" placeholder="Input (foque para ver a cor)" className="test-input" />
        </div>
      </div>
    </div>
  )
}

export default TestTheme
