import _ from "lodash";
import { SET_CURRENT_USER } from "../actions/types";

const initialState = {
	isAuthenticaed: false,
	user: {}
};

export default function(state = initialState, action) {
	switch (action.type) {
		// Deals with SET_CURRENT_USER actions here
		case SET_CURRENT_USER:
			return {
				...state,
				isAuthenticated: !_.isEmpty(action.payload),
				user: action.payload // action.payload contains user's data
			};
		default:
			return state;
	}
}
