
import React from 'react';
import { GoogleLogin } from 'react-google-login';
// refresh token
//import { refreshTokenSetup } from '../utils/refreshToken';

const clientId =
  '746742004572-doda3p06e7aqdsuiqff4lguet9ug8aiu.apps.googleusercontent.com';

const clientSecret = 'AJa2qzeHWvd68gTav5l4udT3';

function Login() {
  const onSuccess = (res) => {
    console.log('Login Success: currentUser:', res.profileObj);
    alert(
      `Logged in successfully welcome ${res.profileObj.name} 😍. \n See console for full profile object.`
    );
    //refreshTokenSetup(res);
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
    alert(
      `Failed to login. 😢 `
    );
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        clientSecret={clientSecret}
        buttonText="Google Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={true}
      />
    </div>
  );
}

export default Login;