import React, { Component } from 'react'
import Slide from 'material-ui/transitions/Slide'
import List, {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from 'material-ui/List'
import Collapse from 'material-ui/transitions/Collapse'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import SearchIcon from 'material-ui-icons/Search'
import AccountCircle from 'material-ui-icons/AccountCircle'
import Switch from 'material-ui/Switch'
import { FormControl, FormGroup, FormControlLabel } from 'material-ui/Form'
import Checkbox from 'material-ui/Checkbox'
import Menu, { MenuItem } from 'material-ui/Menu'
import Tabs, { Tab } from 'material-ui/Tabs'
import Button from 'material-ui/Button'
import Card, { CardContent, CardActions } from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import PropTypes from 'prop-types'
import Input, { InputLabel } from 'material-ui/Input'
import Select from 'material-ui/Select'
import Autosuggest from 'react-autosuggest'
import Paper from 'material-ui/Paper'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import Dialog, { DialogContent, DialogActions } from 'material-ui/Dialog'
import AdminDialog from './components/AdminDialog.js'
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
    dialogShown: false,
    dialogTitle: 'Loading...',
    dialogApproved: true,
    dialogVotes: 0,
    dialogCategory: 'general',
    dialogDesc: 'Loading...',
    dialogRange: null
  }

  changeCategory = category => event => {
    this.setState({ [category]: event.target.checked })
  }

  changeTab = (event, tabIndex) => {
    this.setState({ tabIndex })
  }

  openDialog = (isApproved, title, votes, cat, desc, range) => {
    const data = {
      title: title,
      isApproved: isApproved,
      votes: votes,
      cat: cat,
      desc: desc,
    }
    this.setState({dialogData: data})
    console.log(this.state.dialogData)
    this.setState({ dialog: !this.state.dialog })
  }

   render(){
    const { classes } = this.props
    const { tabIndex } = this.state
    console.log(this.state.dialog)
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
        {tabIndex === 0 && <MainList openDialog={this.openDialog.bind(this)} />}
        {tabIndex === 1 && (
          <FlaggedList openDialog={this.openDialog.bind(this)} />
        )}
        {tabIndex === 2 && (
          <ArchiveList openDialog={this.openDialog.bind(this)} />
        )}
        <AdminDialog
          open={this.state.dialog}
          handleClose={this.openDialog.bind(this)}
          data={this.state.dialogData}
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
            {ideaListItem(true, "Hello", 23, this.props.openDialog)}
            {ideaListItem(true, "Hello", 23, this.props.openDialog)}
            {ideaListItem(true, "Hello", 23, this.props.openDialog)}
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
            {ideaListItem(true, "Hello", 23, this.props.openDialog)}
            {ideaListItem(true, "Hello", 23, this.props.openDialog)}
            {ideaListItem(true, "Hello", 23, this.props.openDialog)}
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
            {ideaListItem(true, "Hello", 23, this.props.openDialog)}
            {ideaListItem(true, "Hello", 23, this.props.openDialog)}
            {ideaListItem(true, "Hello", 23, this.props.openDialog)}
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
          <List disablePadding>
            {ideaListItem(true, "Hello", 23, this.props.openDialog)}
            {ideaListItem(true, "Hello", 23, this.props.openDialog)}
            {ideaListItem(true, "Hello", 23, this.props.openDialog)}
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
            {ideaListItem(true, "Hello", 23, this.props.openDialog)}
            {ideaListItem(true, "Hello", 23, this.props.openDialog)}
            {ideaListItem(true, "Hello", 23, this.props.openDialog)}
          </List>
        </Collapse>
      </List>
    )
  }
}

const ideaListItem =  (isApproved, title, vote, func ) => {
  return (
    <ListItem
      button
      style={{ backgroundColor: 'white' }}
      onClick={() => func(isApproved, title, vote)}
    >
      <ListItemText inset primary={title} />
      <Typography>{vote}</Typography>
    </ListItem>
  )
}


Ideas.propTypes = {
  classes: PropTypes.object.isRequired
}

const suggestions = [
  { label: 'Afghanistan' },
  { label: 'Aland Islands' },
  { label: 'Albania' },
  { label: 'Algeria' },
  { label: 'American Samoa' },
  { label: 'Andorra' },
  { label: 'Angola' },
  { label: 'Anguilla' },
  { label: 'Antarctica' },
  { label: 'Antigua and Barbuda' },
  { label: 'Argentina' },
  { label: 'Armenia' },
  { label: 'Aruba' },
  { label: 'Australia' },
  { label: 'Austria' },
  { label: 'Azerbaijan' },
  { label: 'Bahamas' },
  { label: 'Bahrain' },
  { label: 'Bangladesh' },
  { label: 'Barbados' },
  { label: 'Belarus' },
  { label: 'Belgium' },
  { label: 'Belize' },
  { label: 'Benin' },
  { label: 'Bermuda' },
  { label: 'Bhutan' },
  { label: 'Bolivia, Plurinational State of' },
  { label: 'Bonaire, Sint Eustatius and Saba' },
  { label: 'Bosnia and Herzegovina' },
  { label: 'Botswana' },
  { label: 'Bouvet Island' },
  { label: 'Brazil' },
  { label: 'British Indian Ocean Territory' },
  { label: 'Brunei Darussalam' }
]

export default withStyles(styles)(Ideas)
