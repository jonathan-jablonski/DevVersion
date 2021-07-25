import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from "axios";
import { CTX } from './Store';
import { CREATE_CONVERSATION_URL, config, CREATE_MESSAGE_URL } from '../config/constants';
import io from "socket.io-client";

// Material UI styling
import { makeStyles, Paper, Typography, } from '@material-ui/core';
import { IconButton, TextField, Link, Divider, ListItemAvatar, Avatar } from '@material-ui/core';
import { List, ListItem, ListItemText, Grid, Button } from '@material-ui/core';


const socket = io.connect("ws://localhost:3002");

//Styles the classes
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
  messageBox: {
    display: 'flex'
  },
  topicTitle: {
    right: '20px',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  searchresult: {
    width: '10%'
  }
}))





const Messages = () => {

  //Consts
  const classes = useStyles();
  const { user } = useContext(CTX);


  //States
  const [searchUsers, setSearchUsers] = useState([]);
  const [activeConvos, setActiveConvos] = React.useState([])
  const [message, setMessage] = React.useState([]);
  const [newMessage, setnewMessage] = React.useState("")



  // Get messages
  useEffect(() => {
    const getMessage = async () => {
      try {
        const res = await axios.get(CREATE_MESSAGE_URL, config)
        setMessage(res.data)
        console.log('Message res', res)
      } catch (err) {
        console.log(err)
      }
    }
    getMessage();
  }, []);

  //Gets conversations
  useEffect(() => {
    const getConvo = async () => {
      try {
        const res = await axios.get(CREATE_CONVERSATION_URL, config)
        setActiveConvos(res.data)
        console.log('Conversations', res)
      } catch (err) {
        console.log(err)
      }
    }
    getConvo();
  }, []);



  // Allows users to find profiles
  const FindUser = (pattern) => {
    if (!(pattern === "")) {
      const URL = `http://localhost:3000/users-research`;
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      };
      axios.post(URL, { pattern }, config).then((res) => {
        setSearchUsers(res.data);
      });
    }
  };

  //Creates conversation when selected in search
  const createConvo = async (userTwo) => {
    try {
      const foundConvo = activeConvos.filter((convo) =>
        convo.userTwo._id === userTwo._id
      )
      console.log(foundConvo)
      if (foundConvo.length !== 0) {
        return;
      }
      await axios.post(
        CREATE_CONVERSATION_URL,
        {
          userOne: user._id,
          userTwo: userTwo._id
        },
        config
      ).then((convo) => {
        console.log(convo)
        setActiveConvos([...activeConvos, convo.data])
      });
    } catch (err) {
      console.log('this is the error', err)
      console.log(err.msg)
    }
  };


  const createMessage = async (e) => {
    e.preventDefault();
   
    try {
      await axios.post(
        CREATE_MESSAGE_URL,
        {
          sender: user._id,
          text: newMessage,
          date: Date.now
        },
        config
      ).then((receivedMessage) => {
        console.log(receivedMessage)
        setMessage([...message, receivedMessage.data])
        setnewMessage("")
        socket.emit('send message', {
          senderId: user._id,
          text: newMessage
        })
        
      });
    } catch (err) {
      console.log('this is the error', err)
      console.log(err.msg)
    }
  };



  return (
    <div>
      <Paper className={classes.root}>
        <div component="form" className={classes.search}>
          <TextField
            className={classes.searchbox}
            label="Search for somebody"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
            onChange={(e) => FindUser(e.target.value)}
          />

        </div>
        <div>
          <List className={classes.root}>
            {searchUsers.user
              ? searchUsers.user.map((searchUser) => {
                return (
                  <Link
                    onClick={() => createConvo(searchUser)}
                  >
                    <Divider className={classes.searchresult}
                      variant="inset"
                      component="li"
                    />
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          alt="Avatar"
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={searchUser.Name}
                        secondary={<React.Fragment>{searchUser.Email}</React.Fragment>}
                      />
                    </ListItem>
                  </Link>
                );
              })
              : null}
          </List>

        </div>
        <div className={classes.flex}>
          <div className={classes.topicsWindow}>
            {activeConvos.map((convo, index) => {
              return (
                <List>
                  {
                    (
                      <ListItem button>
                        <ListItemText key={index}>
                          {convo.userTwo.Name}
                        </ListItemText>
                      </ListItem>
                    )
                  }
                </List>
              )
            }
            )}
          </div>
        </div>





      <div>
          {message.map((messageData) => {
            return (
              <List>
                <ListItem alignItems="flex-start" >
                  <ListItemAvatar>
                    <Avatar
                      alt="Avatar"
                    />
                  </ListItemAvatar>
                  <ListItemText >
                  {messageData.text}
                  </ListItemText>
                </ListItem>
              </List>
            )
          }
          )}
      </div>




        <Grid item xs={12} className={classes.inputRow}>
          <form onSubmit={createMessage} className={classes.form}>
            <Grid
              container
              className={classes.newMessageRow}
              alignItems="flex-end"
            >
              <Grid item xs={11}>
                <TextField
                  id="message"
                  label="Send a Message"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  input="text"
                  value={newMessage}
                  onChange={(e) => setnewMessage(e.target.value)}
                />
              </Grid>
              <Grid item xs={1}>
                <Button type="submit" color="primary" variant="contained">
                  Send
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Paper>
    </div>
  )
};

export default Messages;