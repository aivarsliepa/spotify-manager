import React, { useEffect } from "react";

import { login } from "../../store/authSlice";
import { useAppDispatch } from "../../store/hooks";

const Shell: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const cookies = "; " + document.cookie;
    const parts = cookies.split("; x-jwt=");
    if (parts.length === 2) {
      const jwt = parts[1].split(";")[0];
      dispatch(login(jwt));
    }
  }, [dispatch]);

  return <div>{children}</div>;
};

export default Shell;
