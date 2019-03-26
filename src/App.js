import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import SignIn from './components/sign-in/sign-in';
import Home from './components/home/home';
import Keys from './constants/keys';

import Cookies from 'universal-cookie';

const cookies = new Cookies();
class App extends Component {

  state = {
    isAuthenticate: false
  }
  
  componentWillMount() {
    const token = cookies.get(Keys.tokenKey);
    if (token) {
        this.setState({
          isAuthenticated: true
        });
    }
  }

  setAuthenticate = (isAuthenticated) => {
    this.setState({
      isAuthenticated: isAuthenticated
    })
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route 
              path="/signin" 
              render={() => <SignIn  setAuthenticate={this.setAuthenticate} isAuthenticated={this.state.isAuthenticated}/>}/>
            <Route 
              exact path="/"
              render={() => <Redirect to="/home" />} />
            <Route 
              path="/home"
              render={() => <Home isAuthenticated={this.state.isAuthenticated} setAuthenticate={this.setAuthenticate}/>} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
