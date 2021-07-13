import React, { useEffect, createContext, useReducer, useContext } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import { reducer, initialState } from "./reducers/userReducer";
import NavBar from "./components/Navbar";
import Home from "./pages/Home";
import GoogleLogin from "./pages/GoogleLogin";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreatePost from "./pages/CreatePost.js";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import SubscribePost from "./pages/SubscribePosts";
import Reset from "./pages/ResetPassword.js";
import NewPass from "./pages/NewPassword.js";
import "./App.css";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("USER: ", user);
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      if (!history.location.pathname.startsWith("/reset"))
        history.push("/login");
    }
  }, []);
  return (
    <Switch>
      <Route exact path="/">
        <NavBar nav="home" />
        <SubscribePost />
      </Route>
      <Route path="/explore">
        <NavBar nav="explore" />
        <Home />
      </Route>
      <Route path="/create">
        <NavBar nav="add post" />
        <CreatePost />
      </Route>
      <Route exact path="/profile">
        <NavBar nav="profile" />
        <Profile />
      </Route>
      <Route path="/profile/:userid">
        <NavBar />
        <UserProfile />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/googlelogin">
        <GoogleLogin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/reset">
        <Reset />
      </Route>
      <Route path="/reset/:token">
        <NewPass />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
