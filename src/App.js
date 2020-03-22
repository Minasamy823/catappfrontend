import React from 'react';
import logo from './logo.svg';
import './App.css';
import Register from './components/register/register'
import Login from './components/login/login'
import Cats from './components/cats/catslist'
import Details from './components/cats/detail'
import {Route,Switch } from 'react-router-dom';


const Detail = ({match})=>(
        console.log('match', match) ||
        <Details id={match.params.id}/>
  )

function App() {
  return (
    <div>
      <Switch>
          <Route path="/login" exact component={Login}/>
          <Route path="/register" exact component={Register}/>
          <Route path="/:id" component={Detail}/>
          <Route path="*" exact component={Cats}/>
      </Switch>
    </div>
  );
}

export default App;
