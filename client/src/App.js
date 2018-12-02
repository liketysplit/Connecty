import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";

import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

const middleware = [thunk];
const store = createStore(
	() => [], // empty store since no reducer created yet
	{},
	composeWithDevTools(applyMiddleware(...middleware))
);

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<BrowserRouter>
					<div className="App">
						<Navbar />
						<Switch>
							<Route path="/register" component={Register} />
							<Route path="/login" component={Login} />
							<Route path="/landing" component={Landing} />
							<Route exact path="/" component={Landing} />
						</Switch>
						<Footer />
					</div>
				</BrowserRouter>
			</Provider>
		);
	}
}

export default App;
