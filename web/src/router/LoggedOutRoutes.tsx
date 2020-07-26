import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Index from "../pages/index/Index";

const LoggedOutRoutes: React.FC = () => (
  <Switch>
    <Route exact path="/" component={Index} />
    <Redirect to="/" />
  </Switch>
);

export default LoggedOutRoutes;
