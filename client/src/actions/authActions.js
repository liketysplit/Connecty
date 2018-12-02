import axios from "axios";

import { SET_ERRORS } from "./types";

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
