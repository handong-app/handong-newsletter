import React from "react";
import GoogleButton from "react-google-button";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseApp } from "./firebase";

const googleProvider = new GoogleAuthProvider();

function Login() {
  const auth = getAuth(firebaseApp);
  return (
    <div className="Login">
      <GoogleButton
        className="g-btn"
        type="dark"
        onClick={() => {
          signInWithPopup(auth, googleProvider).then((res) => console.log(res));
        }}
      />
      <div className="small">
        구독 신청 및 구독 해제을 위해 로그인을 해주세요.
      </div>
    </div>
  );
}

export default Login;
