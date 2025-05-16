import React from "react";
import { Router, Route, Routes, Navigate } from "react-router-dom";
import { Container } from "reactstrap";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Profile from "./views/Profile";
import PersonalView from "./views/Personal/PersonalView";
import "./App.css";
import history from "./utils/history";
import { getConfig } from "./config";
import initFontAwesome from "./utils/initFontAwesome";
import { Switch } from "react-router-dom/cjs/react-router-dom.min";

initFontAwesome();

const App = () => {
  const { isLoading, error, isAuthenticated } = useAuth0();

  if (error) {
    return <div className="alert alert-danger">Error: {error.message}</div>;
  }

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />
        <Container className="flex-grow-1 mt-5">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/personal" component={PersonalView} />
          </Switch>
        </Container>
        <Footer />
      </div>
    </Router>
  );
};

export default App;