const initialState = {
	isAuthenticaed: false,
	user: {}
};

export default function(state = initialState, action) {
	switch (action.type) {
		// Will deal with SET_CURRENT_USER actions later

		default:
			return state;
	}
}
