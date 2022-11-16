import * as React from 'react';
import { Route, Switch, Link  } from 'react-router-dom';
import logo from './logo.svg';
import Homepage from './pages/Homepage/Homepage';
import Search from './pages/Search/Search';
import Featured from './pages/Featured/Featured';
import NewReleases from './pages/NewReleases/NewReleases';
import Categories from './pages/Categories/Categories'; 
import * as RouteConstants from './constants/RouteConstants';
import { Counter } from './components/counter/Counter';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
		<nav>
		<ul>
			<li><Link to={RouteConstants.GENRES}>Categories(Genres)</Link></li>
			<li><Link to={RouteConstants.SINGLES}>Search</Link></li>
			<li><Link to={RouteConstants.FEATURED}>Featured</Link></li>
			<li><Link to={RouteConstants.NEW}>New</Link></li>
		</ul>	
		</nav>	
		<Homepage />
     </header>
		{/* kept counter for testing and diagnostics purposes, no need to show it in Nav area */}
		<Switch>
		<Route path={RouteConstants.LIKED}><Counter /></Route>
		<Route path={RouteConstants.GENRES}><Categories /></Route>
		<Route path={RouteConstants.SINGLES}><Search /></Route>
		<Route path={RouteConstants.FEATURED}><Featured /></Route>
		<Route path={RouteConstants.NEW}><NewReleases /></Route>
		</Switch>
    </div>
  );
}

export default App;
