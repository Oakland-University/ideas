import React, { Component } from 'react'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Collapse from 'material-ui/transitions/Collapse'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import SearchIcon from 'material-ui-icons/Search'
import { FormControlLabel } from 'material-ui/Form'
import Checkbox from 'material-ui/Checkbox'
import Tabs, { Tab } from 'material-ui/Tabs'
import PropTypes from 'prop-types'
import AdminDialog from './components/AdminDialog.js'
import { withStyles } from 'material-ui/styles'
import { getList, getAdminData } from './api/api.js'

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
    archive_list: {},
    idea_list: {},
    flagged_list: {},
    unapproved_list: {},
    waiting_list: {},
    dialog: false,
    d_title: 'Hello',
    d_approved: true,
    d_desc: 'stuff and things',
    d_vote: 0,
    d_category: 0,
    d_start: 0,
    d_end: 0,
    d_id: 0
  }

  componentDidMount() {
    let idea_list, waiting, unapproved, archive
    var a = getList({
      token: this.props.token,
      url: './api/example.json',
      credentialsNeeded: false
    }).then(ideas => {
      return ideas
      console.log('1')
    })
    var b = getAdminData({
      token: this.props.token,
      url: 'getWaitingIdeas',
      credentialsNeeded: false
    }).then(ideas => {
      return ideas
      console.log('2')
    })
    var c = getAdminData({
      token: this.props.token,
      url: 'getUnapprovedIdeas',
      credentialsNeeded: false
    }).then(ideas => {
      return ideas
      console.log('3')
    })
    var f = getAdminData({
      token: this.props.token,
      url: 'getArchive',
      credentialsNeeded: false
    }).then(ideas => {
      return ideas
      console.log('4')
    })
    const d = new Date()
    let day = d.getDay()
    let tomorrow = d.getDay() + 1
    if (day < 9) {
      day = '0' + day
      tomorrow = '0' + tomorrow
    } else if (day === 9) {
      day = '0' + day
    }
    const start = `${d.getFullYear()}-${d.getMonth()}-${day}`
    const end = `${d.getFullYear()}-${d.getMonth()}-${tomorrow}`

    //TODO: Add https://github.com/stefanpenner/es6-promise for IE
    Promise.all([a, b, c, f]).then(values => {
      this.setState({
        idea_list: values[0],
        waiting_list: values[1],
        unapproved_list: values[2],
        archive_list: values[3],
        d_start: start,
        d_end: end
      })
    })
  }

  changeCategory = category => event => {
    this.setState({ [category]: event.target.checked })
  }

  changeTab = (event, tabIndex) => {
    this.setState({ tabIndex })
  }

  handleDialogChange = (name, variable) => {
    console.log(name, variable)
    this.setState({
      [name]: variable
    })
  }

  openDialog = (isApproved, title, vote, desc, category, id) => {
    this.setState({
      d_approved: isApproved,
      d_title: title,
      d_vote: vote,
      d_desc: desc,
      d_category: category,
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
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
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
            ideas={this.state.idea_list}
            unapproved={this.state.unapproved_list}
            waiting={this.state.waiting_list}
            openDialog={this.openDialog.bind(this)}
          />
        )}
        {tabIndex === 1 && (
          <FlaggedList openDialog={this.openDialog.bind(this)} />
        )}
        {tabIndex === 2 && (
          <ArchiveList openDialog={this.openDialog.bind(this)} />
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
          token={this.props.token}
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
            {console.log(this.props.ideas)}
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
            {console.log(this.props.waiting)}
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
          <List disablePadding>
            {ideaListItem(this.props.unapproved, this.props.openDialog)}
            {console.log(this.props.unapproved)}
          </List>
        </Collapse>
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
          <List disablePadding />
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
    ideaArray.push(
      <ListItem
        button
        style={{ backgroundColor: 'white' }}
        onClick={() =>
          func(
            idea.approved,
            idea.title,
            idea.userVote,
            idea.description,
            idea.category,
            idea.id
          )
        }
      >
        <ListItemText inset primary={idea.title} />
        <Typography>{idea.vote}</Typography>
      </ListItem>
    )
  }

  return ideaArray
}

Ideas.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Ideas)
