import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from "axios";
import { CTX } from './Store';
import { CREATE_CONVERSATION_URL, config, CREATE_MESSAGE_URL } from '../config/constants';
import io from "socket.io-client";

// Material UI styling
import { makeStyles, Paper } from '@material-ui/core';
import { TextField, Link, Divider, ListItemAvatar, Avatar } from '@material-ui/core';
import { List, ListItem, ListItemText, Grid, Button } from '@material-ui/core';




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
    width: '85%',
  },
  button: {
    width: '15%'
  },
  search: {
    width: '20%'
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
  const socket = useRef();

  //States
  const [searchUsers, setSearchUsers] = useState([]);
  const [activeConvos, setActiveConvos] = React.useState([])
  const [message, setMessage] = React.useState([]);
  const [newMessage, setnewMessage] = React.useState("")


//Pushes message from the array and uses socket io to emit  the message to all other clients
  useEffect(() => {
    socket.current = io("ws://devver.herokuapp.com/messages")
    socket.current.on('push', (data) => {
      console.log('Client side data', data);
      setMessage(message => [...message, data])
    });
  }, []);


  // Get messages
  useEffect(() => {
    const getMessage = async () => {
      try {
        const res = await axios.get(CREATE_MESSAGE_URL, config)
        setMessage(res.data)
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

  // Creates message in the db
  const createMessage = async (e) => {
    e.preventDefault();
    socket.current.emit('send message', {
      sender: socket.id,
      text: newMessage
    })

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
        setMessage([...message, receivedMessage.data])
        setnewMessage("")

      });
    } catch (err) {
      console.log('this is the error', err)
      console.log(err.msg)
    }
  };





  return (
    <div>
      <Paper className={classes.root}>
        {/* Renders the search when looking for someone */}
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
          {/* Returns Conversation array when clicked in search*/}
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


          {/* Returns message array */}
          <div className={classes.flex}>
            <div className={classes.chatBox}>
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
          </div>
        </div>

        {/* Creates the text message box and send button and functionally of creating the message when it send button is clicked */}
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