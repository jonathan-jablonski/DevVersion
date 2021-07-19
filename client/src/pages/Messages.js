import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import Axios from "axios";
import { UserContext } from "../App";

import { makeStyles, Paper, } from '@material-ui/core';
import {  Button, TextField, Link, Divider, ListItemAvatar, Avatar } from '@material-ui/core';
import { List, ListItem, ListItemText } from '@material-ui/core'


import { CTX } from './Store'
import axios from 'axios';

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

  const [search, setSearch] = useState([]);
  const [activeChat, changeChat] = React.useState([])
  const [textValue, changeText] = React.useState('')



  useEffect(() => {
    const getConvo = async () => {
      console.log('hello world')
      try {
        const res = await axios.get("/convo")
        console.log("this is convo res", res)
        changeChat(res.data)
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
      Axios.post(URL, { pattern }, config).then((res) => {
        setSearch(res.data);
      });
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
            {search.user
              ? search.user.map((item) => {
                console.log(search.user)
                return (
                  <Link>
                    <Divider
                      variant="inset"
                      component="li"
                      style={{ marginLeft: "0px" }}
                    />
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          alt="Avatar"
                          src="/static/images/avatar/1.jpg"
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.Name}
                        secondary={<React.Fragment>{item.Email}</React.Fragment>}
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
            <List>
              {
                (
                  <ListItem button>
                    {activeChat.map((user) =>
                      <ListItemText key={user.id}>
                        {user}
                      </ListItemText>
                    )}
                  </ListItem>
                )
              }

            </List>
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