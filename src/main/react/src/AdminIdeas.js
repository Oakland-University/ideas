import React, { Component } from 'react'
import AdminDialog from './components/AdminDialog.js'
import AppBar from 'material-ui/AppBar'
import Checkbox from 'material-ui/Checkbox'
import { FormControlLabel } from 'material-ui/Form'
import {
  getList,
  getAdminData,
  categoryValues,
  categoryLabels
} from './api/api.js'
import { MainList, FlaggedList, ArchiveList } from './components/Sublists'
import PropTypes from 'prop-types'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Tabs, { Tab } from 'material-ui/Tabs'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  adminContent: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap'
  }
})

class Ideas extends Component {
  state = {
    general: true,
    design: true,
    issue: true,
    navigation: true,
    mobile: true,
    feature: true,
    tabIndex: 0,
    archive_list: [],
    idea_list: [],
    flagged_list: [],
    unapproved_list: [],
    waiting_list: [],
    dialog: false,
    d_title: 'Hello',
    d_approved: true,
    d_archived: false,
    d_flagged: false,
    d_desc: 'stuff and things',
    d_vote: 0,
    d_category: 0,
    d_start: 0,
    d_end: 0,
    d_id: 0,
    d_submitter: '00000'
  }

  async componentDidMount() {
    const list = await getList({
      token: this.props.token,
      url: './api/example.json',
      credentialsNeeded: false
    })
    const waiting = await getAdminData({
      token: this.props.token,
      url: 'getWaitingIdeas',
      credentialsNeeded: false
    })
    const unapproved = await getAdminData({
      token: this.props.token,
      url: 'getUnapprovedIdeas',
      credentialsNeeded: false
    })
    const archive = await getAdminData({
      token: this.props.token,
      url: 'getArchive',
      credentialsNeeded: false
    })
    const flagged = await getAdminData({
      token: this.props.token,
      url: 'getFlagged',
      credentialsNeeded: false
    })

    this.setState({
      idea_list: list,
      waiting_list: waiting,
      unapproved_list: unapproved,
      archive_list: archive,
      flagged_list: flagged
    })
  }

  filterCategory = list => {
    let selected = []
    const { general, design, issue, navigation, mobile, feature } = this.state
    if (general) {
      selected.push('general')
    }
    if (design) {
      selected.push('design')
    }
    if (issue) {
      selected.push('issue')
    }
    if (navigation) {
      selected.push('navigation')
    }
    if (mobile) {
      selected.push('mobile')
    }
    if (feature) {
      selected.push('feature')
    }

    const result = list.filter(idea => selected.includes(idea.category))
    return result
  }

  changeCategory = category => event => {
    this.setState({
      [category]: event.target.checked
    })
  }

  changeTab = (event, tabIndex) => {
    this.setState({ tabIndex })
  }

  handleDialogChange = (name, variable) => {
    this.setState({
      [name]: variable
    })
  }

  generateCheckboxes = () => {
    let checkBoxArray = []

    for (let i = 0; i < categoryValues.length; i++) {
      checkBoxArray.push(
        <FormControlLabel
          checked={this.state[categoryValues[i]]}
          control={
            <Checkbox
              value={categoryValues[i]}
              onChange={this.changeCategory(categoryValues[i])}
            />
          }
          label={categoryLabels[i]}
        />
      )
    }

    return checkBoxArray
  }

  openDialog = (
    d_start,
    d_end,
    d_flagged,
    d_archived,
    d_vote,
    d_approved,
    d_title,
    d_userVote,
    d_desc,
    d_category,
    d_submitter,
    d_id
  ) => {
    const { dialog } = this.state
    this.setState({
      d_start,
      d_end,
      d_flagged,
      d_archived,
      d_approved,
      d_title,
      d_vote,
      d_desc,
      d_category,
      d_submitter,
      d_id,
      dialog: !dialog
    })
  }

  render() {
    const { classes } = this.props
    const { tabIndex } = this.state
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar className={classes.toolbar}>
            <Typography type="title" color="inherit">
              Admin Ideas
            </Typography>
          </Toolbar>
          <Tabs value={tabIndex} onChange={this.changeTab}>
            <Tab label="Main" />
            <Tab label="Flagged" />
            <Tab label="Archive" />
          </Tabs>
        </AppBar>
        <div className={classes.adminContent}>{this.generateCheckboxes()}</div>
        {tabIndex === 0 && (
          <MainList
            ideas={this.filterCategory(this.state.idea_list)}
            unapproved={this.filterCategory(this.state.unapproved_list)}
            waiting={this.filterCategory(this.state.waiting_list)}
            openDialog={this.openDialog.bind(this)}
          />
        )}
        {tabIndex === 1 && (
          <FlaggedList
            ideas={this.state.flagged_list}
            openDialog={this.openDialog.bind(this)}
          />
        )}
        {tabIndex === 2 && (
          <ArchiveList
            ideas={this.state.archive_list}
            openDialog={this.openDialog.bind(this)}
          />
        )}
        <AdminDialog
          open={this.state.dialog}
          handleClose={() => this.setState({ dialog: false })}
          changeParent={this.handleDialogChange.bind(this)}
          dialogData={this.state.dialogData}
          title={this.state.d_title}
          approved={this.state.d_approved}
          vote={this.state.d_vote}
          category={this.state.d_category}
          description={this.state.d_desc}
          start={this.state.d_start}
          end={this.state.d_end}
          id={this.state.d_id}
          submitter={this.state.d_submitter}
          flagged={this.state.d_flagged}
          token={this.props.token}
        />
      </div>
    )
  }
}

Ideas.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Ideas)
