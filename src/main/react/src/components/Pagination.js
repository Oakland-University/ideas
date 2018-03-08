import React, { Component } from 'react'
import AdminDialog from './AdminDialog.js'
import AppBar from 'material-ui/AppBar'
import Backward from 'material-ui-icons/ArrowBack'
import Collapse from 'material-ui/transitions/Collapse'
import Checkbox from 'material-ui/Checkbox'
import Forward from 'material-ui-icons/ArrowForward'
import { FormControlLabel } from 'material-ui/Form'
import {
  getList,
  getAdminData,
  categoryValues,
  categoryLabels
} from '../api/api'
import IconButton from 'material-ui/IconButton'
import List, { ListItem, ListItemText } from 'material-ui/List'
import PropTypes from 'prop-types'
import SearchIcon from 'material-ui-icons/Search'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Tabs, { Tab } from 'material-ui/Tabs'
import { withStyles } from 'material-ui/styles'

class Pagination extends Component {
  state = { start: 0, end: 5, page: 1 }

  page = direction => {
    console.log('click')
    if (direction === 'back' && this.state.start !== 0) {
      this.setState({
        start: this.state.start - 5,
        end: this.state.end - 5,
        page: this.state.page - 1
      })
    } else if (
      direction === 'forward' &&
      this.state.end < this.props.list.length
    ) {
      this.setState({
        start: this.state.start + 5,
        end: this.state.end + 5,
        page: this.state.page + 1
      })
    }
  }

  render() {
    return (
      <List disablePadding>
        {ideaListItem(
          this.props.list.slice(this.state.start, this.state.end),
          this.props.openFunc
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <IconButton
            color="secondary"
            aria-label="Paginate backward"
            onClick={() => this.page('back')}
          >
            <Backward />
          </IconButton>
          <Typography>
            {this.state.page} of {Math.ceil(this.props.list.length / 5)}
          </Typography>
          <IconButton
            color="secondary"
            aria-label="Paginate forward"
            onClick={() => this.page('forward')}
          >
            <Forward />
          </IconButton>
        </div>
      </List>
    )
  }
}

const ideaListItem = (ideas, func) => {
  if (ideas === null || ideas === undefined) {
    return null
  }

  let ideaArray = []
  for (let value in ideas) {
    const idea = ideas[value]
    let start
    let end
    let s, e
    if (idea.startVoteDate !== null && idea.startVoteDate !== undefined) {
      s = new Date(idea.startVoteDate)
      e = new Date(idea.endVoteDate)

      let today = s.getDate()
      let tomorrow = e.getDate()

      if (today <= 9) {
        today = '0' + today
      }
      if (tomorrow <= 9) {
        tomorrow = '0' + tomorrow
      }

      let month1 = s.getMonth() + 1
      let month2 = e.getMonth() + 1

      if (month1 < 10) {
        month1 = '0' + month1
      }
      if (month2 < 10) {
        month2 = '0' + month2
      }

      start = `${s.getFullYear()}-${month1}-${today}`
      end = `${e.getFullYear()}-${month2}-${tomorrow}`
    } else {
      var d = new Date()
      var day = d.getDay()
      var tomorrow = d.getDay() + 1
      if (day <= 9) {
        day = '0' + day
      }

      if (tomorrow <= 9) {
        tomorrow = '0' + tomorrow
      }

      var month = d.getMonth() + 1

      if (month < 10) {
        month = '0' + month
      }

      start = `${d.getFullYear()}-${month}-${day}`
      end = `${d.getFullYear()}-${month}-${tomorrow}`
    }

    ideaArray.push(
      <ListItem
        button
        style={{ backgroundColor: 'white' }}
        onClick={() =>
          func(
            start,
            end,
            idea.flagged,
            idea.archived,
            idea.voteCount,
            idea.approved,
            idea.title,
            idea.userVote,
            idea.description,
            idea.category,
            idea.createdBy,
            idea.id
          )
        }
      >
        <ListItemText inset primary={idea.title} />
        <Typography>{idea.voteCount}</Typography>
      </ListItem>
    )
  }

  return ideaArray
}

export default Pagination
