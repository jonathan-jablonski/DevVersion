import Box from "@material-ui/core/Box";
// Material-UI Components
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";
import React, { useContext, useState } from "react";
import { GoogleLogin } from "react-google-login";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import Copyright from "../components/Copyight";
import { LOGIN_URL } from "../config/constants";

// const clientId =
//   "746742004572-o016idimfp27hv64fi9l452nh98lk711.apps.googleusercontent.com";
// General Styles
const useStyles = makeStyles((theme) => ({
  marginTop: "50px",
  Logo: {
    fontFamily: "Modesto, text",
    margin: "40px 0px",
  },
  paper: {
    marginTop: "50px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  image: {
    backgroundSize: "cover",
    backgroundColor: "499DCD",
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = () => {
  const { dispatch } = useContext(UserContext);

  const history = useHistory();
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formatValidation, setFormatValidation] = useState(false);
  const [authValidation, setAuthValidation] = useState(false);
  const clientId =
    "746742004572-o016idimfp27hv64fi9l452nh98lk711.apps.googleusercontent.com";

  const clientSecret = "dGX0jows4ngS8X-ZnHR9I_LH";
    const onSuccess = (res) => {
      axios.get(`/api/user/${res.profileObj.email}`).then((res) => {
        console.log("Login Success: currentUser:", res.profileObj);
        // alert(
        //   Logged in successfully welcome ${res.profileObj.name} :heart_eyes:. \n See console for full profile object.
        // );
        console.log(res);
        console.log("Login Success: currentUser:", res.profileObj);
        alert(
          `Logged in successfully welcome ${res.profileObj.name} :heart_eyes:. \n See console for full profile object.`
        );
        console.log(res);
        // getUserByEmail
        // if email doesnt exist, create
        //refreshTokenSetup(res);
        //refreshTokenSetup(res);
      });
  };

  const onFailure = (res) => {
    console.log("Login failed: res:", res);
    alert(`Failed to login. ???? `);
  };
  const PostData = () => {
    // the Regex email validation was taken from : https://emailregex.com/
    if (
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      axios
        .post(LOGIN_URL, { password, email })
        .then((res) => {
          console.log(res);
          const data = res.data;
          if (data.error) {
            setFormatValidation(false);
            setAuthValidation(true);
          } else {
            // we store our generated token in order to use it to access protected endpoints
            localStorage.setItem("jwt", data.token);
            // we also store the user details
            localStorage.setItem("user", JSON.stringify(data.user));
            dispatch({ type: "USER", payload: data.user });
            //we can show that success PopUp or not depends on dev choice
            //
            // we redirect the user to home page
            console.log(data.user);
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setAuthValidation(false);
      setFormatValidation(true);
    }
  };

  return (
    <Grid container>
      <Grid className={classes.image} item sm={4} md={6} />
      <Grid item xs={12} sm={8} md={6}>
        <Container
          component="main"
          maxWidth="xs"
          style={{ paddingBottom: "64px" }}
        >
          <CssBaseline />
          <div className={classes.paper}>
            <Typography
              className={classes.Logo}
              variant="h2"
              gutterBottom
              style={{ fontFamily: "Modesto, text " }}
            >
              DevVersion
            </Typography>
            {formatValidation ? (
              <Alert variant="outlined" severity="error">
                Invalid Email format ??? check it out!
              </Alert>
            ) : null}
            {authValidation ? (
              <Alert variant="outlined" severity="error">
                Invalid given Email/Password ??? check it out!
              </Alert>
            ) : null}
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={email !== "" && password !== "" ? false : true}
                onClick={() => PostData()}
              >
                Sign In
              </Button>
              <GoogleLogin
                clientId={clientId}
                clientSecret={clientSecret}
                buttonText="Google Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                // cookiePolicy={"single_host_origin"}
                style={{ marginTop: "100px" }}
                // isSignedIn={true}
              />

              <Grid container>
                <Grid item xs>
                  <Link to="/reset">Forgot password?</Link>
                </Grid>
                <Grid item>
                  <Link to="/signup">{"Don't have an account? Sign Up"}</Link>
                </Grid>
              </Grid>
            </form>
          </div>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
};

export default Login;