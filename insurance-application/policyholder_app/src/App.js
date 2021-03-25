import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import User from './views/User'

export default () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={User} />
    </Switch>
  </BrowserRouter>
)