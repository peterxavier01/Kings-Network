import Link from "next/link";
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../fire";
import { useRouter } from "next/router";
import { useStateContext } from "../contexts/ContextProvider";

import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const { currentColor } = useStateContext();
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetFeedback, setResetFeedback] = useState("");
  const router = useRouter();

  let googleProvider = new GoogleAuthProvider();

  const handleInput = (event) => {
    let newInput = { [event.target.name]: event.target.value };
    setData({ ...data, ...newInput });
  };

  const googleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((response) => {
        router.push("/");
        return response;
      })
      .catch((err) => {
        return err;
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((response) => {
        router.push("/");
        return response;
      })
      .catch((err) => {
        if (err.code === "auth/wrong-password") {
          setError("Incorrect password inputted");
        } else if (err.code === "auth/internal-error") {
          setError("Please input a valid password");
        } else if (
          err.code === "auth/invalid-email" ||
          err.code === "auth/missing-email"
        ) {
          setError("Please input a valid email address");
        } else {
          setError("Please check if inputs were entered correctly");
        }
      });
  };

  const resetEmail = () => {
    sendPasswordResetEmail(auth, data.email)
      .then(() => {
        setResetFeedback("Please check your email for the password reset link");
      })
      .catch((error) => {
        if (error.code === "auth/missing-email") {
          setResetError("Please input your email");
        }
        console.log(error.code);
      });
  };

  return (
    <div className="signup flex flex-col justify-center items-center mb-4  min-h-screen md:min-h-[80vh] px-2">
      <form className="bg-white p-4 rounded-lg md:w-400 w-full">
        <h2 className="text-center font-semibold text-2xl md:text-4xl mb-4 text-gray-800">
          Login
        </h2>
        <div className="flex flex-col">
          <div className="flex flex-col items-center">
            <span
              onClick={googleSignIn}
              className="border mb-4 flex justify-center items-center p-2 rounded-full hover:drop-shadow-sm cursor-pointer"
            >
              <FcGoogle className="text-2xl" />
            </span>
            <div className="relative">
              <p className="lowercase text-sm">Or use your email account</p>
            </div>
          </div>
          <label
            htmlFor="name"
            className="pb-1 font-semibold text-sm md:text-base"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            autoFocus
            required
            className="border rounded-lg p-2 outline-none text-slate-800"
            name="email"
            onChange={(e) => handleInput(e)}
            placeholder="Enter Email"
          />
        </div>

        <div className="flex flex-col mb-3 mt-4">
          <label
            htmlFor="password"
            className="pb-1 font-semibold text-sm md:text-base"
          >
            Password
          </label>
          <input
            name="password"
            type="password"
            id="password"
            required
            className="border rounded-lg p-2 outline-none text-slate-800"
            onChange={(e) => handleInput(e)}
            placeholder="Enter Password"
          />
        </div>
        {error && <p className="errorMsg text-red-600 text-sm">{error}</p>}
        {resetError && (
          <p className="errorMsg text-red-600 text-sm">{resetError}</p>
        )}
        {(!error || !resetError) && resetFeedback && (
          <p className="errorMsg text-green-600 text-sm">{resetFeedback}</p>
        )}
        <div className="flex flex-col items-center">
          <>
            <button
              onClick={handleLogin}
              type="submit"
              className="text-white text-base px-5 py-3 rounded-lg mt-4 w-full"
              style={{ backgroundColor: currentColor }}
            >
              Login
            </button>
            <div className="flex justify-end w-full mt-2">
              <p className="text-sm md:text-base" onClick={resetEmail}>
                Forgot password?
              </p>
            </div>
            <p className="mt-3 md:text-base text-sm">
              Don't have an account?{" "}
              <Link href="/signup">
                <a style={{ color: currentColor }}>Sign up</a>
              </Link>
            </p>
          </>
        </div>
      </form>
    </div>
  );
};

export default Login;
