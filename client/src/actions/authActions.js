import axios from "axios";

import jwt_decode from "jwt-decode";

import { SET_ERRORS, SET_CURRENT_USER } from "./types";

// Register User
export const registerUser = (userData, history) => dispatch => {
	axios
		.post("/api/users/register", userData)
		.then(res => {
			history.push("/login");

			// Redux Thunk will call the function below to dispatch the SET_ERRORS action to the reducers
			dispatch({
				type: SET_ERRORS,
				payload: {} // Clean up the "errors" state
			});
		})
		.catch(err =>
			// Redux Thunk will call the function below to dispatch the SET_ERRORS action to the reducers
			dispatch({
				type: SET_ERRORS,
				payload: err.response.data
			})
		);
};

// Login User - Get User Token
export const loginUser = userData => dispatch => {
	axios
		.post("/api/users/login", userData)
		.then(res => {
			const { token } = res.data;
			// Set token to local storage
			localStorage.setItem("jwtToken", token);
			// Set token to Authorization header
			setAuthToken(token);
			// Decode token to get user data
			const decoded = jwt_decode(token);
			// Set current user
			dispatch(setCurrentUser(decoded));
			// Clear the errors state
			dispatch({
				type: SET_ERRORS,
				payload: {}
			});
		})
		.catch(err =>
			dispatch({
				type: SET_ERRORS,
				payload: err.response.data
			})
		);
};

// Set Authorization header
export const setAuthToken = token => {
	if (token) {
		// Apply to every request
		axios.defaults.headers.common["Authorization"] = token;
	} else {
		// Delete auth header
		delete axios.defaults.headers.common["Authorization"];
	}
};

// Set logged in user
export const setCurrentUser = decoded => {
	return {
		type: SET_CURRENT_USER,
		payload: decoded
	};
};

// Current User - testing a private API endpoint
export const currentUser = userData => dispatch => {
	axios
		.get("/api/users/current", {})
		.then(res => {
			const pay = {
				...userData,
				email: res.data.email
			};
			dispatch({
				type: SET_CURRENT_USER,
				payload: pay
			});
		})
		.catch(err =>
			dispatch({
				type: SET_ERRORS,
				payload: err.response.data
			})
		);
};

// Log user out
export const logoutUser = () => dispatch => {
	// Remove token from localStorage
	localStorage.removeItem("jwtToken");
	// Remove auth header for future requests
	setAuthToken(false);
	// Set current user to {} which will set isAuthenticated to false
	dispatch(setCurrentUser({}));
};
