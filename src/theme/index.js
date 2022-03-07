import { createMuiTheme, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#201F1D',
    },
    primary: {
      main: '#868685',
    },
    secondary: {
      main: '#DE8D47',
    },
    text: {
      primary: '#DCDCDC',
      secondary: '#DCDCDC'
    }
  },
  shadows,
  typography
});

export default theme;
