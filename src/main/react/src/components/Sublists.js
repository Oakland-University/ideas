import React, { Component } from 'react'
import Collapse from '@material-ui/core/Collapse'
import List from '@material-ui/core/List'
import ListItem  from '@material-ui/core/ListItem'
import ListItemText  from '@material-ui/core/ListItemText'
import Pagination from './Pagination'

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
          unmountOnExit
        >
          <List disablePadding>
            <Pagination
              list={this.props.ideas}
              openFunc={this.props.openDialog}
            />
          </List>
        </Collapse>
        <ListItem style={{ borderBottom: '5px solid lightblue' }}>
          <ListItemText primary="Awaiting Release" />
        </ListItem>
        <Collapse
          component="li"
          in={true}
          unmountOnExit
        >
          <List disablePadding>
            <Pagination
              list={this.props.waiting}
              openFunc={this.props.openDialog}
            />
          </List>
        </Collapse>
        <ListItem style={{ borderBottom: '5px solid #9575CD' }}>
          <ListItemText primary="New Ideas" />
        </ListItem>
        <Collapse
          component="li"
          in={true}
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
          unmountOnExit
        >
          <Pagination
            list={this.props.ideas}
            openFunc={this.props.openDialog}
          />
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
          unmountOnExit
        >
          <Pagination
            list={this.props.ideas}
            openFunc={this.props.openDialog}
          />
          <List disablePadding />
        </Collapse>
      </List>
    )
  }
}

export { ArchiveList, FlaggedList, MainList }
