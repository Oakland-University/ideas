import React, { Component } from 'react'
import Button from 'material-ui/Button'
import IdeaEditor from './components/IdeaEditor'
import EmptyCard from './components/EmptyCard'
import IdeaList from './IdeaList'
import AddIcon from 'material-ui-icons/Add'
import { withStyles } from 'material-ui/styles'

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
  state = { open: false }

  handleRequestClose = () => {
    this.setState({ open: false })
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  render() {
    //This token contains personal info. If null, then load demo ideas
    const token = Object.is(this.props.token, null) ? 'demo' : this.props.token
    //Classes gives CSS classnames
    const { classes } = this.props

    const mainList = this.props.isEmpty ? (
      <EmptyCard/>
    ) : (
      <IdeaList url="./api/example.json" token={token}/>
    )

    return (
      <div className={classes.root}>
        {mainList}
        <Button
          fab
          color="accent"
          className={classes.editButton}
          onClick={this.handleOpen}
        >
          <AddIcon />
        </Button>
        <IdeaEditor
          handleClose={this.handleRequestClose}
          open={this.state.open}
          token={token}
        />
      </div>
    )
  }
}

export default withStyles(styles)(IdeaSoffit)
