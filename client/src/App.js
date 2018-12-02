import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";

import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";

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
