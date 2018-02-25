import React, { Component } from 'react'
import AdminDialog from './components/AdminDialog.js'
import AppBar from 'material-ui/AppBar'
import Backward from 'material-ui-icons/ArrowBack'
import Collapse from 'material-ui/transitions/Collapse'
import Checkbox from 'material-ui/Checkbox'
import Forward from 'material-ui-icons/ArrowForward'
import { FormControlLabel } from 'material-ui/Form'
import { getList, getAdminData } from './api/api.js'
import IconButton from 'material-ui/IconButton'
import List, { ListItem, ListItemText } from 'material-ui/List'
import PropTypes from 'prop-types'
import SearchIcon from 'material-ui-icons/Search'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Tabs, { Tab } from 'material-ui/Tabs'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  root: {
    '& div div': {
      width: '100%'
    }
  },
  textFieldRoot: {
    padding: 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3
    }
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textFieldInput: {
    height: '1.5rem'
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

  componentDidMount() {
    var a = getList({
      token: this.props.token,
      url: './api/example.json',
      credentialsNeeded: false
    }).then(ideas => {
      return ideas
    })
    var b = getAdminData({
      token: this.props.token,
      url: 'getWaitingIdeas',
      credentialsNeeded: false
    }).then(ideas => {
      return ideas
    })
    var c = getAdminData({
      token: this.props.token,
      url: 'getUnapprovedIdeas',
      credentialsNeeded: false
    }).then(ideas => {
      return ideas
    })
    var f = getAdminData({
      token: this.props.token,
      url: 'getArchive',
      credentialsNeeded: false
    }).then(ideas => {
      return ideas
    })
    var g = getAdminData({
      token: this.props.token,
      url: 'getFlagged',
      credentialsNeeded: false
    }).then(ideas => {
      return ideas
    })

    //TODO: Add https://github.com/stefanpenner/es6-promise for IE
    Promise.all([a, b, c, f, g]).then(values => {
      this.setState({
        idea_list: this.filterCat(values[0]),
        waiting_list: this.filterCat(values[1]),
        unapproved_list: this.filterCat(values[2]),
        archive_list: this.filterCat(values[3]),
        flagged_list: this.filterCat(values[4])
      })
    })
  }

  filterCat = list => {
    let selected = []
    if (this.state.general === true) {
      selected.push('general')
    }
    if (this.state.design === true) {
      selected.push('design')
    }
    if (this.state.issue === true) {
      selected.push('issue')
    }
    if (this.state.navigation === true) {
      selected.push('navigation')
    }
    if (this.state.mobile === true) {
      selected.push('mobile')
    }
    if (this.state.feature === true) {
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

  openDialog = (
    start,
    end,
    isFlagged,
    isArchived,
    voteCount,
    isApproved,
    title,
    vote,
    desc,
    category,
    submitter,
    id
  ) => {
    this.setState({
      d_start: start,
      d_end: end,
      d_flagged: isFlagged,
      d_archived: isArchived,
      d_approved: isApproved,
      d_title: title,
      d_vote: voteCount,
      d_desc: desc,
      d_category: category,
      d_submitter: submitter,
      d_id: id,
      dialog: !this.state.dialog
    })
  }

  render() {
    const { classes } = this.props
    const { tabIndex } = this.state
    return (
      <div
        className="idea-soffit-root"
        style={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <AppBar position="static">
          <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography type="title" color="inherit" className={classes.flex}>
              Admin Ideas
            </Typography>
            <IconButton
              className={classes.menuButton}
              color="contrast"
              aria-label="Menu"
            >
              <SearchIcon />
            </IconButton>
          </Toolbar>
          <Tabs value={this.state.tabIndex} onChange={this.changeTab}>
            <Tab label="Main" />
            <Tab label="Flagged" />
            <Tab label="Archive" />
          </Tabs>
        </AppBar>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap'
          }}
        >
          <FormControlLabel
            checked={this.state.general}
            control={
              <Checkbox
                value="general"
                onChange={this.changeCategory('general')}
              />
            }
            label="General"
          />
          <FormControlLabel
            checked={this.state.design}
            control={
              <Checkbox
                value="design"
                onChange={this.changeCategory('design')}
              />
            }
            label="Design"
          />
          <FormControlLabel
            checked={this.state.issue}
            control={
              <Checkbox value="issue" onChange={this.changeCategory('issue')} />
            }
            label="Issues"
          />
          <FormControlLabel
            checked={this.state.navigation}
            control={
              <Checkbox
                value="navigation"
                onChange={this.changeCategory('navigation')}
              />
            }
            label="Navigation"
          />
          <FormControlLabel
            checked={this.state.mobile}
            control={
              <Checkbox
                value="mobile"
                onChange={this.changeCategory('mobile')}
              />
            }
            label="Mobile Apps"
          />
          <FormControlLabel
            checked={this.state.feature}
            control={
              <Checkbox
                value="feature"
                onChange={this.changeCategory('feature')}
              />
            }
            label="New Features"
          />
        </div>
        {tabIndex === 0 && (
          <MainList
            ideas={this.filterCat(this.state.idea_list)}
            unapproved={this.filterCat(this.state.unapproved_list)}
            waiting={this.filterCat(this.state.waiting_list)}
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
          token={this.props.token}
          flagged={this.state.d_flagged}
        />
      </div>
    )
  }
}

class MainList extends Component {
  render() {
    return (
      <List>
        <ListItem style={{ borderBottom: '5px solid #689F38' }}>
          <ListItemText primary="In-progress" />
        </ListItem>
        <Collapse
          component="li"
          in={true}
          transitionDuration="auto"
          unmountOnExit
        >
          <List disablePadding>
            {ideaListItem(this.props.ideas, this.props.openDialog)}
          </List>
        </Collapse>
        <ListItem style={{ borderBottom: '5px solid lightblue' }}>
          <ListItemText primary="Awaiting Release" />
        </ListItem>
        <Collapse
          component="li"
          in={true}
          transitionDuration="auto"
          unmountOnExit
        >
          <List disablePadding>
            {ideaListItem(this.props.waiting, this.props.openDialog)}
          </List>
        </Collapse>
        <ListItem style={{ borderBottom: '5px solid #9575CD' }}>
          <ListItemText primary="New Ideas" />
        </ListItem>
        <Collapse
          component="li"
          in={true}
          transitionDuration="auto"
          unmountOnExit
        >
          <Pagination
            list={this.props.unapproved}
            openFunc={this.props.openDialog}
          />
        </Collapse>
      </List>
    )
  }
}

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

class FlaggedList extends Component {
  render() {
    return (
      <List>
        <ListItem style={{ borderBottom: '5px solid #a94442' }}>
          <ListItemText primary="Flagged Ideas" />
        </ListItem>
        <Collapse
          component="li"
          in={true}
          transitionDuration="auto"
          unmountOnExit
        >
          <List disablePadding>
            {ideaListItem(this.props.ideas, this.props.openDialog)}
          </List>
        </Collapse>
      </List>
    )
  }
}

class ArchiveList extends Component {
  render() {
    return (
      <List>
        <ListItem style={{ borderBottom: '5px solid gray' }}>
          <ListItemText primary="Archived Ideas" />
        </ListItem>
        <Collapse
          component="li"
          in={true}
          transitionDuration="auto"
          unmountOnExit
        >
          <List disablePadding>
            {ideaListItem(this.props.ideas, this.props.openDialog)}
          </List>
          <List disablePadding />
        </Collapse>
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

Ideas.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Ideas)
