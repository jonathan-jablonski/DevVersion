import React from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import { Typography, Chip, Button, TextField } from '@material-ui/core';
import { borderRight, height } from '@material-ui/system';
import { List, ListItem, ListItemText } from '@material-ui/core'
import { calculateObjectSize } from 'bson';

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
  const [allChats] = React.useContext(CTX);

  console.log({allChats});

  const topics = Object.keys(allChats)
  
  const [activeChat, changeChat] = React.useState(topics[0])
  const [textValue, changeText] = React.useState('')
  const [searchVal, searchText] = React.useState('')

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
                topics.map(topic => (
                  <ListItem  onClick={e => changeChat(e.target.innerText)} key={topic} button>
                    <ListItemText primary={topic} />
                  </ListItem>
                ))
              }
            </List>
          </div>
          <div className={classes.chatWindow}>
          <div className={classes.topicTitle}>
        <Typography varient='h5'>{activeChat}</Typography>
        </div>
            {
              allChats[activeChat].map((chat, i) => (
                <div className={classes.flex} key={i}>
                  <Chip label={chat.from} className={classes.chip} />
                  <Typography varient='p'>{chat.msg}</Typography>
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
      
        <Button variant="contained" color="primary">
          Send
        </Button>    
        </div>

      </Paper>
    </div>
  )
};

export default Messages;