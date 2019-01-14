import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const styles = theme => ({
  root: {
    position: 'relative',
    width: '100%'
  },

  card: {
    backgroundColor: '#fafafa ',
    display: 'flex'
  },

  content: {
    paddingTop: 0
  }
})

class EmptyCard extends Component {
  render() {
    const classes = this.props.classes
    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <div>
            <CardHeader title="Looks like there are no ideas currently" />
            <CardContent className={classes.content}>
              <Typography type="subheading">
                If you have an idea to improve MySail, press the button to the
                bottom right and fill out the form.
              </Typography>
            </CardContent>
          </div>
        </Card>
      </div>
    )
  }
}

EmptyCard.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles, { name: 'EmptyCard' })(EmptyCard)
