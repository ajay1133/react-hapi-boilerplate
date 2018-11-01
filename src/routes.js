import React from 'react'
import { Route, Switch } from 'react-router'
import Loadable from 'react-loadable'
import Loading from  './components/Loading'

const Home = Loadable({
  loader: () => import('./containers/Home'),
  loading: Loading
});

const Dashboard = Loadable({
  loader: () => import('./containers/Dashboard'),
  loading: Loading
});

const routes = (
  <div>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
    </Switch>
  </div>
)

export default routes