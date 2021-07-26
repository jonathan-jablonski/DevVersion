/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "../App";
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: 500,
		margin: "20px auto",
		"& .MuiTextField-root": {
			width: "100%",
		},
		"& .MuiOutlinedInput-multiline": {
			paddingTop: "8px",
			paddingBottom: "8px",
			marginTop: "5px",
			marginLeft: "5px",
			marginRight: "5px",
		},
		"& .MuiCardContent-root:last-child": {
			paddingBottom: "10px",
		},
		"& .MuiDivider-middle": {
			marginBottom: "4px",
		},
		"& .MuiListItem-root": {
			padding: "0px 16px",
		},
		"& .MuiCardContent-root": {
			paddingTop: "0px",
			paddingBottom: "5px",
		},
		"& .MuiIconButton-root:focus": {
			backgroundColor: "rgba(0, 0, 0, 0)",
		},
	},
	header: {
		padding: "10px",
	},
	media: {
		//height: 0,
		paddingTop: "56.25%", // 16:9
		height: "max-content",
	},
	likeBar: {
		height: "25px",
		paddingTop: "0px",
		marginTop: "8px",
		marginLeft: "2px",
		paddingLeft: "0px",
		paddingBottom: "4px",
	},
	comments: {
		display: "flex",
		paddingTop: "0px",
		paddingLeft: "12px",
		paddingRight: "0px",
	},
	comment_item_see_more: {
		width: "35%",
		cursor: "pointer",
	},
	comments_icon_see_more: {
		height: "17px",
		width: "17px",
		paddingTop: "4px",
		paddingBottom: "3px",
	},
	comments_icon: {
		height: "30px",
		paddingLeft: "0px",
		paddingTop: "13px",
		paddingRight: "8px",
		paddingBottom: "0px",
	},
	inline: {
		display: "inline",
		fontWeight: "600",
	},
	avatar: {
		height: "40px",
	},
	links: {
    textDecoration: "none",
	},
}));

const dummyGithubUsers = [
  {
    id: 1,
    name: "Vincent Vo",
    username: "itsvnvo1",
    email: "itsvnvo1@gmail.com",
    ghprofile: "itsvnvo"
  },
  {
    id: 2,
    name: "Jonathan Jablonski",
    username: "jonathan-jablonski",
    email: "jonathanjablonski94@gmail.com",
    ghprofile: "jonathan-jablonski"
  },
    {
    id: 3,
    name: "Cigi Tipton",
    username: "mirrorlessmind",
    email: "mirrorlessmind@gmail.com",
    ghprofile: "mirrorlessmind"
  }
];

const ghProfileLink = () =>  {
  dummyGithubUsers.forEach(element => {
    const ghProfile = element;
    console.log(ghProfile);
    ghProfile.href(`https://github.com/${ghProfile}`);
  });
};

export default function GHSearch() {
  const style = useStyles();
  const { state, dispatch } = useContext(UserContext);
  const [data, setData] = useState([]);
  const fixedOptions = [dummyGithubUsers];
  const [value, setValue] = React.useState([...fixedOptions, dummyGithubUsers]);

  return (
    <Autocomplete
      multiple
      id="fixed-tags-demo"
      value={value.username}
      onChange={(event, newValue) => {
        setValue([
          ...fixedOptions,
          ...newValue.filter((option) => fixedOptions.indexOf(option) === -1),
        ]);
      }}
      options={dummyGithubUsers}
      getOptionLabel={(option) => option.username}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            label={option.username}
            href={`https://github.com/${dummyGithubUsers.ghProfile}`}
            {...getTagProps({ index })}
            disabled={fixedOptions.indexOf(option) !== -1} 
            clickable='true'
            >
          </Chip> 
          
        ))
      }
      // style={style}
      renderInput={(params) => (
        <TextField {...params} 
		hiddenLabel="GitHub User Profile Search" 
		variant="outlined" 
		placeholder="Search for GitHub Usernames" 
		style={{padding: "60px", paddingLeft: "0%", paddingRight:"0%"}}
		/>
      )}
    />
  );
}
