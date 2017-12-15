import React from 'react'
import ReactDOM from 'react-dom'
import IdeaSoffit from './IdeaSoffit'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import 'typeface-arimo'
import AdminIdeas from './AdminIdeas'
import { red } from 'material-ui/colors'
import {getList} from './api/api'

/* global token */

const oakland = {
  50: '#f1eee9',
  100: '#dbd4c8',
  200: '#c3b8a4',
  300: '#ab9c7f',
  400: '#b89f74',
  500: '#877148',
  600: '#7f6941',
  700: '#745e38',
  800: '#6a5430',
  900: '#574221',
  A100: '#0074b7',
  A200: '#0074b7',
  A400: '#0074b7',
  A700: '#0074b7',
  contrastDefaultColor: 'light'
}

const oaklandAccent = {
  50: '#eo33f6',
  100: '#b3d5e9',
  200: '#80badb',
  300: '#4d9ecd',
  400: '#2689c2',
  500: '#007467',
  600: '#006c60',
  700: '#0061a7',
  800: '#00579f',
  900: '#004490',
  A100: '#bcd6ff',
  A200: '#0074b7',
  A400: '#5699ff',
  A700: '#3c8aff',
  contrastDefaultColor: 'light'
}

const theme = createMuiTheme({
  palette: {
    primary: oakland,
    secondary: oaklandAccent,
    error: red,
    type: 'light'
  },
  typography: {
    fontFamily: 'Arimo'
  },
  overrides: {
    Input: {
      textFieldInput: {
        fontSize: '16px'
      }
    }
  }
})


ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <AdminIdeas token={token} />
  </MuiThemeProvider>,
  document.getElementById('idea-root')
)
