import React, { useEffect } from "react";
import router from "next/router";

import { auth } from "../fire";
import { useAuthState } from "react-firebase-hooks/auth";

const privateRoute = (Component) => (props) => {
  const [user, loading] = useAuthState(auth);
  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading]);

  return (
    <div>
      <Component {...props} />
    </div>
  );
};

export default privateRoute;
