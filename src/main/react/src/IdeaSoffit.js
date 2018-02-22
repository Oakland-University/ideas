import ModeEditIcon from 'material-ui-icons/ModeEdit'
import Button from 'material-ui/Button'
import React, { Component } from 'react'

import IdeaEditor from './components/IdeaEditor'
import IdeaList from './IdeaList'

const buttonStyle = {
  marginTop: '-37px',
  marginRight: '28px'
}

class IdeaSoffit extends Component {
  state = { open: false, value: 'general', title: '', description: '' }

  handleRequestClose = () => {
    this.setState({ open: false })
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  render() {
    const token = Object.is(this.props.token, null) ? 'demo' : this.props.token

    return (
      <div
        className="idea-soffit-root"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end'
        }}
      >
        {' '}
        <IdeaList url="./api/example.json" token={token} />
        <Button
          fab
          color="accent"
          style={buttonStyle}
          onClick={this.handleOpen}
        >
          <ModeEditIcon />
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

export default IdeaSoffit
