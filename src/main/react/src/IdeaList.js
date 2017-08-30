import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles, createStyleSheet } from "material-ui/styles"
import Card, {
  CardHeader,
  CardMedia,
  CardContent,
  CardActions
} from "material-ui/Card"
import Avatar from "material-ui/Avatar"
import FolderIcon from "material-ui-icons/Folder"
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List"
import Typography from "material-ui/Typography"
import ArrowDropUp from "material-ui-icons/ArrowDropUp"
import ArrowDropDown from "material-ui-icons/ArrowDropDown"
import IconButton from "material-ui/IconButton"
import { getList } from "./api/api.js"

class IdeaList extends Component {
  state = {
    loading: true,
    category: "loading",
    listItems: "loading",
    amount: "loading"
  }

  componentDidMount() {
    getList({
      token: this.props.token,
      url: this.props.url,
      credentialsNeeded: false
    }).then(ideas => {
      this.setState({
        category: "blob",
        amount: 5,
        listItems: ideas,
        loading: false
      })
    })
  }

  generateList = () => {
    let iArray = []
    let index = 0
    for (let idea of this.state.listItems) {
      iArray.push(
        <ListItem
          style={{ paddingTop: 0, paddingBottom: 0, width: "100%" }}
          key={index++}
        >
          <Card style={{ display: "flex" }}>
            <div>
              <CardHeader
                avatar={
                  <Avatar aria-label={idea.category}>{idea.avatar}</Avatar>
                }
                title={idea.title}
                subheader="September 14, 2016"
              />
              <CardContent>
                <Typography component="p">{idea.description}</Typography>
              </CardContent>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center"
                }}
              >
                <IconButton>
                  <ArrowDropUp />
                </IconButton>
                <IconButton>
                  <ArrowDropDown />
                </IconButton>
              </div>
              <Typography
                component="p"
                style={{ marginRight: 20, fontSize: "24px" }}
              >
                {idea.voteCount}
              </Typography>
            </div>
          </Card>
        </ListItem>
      )
    }
    return iArray
  }

  render() {
    if (this.state.loading === true) {
      return <div>Loading stuff</div>
    } else if (Object.is(this.state.listItems, null)) {
      return <div>Error state</div>
    }
    return <List>{this.generateList()}</List>
  }
}

export default IdeaList
