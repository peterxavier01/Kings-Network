import { useRouter } from "next/router";
import Link from "next/link";
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../fire";
import { useStateContext } from "../contexts/ContextProvider";

import { FcGoogle } from "react-icons/fc";

const Signup = () => {
  const { currentColor } = useStateContext();
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInput = (event) => {
    let newInput = { [event.target.name]: event.target.value };
    setData({ ...data, ...newInput });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((response) => {
        sessionStorage.setItem(
          "Auth Token",
          response._tokenResponse.refreshToken
        );
        router.push("/login");
      })
      .catch((err) => {
        if (err.code === "auth/email-already-in-use") {
          setError("Email Already in Use");
        } else if (err.code === "auth/weak-password") {
          setError("Password should be at least six characters long");
        } else {
          setError("Please check if inputs were entered correctly");
        }
      });
  };

  let googleProvider = new GoogleAuthProvider();

  const googleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((response) => {
        router.push("/home");
        return response;
      })
      .catch((err) => {
        return err;
      });
  };

  return (
    <div className="signup mb-4 flex flex-col justify-center items-center min-h-[50vh] md:min-h-[80vh] px-2">
      <form className="bg-white p-4 rounded-lg md:w-400 w-full">
        <h2 className="text-center font-semibold text-2xl md:text-4xl mb-4 text-gray-800">
          Sign up
        </h2>
        <div className="flex flex-col justify-center items-center">
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
        <div className="flex flex-col mb-4">
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

        <div className="flex flex-col mb-3">
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
        <div className="flex flex-col items-center">
          <>
            <button
              onClick={handleSignup}
              type="submit"
              className="text-white text-base px-5 py-3 rounded-lg mt-4 w-full"
              style={{ backgroundColor: currentColor }}
            >
              Sign up
            </button>
            <p className="mt-3 text-base">
              Have an account?{" "}
              <Link href="/login">
                <a style={{ color: currentColor }}>Sign in</a>
              </Link>
            </p>
          </>
        </div>
      </form>
    </div>
  );
};

export default Signup;
