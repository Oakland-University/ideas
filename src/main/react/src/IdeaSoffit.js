import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab'
import IdeaEditor from './components/IdeaEditor'
import EmptyCard from './components/EmptyCard'
import IdeaList from './IdeaList'
import AddIcon from '@material-ui/icons/Add'
import Slide from '@material-ui/core/Slide'
import Snackbar from '@material-ui/core/Snackbar'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  editButton: {
    marginTop: '-37px',
    marginRight: '28px'
  }
})

class IdeaSoffit extends Component {
  state = {
    open: false,
    show_snackbar: false,
    snackbar_message: 'An error occured'
  }

  handleRequestClose = () => {
    this.setState({ open: false })
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  closeSnackbar = () => {
    console.log('Hello')
    this.setState({ show_snackbar: false })
  }

  openSnackbar = status => {
    if (status === 200 || status === 201) {
      this.setState({
        show_snackbar: true,
        snackbar_message: 'Your idea has been submitted'
      })
    } else if (status === 400) {
      this.setState({
        show_snackbar: true,
        snackbar_message: `An error occured. Did you fill out all fields with valid input?`
      })
    } else {
      this.setState({
        show_snackbar: true,
        snackbar_message: `An unknown ${status} error occured. Try again later.`
      })
    }
  }

  render() {
    //This token contains personal info. If null, then load demo ideas
    const token = Object.is(this.props.token, null) ? 'demo' : this.props.token
    //Classes gives CSS classnames
    const { classes } = this.props

    const mainList = this.props.isEmpty ? (
      <EmptyCard />
    ) : (
      <IdeaList url="./api/example.json" token={token} />
    )

    return (
      <div className={classes.root}>
        {mainList}
        <Fab
          color="secondary"
          className={classes.editButton}
          onClick={this.handleOpen}
        >
          <AddIcon />
        </Fab>
        <IdeaEditor
          handleClose={this.handleRequestClose}
          open={this.state.open}
          openSnackbar={this.openSnackbar}
          token={token}
        />
        <Snackbar
          open={this.state.show_snackbar}
          onClose={this.closeSnackbar}
          onRequestClose={this.closeSnackbar}
          transition={Slide}
          autoHideDuration={3000}
          SnackbarContentProps={{
            'aria-describedby': 'message-id'
          }}
          message={<span id="message-id">{this.state.snackbar_message}</span>}
        />
      </div>
    )
  }
}

export default withStyles(styles)(IdeaSoffit)
