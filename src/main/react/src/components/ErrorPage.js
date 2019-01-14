import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Error from '@material-ui/icons/Error'

const styles = theme => ({
  root: {
    position: 'relative',
    width: '100%'
  },

  card: {
    backgroundColor: '#fafafa ',
    borderLeftStyle: 'solid',
    borderLeftWidth: '12px',
    borderLeftColor: '#d32f2f',
    display: 'flex'
  },

  media: {
    padding: '10px',
    display: 'flex',
    alignSelf: 'center',
    marginLeft: '10px'
  },

  content: {
    paddingTop: 0
  },

  icon: {
    fill: '#d32f2f',
    width: 75,
    height: 100
  }
})

class ErrorPage extends Component {
  render() {
    const classes = this.props.classes
    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <div className={classes.media}>
            <Error className={classes.icon} />
          </div>
          <div>
            <CardHeader title="We were unable to fetch your data at this time." />
            <CardContent className={classes.content}>
              <Typography type="subheading">Please try again later.</Typography>
            </CardContent>
          </div>
        </Card>
      </div>
    )
  }
}

ErrorPage.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles, { name: 'ErrorPage' })(ErrorPage)
