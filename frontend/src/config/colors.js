/**
 * Configuração de cores do projeto
 * Este arquivo centraliza todas as cores utilizadas na aplicação
 * Ao alterar aqui, as mudanças serão refletidas em toda a aplicação
 */

const colors = {
  // Cores primárias
  primary: {
    main: '#1976d2',      // Azul principal
    light: '#42a5f5',     // Azul claro
    dark: '#1565c0',      // Azul escuro
    contrastText: '#ffffff' // Texto sobre cor primária
  },

  // Cores secundárias
  secondary: {
    main: '#dc004e',      // Rosa/vermelho principal
    light: '#f50057',     // Rosa/vermelho claro
    dark: '#c51162',      // Rosa/vermelho escuro
    contrastText: '#ffffff' // Texto sobre cor secundária
  },

  // Cores de fundo
  background: {
    default: '#f5f5f5',   // Fundo padrão da aplicação
    paper: '#ffffff',     // Fundo de cards/paper
    dark: '#121212',      // Fundo escuro (modo escuro)
  },

  // Cores de texto
  text: {
    primary: '#212121',   // Texto principal
    secondary: '#757575', // Texto secundário
    disabled: '#bdbdbd',  // Texto desabilitado
    hint: '#9e9e9e',      // Texto de dica
    white: '#ffffff'      // Texto branco
  },

  // Cores de status
  success: {
    main: '#4caf50',      // Verde sucesso
    light: '#81c784',     // Verde claro
    dark: '#388e3c',      // Verde escuro
  },

  error: {
    main: '#f44336',      // Vermelho erro
    light: '#e57373',     // Vermelho claro
    dark: '#d32f2f',      // Vermelho escuro
  },

  warning: {
    main: '#ff9800',      // Laranja aviso
    light: '#ffb74d',     // Laranja claro
    dark: '#f57c00',      // Laranja escuro
  },

  info: {
    main: '#2196f3',      // Azul informação
    light: '#64b5f6',     // Azul claro
    dark: '#1976d2',      // Azul escuro
  },

  // Cores neutras/cinza
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Cores de overlay/sombra
  overlay: {
    light: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.7)',
  },

  // Cores especiais
  divider: 'rgba(0, 0, 0, 0.12)',
  shadow: 'rgba(0, 0, 0, 0.2)',
};

export default colors;
