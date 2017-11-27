import React, {Component} from 'react'
import List, { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui-icons/Search';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Switch from 'material-ui/Switch';
import { FormControl, FormGroup,  FormControlLabel} from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import Menu, { MenuItem } from 'material-ui/Menu';
import Tabs, { Tab } from 'material-ui/Tabs';
import Button from 'material-ui/Button'
import Card, {CardContent, CardActions} from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import PropTypes from 'prop-types'
import Input, {InputLabel} from 'material-ui/Input'
import Select from 'material-ui/Select'
import Autosuggest from 'react-autosuggest';
import Paper from 'material-ui/Paper';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import {withStyles} from 'material-ui/styles'

const styles = theme => ({
  root: {
    '& div div': {
      width: '100%',
    },
  },
  textFieldRoot: {
    padding: 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textFieldInput: {
    height: '1.5rem',
  },
})

const ideaListItem = (isApproved, title, vote, date) => {
  let color = 'white'
  if (isApproved === true){
    //color = '#CEFFCE'
  }

  return (
    <ListItem button style={{backgroundColor: color}}>
      <ListItemText inset primary={title}/>
      <Typography>
        {vote}
      </Typography>
    </ListItem>
  )
}


class Ideas extends Component {
state = {
    general: true,
    design: true,
    issue: true,
    navigation: true,
    mobile: true,
    feature: true,
    tabIndex: 0
  };

  changeCategory = category => event => {
    this.setState({[category]: event.target.checked})
  }

  changeTab = (event, tabIndex) => {
    this.setState({tabIndex})
  }

  render() {
    const {classes, tabIndex} = this.props
    return (
      <div
        className="idea-soffit-root"
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
        <AppBar position="static" >
          <Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
            <Typography type="title" color="inherit" className={classes.flex}>
              Admin Ideas
            </Typography>
            <IconButton className={classes.menuButton} color="contrast" aria-label="Menu">
              <SearchIcon />
            </IconButton>
          </Toolbar>
          <Tabs value={this.state.tabIndex} onChange={this.changeTab}>
            <Tab label="Main" />
            <Tab label="Flagged" />
            <Tab label="Archive" />
          </Tabs>
        </AppBar>
        {tabIndex === 0 && <div>Item One</div>}
        {tabIndex === 1 && <div>Item One</div>}
        {tabIndex === 2 && <div>Item One</div>}
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
          <FormControlLabel checked={this.state.general} control={<Checkbox value="general" onChange={this.changeCategory('general')} />} label="General" />
          <FormControlLabel checked={this.state.design} control={<Checkbox value="design" onChange={this.changeCategory('design')} />} label="Design" />
          <FormControlLabel checked={this.state.issue} control={<Checkbox value="issue" onChange={this.changeCategory('issue')} />} label="Issues" />
          <FormControlLabel checked={this.state.navigation} control={<Checkbox value="navigation" onChange={this.changeCategory('navigation')} />} label="Navigation" />
          <FormControlLabel checked={this.state.mobile} control={<Checkbox value="mobile" onChange={this.changeCategory('mobile')} />} label="MobileApps" />
          <FormControlLabel checked={this.state.feature} control={<Checkbox value="feature" onChange={this.changeCategory('feature')} />} label="New Features" />
        </div>
        <List>
          <ListItem style={{borderBottom: '5px solid #689F38'}}>
            <ListItemText primary="In-progress"/>
          </ListItem>
          <Collapse component="li" in={true} transitionDuration="auto" unmountOnExit>
          <List disablePadding>
            {ideaListItem(true, "This is a random title thing", 23)}
            {ideaListItem(true, "This is a random title thing", 23)}
            {ideaListItem(true, "This is a random title thing", 23)}
          </List>
        </Collapse>
          <ListItem style={{borderBottom: '5px solid lightblue'}}>
            <ListItemText primary="Awaiting Release"/>
          </ListItem>
          <Collapse component="li" in={true} transitionDuration="auto" unmountOnExit>
          <List disablePadding>
            {ideaListItem(true, "This is a random title thing", 23)}
            {ideaListItem(true, "This is a random title thing", 23)}
            {ideaListItem(true, "This is a random title thing", 23)}
          </List>
        </Collapse>
          <ListItem style={{borderBottom: '5px solid #9575CD'}}>
            <ListItemText primary="New Ideas"/>
          </ListItem>
          <Collapse component="li" in={true} transitionDuration="auto" unmountOnExit>
          <List disablePadding>
            {ideaListItem(false, "Goodbye boiiii", 23)}
            {ideaListItem(true, "This is a random title thing", 23)}
            {ideaListItem(true, "This is a random title thing", 23)}
          </List>
        </Collapse>
        </List>
      </div>
    )
  }
}

class IdeaCard extends Component {
  state = {
    title: 'Title',
    desc: 'Lorem Ipsum',
    voteCount: 0,
    category: 0,
    author: '8923832',
    approved: false,
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  render() {
    const {classes} = this.props
    const d = new Date()
    let day = d.getDay()
    let tomorrow = d.getDay() + 1

    if (day < 9) {
      day = '0' + day
      tomorrow = '0' + tomorrow
    } else if (day === 9) {
      day = '0' + day
    }

    let color

    if (this.state.approved) {
      color = {backgroundColor: '#00E676'}
    } else {
      color = {backgroundColor: '#E53935'}
    }

    const today1 = `${d.getFullYear()}-${d.getMonth()}-${day}`
    const today2 = `${d.getFullYear()}-${d.getMonth()}-${tomorrow}`

    return (
      <ListItem style={{paddingTop: 0, paddingBottom: 0, width: '100%'}}>
        <Card style={{flex: 1}}>
          <div style={{width: '100%'}}>
            <div className={classes.header} style={color}>
              <FormControlLabel
                style={{
                  marginLeft: '12px',
                  display: 'flex',
                }}
                control={
                  <Switch
                    color="accent"
                    checked={this.state.checkedA}
                    onChange={() =>
                      this.setState({approved: !this.state.approved})}
                  />
                }
                label="Approved"
              />
              <Typography type="subheading" style={{padding: 18}}>
                Votes: {this.state.voteCount}
              </Typography>
            </div>
            <Typography
              style={{paddingLeft: 16, paddingTop: 12}}
              type="subheading">
              Submitted By: {this.state.author}
            </Typography>
            <div
              className="title"
              style={{
                padding: '18px',
                display: 'flex',
                flexDirection: 'row',
                flexFlow: 'wrap',
              }}>
              <TextField
                label="Title"
                style={{flex: '1 1 auto', marginRight: 8}}
                value={this.state.title}
                onChange={this.handleChange('title')}
              />
              <FormControl
                style={{flex: '1 1 auto', marginLeft: 8, marginRight: 8}}>
                <InputLabel htmlFor="age-simple">Category</InputLabel>
                <Select
                  value={this.state.category}
                  onChange={this.handleChange('category')}
                  input={<Input id="category-select" />}>
                  <MenuItem value={0}>General</MenuItem>
                  <MenuItem value={10}>Issue</MenuItem>
                  <MenuItem value={20}>Mobile Apps</MenuItem>
                  <MenuItem value={30}>Design</MenuItem>
                  <MenuItem value={40}>Navigation</MenuItem>
                  <MenuItem value={50}>New Feature</MenuItem>
                </Select>
              </FormControl>
            </div>
            <CardContent style={{paddingLeft: '18px'}}>
              <TextField
                multiline
                rowsMax="4"
                label="Description"
                margin="normal"
                style={{width: '100%', height: 18}}
                value={this.state.desc}
                onChange={this.handleChange('desc')}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: 18,
                }}>
                {Object.is(this.state.approved, true) && (
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}>
                    <TextField
                      id="date"
                      style={{width: '45%'}}
                      label="Voting Starts"
                      inputClassName={classes.textFieldInput}
                      type="date"
                      defaultValue={today1}
                    />
                    <TextField
                      id="dater"
                      style={{width: '45%'}}
                      label="Voting Ends"
                      inputClassName={classes.textFieldInput}
                      type="date"
                      defaultValue={today2}
                    />
                  </div>
                )}
              </div>
            </CardContent>
            <CardActions style={{display: 'flex', justifyContent: 'flex-end'}}>
              <Button color="accent">Save</Button>
            </CardActions>
          </div>
          <Typography
            component="p"
            style={{marginRight: 20, fontSize: '24px'}}
          />
        </Card>
      </ListItem>
    )
  }
}

Ideas.propTypes = {
  classes: PropTypes.object.isRequired,
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
  { label: 'Brunei Darussalam' },
];

export default withStyles(styles)(Ideas)
