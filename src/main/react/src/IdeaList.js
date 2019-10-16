import React, { Component } from 'react'
import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import ArrowDropUp from '@material-ui/icons/ArrowDropUp'
import Avatar from '@material-ui/core/Avatar'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import ErrorPage from './components/ErrorPage'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import { getList, getListDemo, submitVote } from './api/api.js'

const styles = theme => ({
  listRoot: {
    alignItems: 'flex-start',
    width: '100%'
  },
  editButton: {
    marginTop: '-37px',
    marginRight: '28px'
  },
  listItem: {
    paddingTop: 0,
    paddingBottom: 0,
    width: '100%'
  }
})

class IdeaList extends Component {
  state = {
    loading: true,
    category: 'loading',
    listItems: 'loading',
    amount: 'loading',
    createdAt: 'loading'
  }

  componentDidMount() {
    if (this.props.token === 'demo') {
      getListDemo().then(ideas => {
        this.setState({
          category: ideas.category,
          amount: 5,
          listItems: ideas.listItems,
          loading: false
        })
      })
    } else {
      getList({
        token: this.props.token
      }).then(ideas => {
        this.setState({
          category: 'blob',
          amount: 5,
          listItems: ideas,
          loading: false
        })
      })
    }
  }

  generateList = () => {
    let iArray = []
    const { listItems } = this.state
    if (!listItems){
      return null
    }
    for (let i = 0; i < listItems.length; i++) {
      iArray.push(<IdeaListItem key={i} token={this.props.token} idea={listItems[i]} />)
    }
    return iArray
  }

  render() {
    //Classes gives CSS classnames
    const { classes } = this.props

    if (this.state.loading === true) {
      return <div>Loading...</div>
    } else if (Object.is(this.state.listItems, null)) {
      return <ErrorPage />
    }
    return <List className={classes.listRoot}>{this.generateList()}</List>
  }
}

const ListItemStyles = {
  listItem: {
    paddingTop: 0,
    paddingBottom: 0,
    width: '100%'
  },
  card: {
    display: 'flex',
    flex: 1
  },
  cardContent: {
    paddingLeft: '18px'
  },
  voteSection: {
    display: 'flex',
    alignItems: 'center'
  },
  voteButtons: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  voteCount: {
    marginRight: 20,
    fontSize: '24px'
  }
}

class IdeaListItem extends Component {
  state = {
    voteCount: +this.props.idea.voteCount,
    userVote: +this.props.idea.userVote
  }

  handleVote = (id, createdAt, vote) => {
    submitVote(id, createdAt, vote, this.props.token)
    if (this.state.userVote === 0) {
      this.setState({ userVote: vote, voteCount: this.state.voteCount + vote })
    } else if (this.state.userVote !== vote) {
      this.setState({
        userVote: vote,
        voteCount: this.state.voteCount + vote
      })
    }
  }

  render() {
    let { idea } = this.props
    let style = ListItemStyles
    const createdAt = new Date(idea.createdAt)
    const date = `${createdAt.getMonth() +
      1}/${createdAt.getDate()}/${createdAt.getFullYear()}`

    let arrowStyle = {
      up: { color: 'grey', fontSize: '3rem' },
      down: { color: 'grey', fontSize: '3rem' }
    }

    if (this.state.userVote === 1) {
      arrowStyle.up.color = 'green'
    } else if (this.state.userVote === -1) {
      arrowStyle.down.color = 'red'
    }

    return (
      <ListItem style={style.listItem} key={idea.id}>
        <Card style={style.card}>
          <div style={{ width: '100%' }}>
            <CardHeader
              avatar={<Avatar aria-label={idea.category}>{idea.avatar}</Avatar>}
              title={idea.title}
              subheader={date}
            />
            <CardContent style={style.cardContent}>
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
          <div style={style.voteSection}>
            <div style={style.voteButtons}>
              <IconButton
                onClick={() => this.handleVote(idea.id, idea.createdAt, 1)}
              >
                <ArrowDropUp style={arrowStyle.up} />
              </IconButton>
              <IconButton
                onClick={() => this.handleVote(idea.id, idea.createdAt, -1)}
              >
                <ArrowDropDown style={arrowStyle.down} />
              </IconButton>
            </div>
            <Typography component="p" style={style.voteCount}>
              {this.state.voteCount}
            </Typography>
          </div>
        </Card>
      </ListItem>
    )
  }
}

export default withStyles(styles)(IdeaList)
