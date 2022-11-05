import * as React from 'react';
import { BrowserRouter, Route, Switch, Link  } from 'react-router-dom';
import logo from './logo.svg';
import Homepage from './pages/Homepage/Homepage';
import Search from './pages/Search/Search';
import * as RouteConstants from './constants/RouteConstants';
import { Counter } from './components/counter/Counter';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
	  <BrowserRouter>
        <img src={logo} className="App-logo" alt="logo" />
		<nav>
		<ul>
			<li><Link to={RouteConstants.NEW}>Counter</Link></li>
			<li><Link to={RouteConstants.SINGLES}>Search</Link></li>
		</ul>	
		</nav>	
		<Homepage />
		<Switch>
		<Route path={RouteConstants.NEW}><Counter /></Route>
		<Route path={RouteConstants.SINGLES}><Search /></Route>
		</Switch>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <span>
          <span>Learn </span>
          <a
            className="App-link"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux-toolkit.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://react-redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
        </span>
		</BrowserRouter>
      </header>
    </div>
  );
}

export default App;
