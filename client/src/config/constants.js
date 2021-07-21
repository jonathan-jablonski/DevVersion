/**
 *  This File will Contains all Constants Used in the whole
 *  Client Code In order to make it Cleaner
 */

// This is the config used in order to send
// our token with Axios requests
export const config = {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("jwt"),
  },
};

/**
 * EndPoints of the API used in the code
 */

// CreatePost Screen
export const CREATE_POST_URL = `/createpost`;

// Home Screen
export const ALL_POST_URL = `/allpost`;

// Login Screen
export const LOGIN_URL = `/signin`;

// NewPassword Screen
export const NEW_PWD_URL = `/newpassword`;

// Profile Screen
export const MY_POST_URL = `/mypost`;
export const MY_BOOKMARKS_URL = `/bookmarks`;

// ResetPassword Screen
export const RESET_PWD_URL = `/resetpassword`;

// SignUp Screen
export const SIGNUP_URL = `/signup`;

// SubscribePosts Screen
export const SUB_POST_URL = `/subscribeposts`;

//Message Screen
export const  CREATE_CONVERSATION_URL = `/conversations`
