import React, { useEffect } from 'react';
import { useContext } from 'react';

import { makeStyles, Paper } from '@material-ui/core';
import { Typography, Chip, Button, TextField } from '@material-ui/core';
import { List, ListItem, ListItemText } from '@material-ui/core'


import {CTX} from './Store'

const useStyles = makeStyles(theme => ({
  root: {
    margin: '50px',
    padding: theme.spacing(3, 2),
  },
  flex: {
    display: 'flex',
    alignItems: 'center'
  },
  topicsWindow: {
    width: '30%',
    height: '500px',
    borderRight: '1px solid black'
  },
  chatWindow: {
    width: '70%',
    height: '600px'
  },
  chatBox: {
    width: '85%'
  },
  button: {
    width: '15%'
  },
  search: {
    width: '20%'
  },
  searchbox: {
    alignItems: 'center'
  },
  topicTitle: {
   display: 'flex',
   flexDirection: 'column',
   justifyContent: 'center'
  }
}))

const Messages = () => {

  const classes = useStyles();
  const { user } = useContext(CTX);

  console.log(user);

  
  const [activeChat, changeChat] = React.useState([])
  const [textValue, changeText] = React.useState('')
  const [searchVal, searchText] = React.useState('')

  useEffect(() => {
  })

  return (
    <div>
      <Paper className={classes.root}>
      <div className={classes.search}>
        <TextField
          className={classes.searchbox}
          id="outlined-required"
          label="Search for somebody"
          value={searchVal}
          onChange={e => searchText(e.target.value)}
          variant="outlined"
        />
        <Button variant="contained" color="primary">
          Send
        </Button>    
        </div>
        <div className={classes.flex}>
          <div className={classes.topicsWindow}>
            <List>
              {
                (
                  <ListItem  button>
                    <ListItemText primary='p' />
                  </ListItem>
                )
              }
            </List>
          </div>
          <div className={classes.chatWindow}>
          <div className={classes.topicTitle}>
        <Typography varient='h5'></Typography>
        </div>
            {
            [activeChat].map((chat, i) => (
                <div className={classes.flex} key={i}>
                  <Chip  className={classes.chip} />
                  <Typography varient='p'>test</Typography>
                </div>
              ))
            }
          </div>
        </div>
        <div className={classes.flex}>
        <TextField
          className={classes.chatBox}
          id="outlined-required"
          label="Type here!"
          value={textValue}
          onChange={e => changeText(e.target.value)}
          variant="outlined"
        />
      
        <Button 
        variant="contained" 
        color="primary" 
        >
          Send
        </Button>    
        </div>

      </Paper>
    </div>
  )
};

export default Messages;