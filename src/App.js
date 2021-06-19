import React, { Component, createContext } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Teamactivity from './components/Teamactivity';
import Alldepartment from './components/Alldepartment';
import Department from './components/Department';
import User from './components/User';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Rfc from './components/Rfc';
import Detail from './components/Detail';
import ActivityImport from './components/ActivityImport';
import NotFound from './components/NotFound';
import Coustomer from './components/Coustomer';
import Order from './components/Order';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { checkLogin } from './components/ActivitiesGenericView';

class App extends Component {
  componentDidMount(props) {
    checkLogin();
  }

  render() {
    return (
      <Router>
        <div className="App">
          <div className="page-wrapper">
            <Header />
            <Sidebar />
            <Switch>
              {(localStorage.getItem('user_id') != 1) ?
                <Route exact path="/" component={Home} /> :
                <Route exact path="/" component={Dashboard} />
              }
              <Route exact path="/Coustomer" component={Coustomer} />
              <Route exact path="/Myactivity" component={Home} />
              <Route exact path="/Teamactivity" component={Teamactivity} />
              <Route path="/Alldepartment/:id" exact component={Alldepartment} />
              <Route path="/Alldepartment/" exact component={Alldepartment} />
              <Route exact path="/Department" component={Department} />
              <Route exact path="/User" component={User} />
              <Route exact path="/Dashboard" component={Dashboard} />
              <Route exact path="/Order" component={Order} />
              <Route exact path="/Detail" component={Detail} />
              <Route exact path="/importactivity" component={ActivityImport} />
              <Route exact path="*" component={NotFound} />
            </Switch>
            <Footer />
          </div>
        </div>
      </Router>
    )
  };
}

export default App;
