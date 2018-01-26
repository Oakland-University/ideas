import ArrowDropDown from 'material-ui-icons/ArrowDropDown'
import ArrowDropUp from 'material-ui-icons/ArrowDropUp'
import Avatar from 'material-ui/Avatar'
import Card, { CardContent, CardHeader } from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import List, { ListItem } from 'material-ui/List'
import Typography from 'material-ui/Typography'
import React, { Component } from 'react'

import { getList, getListDemo, submitVote } from './api/api.js'

class IdeaList extends Component {
  state = {
    loading: true,
    category: 'loading',
    listItems: 'loading',
    amount: 'loading',
    createdAt: 'loading'
  }

  componentDidMount() {
    console.log(this.props.token)
    if (this.props.token === 'demo') {
      var bob = getListDemo().then(ideas => {
        this.setState({
          category: ideas.category,
          amount: 5,
          listItems: ideas.listItems,
          loading: false
        })
      })
    } else {
      getList({
        token: this.props.token,
        url: this.props.url,
        credentialsNeeded: false
      }).then(ideas => {
        this.setState({
          category: 'blob',
          amount: 5,
          listItems: ideas,
          loading: false
        })
      })
    }
    console.log(bob)
  }

  generateList = () => {
    let iArray = []
    let index = 0
    const { listItems } = this.state
    console.log('List Items:', ListItem)
    for (let idea of listItems) {
      iArray.push(<IdeaListItem token={this.props.token} idea={idea} index={index} />)
      index++
    }
    return iArray
  }

  render() {
    if (this.state.loading === true) {
      return <div>Loading stuff</div>
    } else if (Object.is(this.state.listItems, null)) {
      return <div>Error state</div>
    }
    return (
      <List style={{ alignItems: 'flex-start', width: '100%' }}>
        {this.generateList()}
      </List>
    )
  }
}

class IdeaListItem extends Component {
  state = {
    voteCount: this.props.idea.voteCount,
    userVote: this.props.idea.userVote
  }

  handleVote = (id, createdAt, vote, index) => {
    submitVote(id, createdAt, vote, this.props.token)
    if (this.state.userVote === 0) {
      this.setState({ userVote: vote, voteCount: this.state.voteCount + vote })
    } else if (this.state.userVote != vote) {
      this.setState({ userVote: 0, voteCount: this.state.voteCount + vote })
    }
    this.forceUpdate()
  }

  render() {
    let { idea, index } = this.props
    const createdAt = new Date(idea.createdAt)
    const date = `${createdAt.getMonth()}/${createdAt.getDate()}/${createdAt.getFullYear()}`
    let arrowStyle = {
      up: { color: 'grey' },
      down: { color: 'grey' }
    }

    if (this.state.userVote === 1) {
      arrowStyle.up.color = 'green'
    } else if (this.state.userVote === -1) {
      arrowStyle.down.color = 'red'
    }
    return (
      <ListItem
        style={{ paddingTop: 0, paddingBottom: 0, width: '100%' }}
        key={index++}
      >
        <Card
          style={{
            display: 'flex',
            flex: 1
          }}
        >
          <div
            style={{
              width: '100%'
            }}
          >
            <CardHeader
              avatar={<Avatar aria-label={idea.category}>{idea.avatar}</Avatar>}
              title={idea.title}
              subheader={date}
            />
            <CardContent
              style={{
                paddingLeft: '18px'
              }}
            >
              <Typography
                style={{
                  hyphens: 'auto'
                }}
                component="p"
              >
                {idea.description}
              </Typography>
            </CardContent>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <IconButton
                onClick={() =>
                  this.handleVote(idea.id, idea.createdAt, 1, index)
                }
              >
                <ArrowDropUp style={arrowStyle.up} />
              </IconButton>
              <IconButton
                onClick={() =>
                  this.handleVote(idea.id, idea.createdAt, -1, index)
                }
              >
                <ArrowDropDown style={arrowStyle.down} />
              </IconButton>
            </div>
            <Typography
              component="p"
              style={{
                marginRight: 20,
                fontSize: '24px'
              }}
            >
              {this.state.voteCount}
            </Typography>
          </div>
        </Card>
      </ListItem>
    )
  }
}

export default IdeaList
