import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import 'typeface-arimo'
import AdminIdeas from './AdminIdeas'
import ErrorPage from './components/ErrorPage'
import IdeaSoffit from './IdeaSoffit'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { adminCheck, isListEmpty } from './api/api'

/* global token */
var token = 'demo'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: {
      light: '#b89f74',
      main: '#877148',
      dark: '#58461f',
      contrastText: '#fff'
    },
    secondary: {
      light: '#56a2ea',
      main: '#0074b7',
      dark: '#004987',
      contrastText: '#fff'
    }
  }
})

class ParentElement extends Component {
  state = {
    isAdmin: false,
    isEmpty: false
  }

  componentDidMount() {
    adminCheck(token).then(isAdmin => {
      this.setState({ isAdmin })
    })
    isListEmpty().then(isEmpty => {
      this.setState({ isEmpty })
    })
  }

  showError = () => {
    this.setState({ isAdmin: 'error' })
  }

  render() {
    const { isAdmin, isEmpty } = this.state
    if (token === 'demo') {
      return (
        <IdeaSoffit
          showError={this.showError}
          isEmpty={isEmpty}
          token={token}
        />
      )
    } else if (isAdmin === 'error') {
      return <ErrorPage />
    } else if (isAdmin) {
      return <AdminIdeas showError={this.showError} token={token} />
    } else {
      return (
        <IdeaSoffit
          showError={this.showError}
          isEmpty={isEmpty}
          token={token}
        />
      )
    }
  }
}

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <ParentElement />
  </MuiThemeProvider>,
  document.getElementById('idea-root')
)
