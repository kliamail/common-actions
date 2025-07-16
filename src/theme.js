import { createTheme } from '@mui/material/styles';
import { grey, amber } from '@mui/material/colors';

export const getTheme = mode =>
  createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },   // MUI blue
      secondary: amber,
      background: {
        default: mode === 'light' ? grey[100] : '#121212'
      }
    },
    typography: {
      fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial, sans-serif',
      monoFamily: '"JetBrains Mono", monospace'
    }
  });