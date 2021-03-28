import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import User from './views/User'
import Admin from './views/Admin'

export default () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={User} />
      <Route path="/admin" component={Admin} />
    </Switch>
  </BrowserRouter>
)