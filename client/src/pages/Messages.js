import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles, Paper, } from '@material-ui/core';
import { Button, TextField, Link, Divider, ListItemAvatar, Avatar } from '@material-ui/core';
import { List, ListItem, ListItemText } from '@material-ui/core'
import { CTX } from './Store'
import { CREATE_CONVERSATION_URL, config } from '../config/constants';


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
  },
  searchresult: {
    width: '10%'
  }
}))





const Messages = () => {

  const classes = useStyles();
  const { user } = useContext(CTX);

  const [searchUsers, setSearchUsers] = useState([]);
  const [activeConvos, setActiveConvos] = React.useState([])
  const [textValue, setTextValue] = React.useState('')

  console.log(searchUsers)

  useEffect(() => {
    const getConvo = async () => {
      try {
        const res = await axios.get(CREATE_CONVERSATION_URL, config)
        console.log("this is convo res", res.data)
        setActiveConvos(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getConvo();
  }, []);


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

  const createConvo = async (userTwo) => {
    try {
      const foundConvo = activeConvos.filter((convo) => 
        convo.userTwo._id === userTwo._id
      )
      console.log(foundConvo)
      if(foundConvo.length != 0 ){
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
                          src="/static/images/avatar/1.jpg"
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
        <div className={classes.flex}>
          <TextField
            className={classes.chatBox}
            id="outlined-required"
            label="Type here!"
            value={textValue}
            onChange={e => setTextValue(e.target.value)}
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