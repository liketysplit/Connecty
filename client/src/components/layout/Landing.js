import React, { Component } from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { currentUser } from "../../actions/authActions";

class Landing extends Component {
	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.currentUser(this.props.auth.user);
		}
	}

	render() {
		const guestPage = (
			<div className="col-md-12 text-center">
				<h1 className="display-3 mb-4">Connecty</h1>
				<p className="lead">
					{" "}
					Create a developer profile/portfolio, share posts and get
					help from other developers
				</p>
				<hr />
				<Link to="/register" className="btn btn-lg btn-info mr-2">
					Sign Up
				</Link>
				<Link to="/login" className="btn btn-lg btn-info mr-2">
					Log in
				</Link>
			</div>
		);
		const authPage = (
			<div className="col-md-12 text-center">
				<h1 className="display-3 mb-4">Welcome</h1>
				<p className="lead"> {this.props.auth.user.name}</p>
				<hr />
			</div>
		);

		return (
			<div className="landing">
				<div className="dark-overlay landing-inner text-light">
					<div className="container">
						<div className="row">
							{this.props.auth.isAuthenticated
								? authPage
								: guestPage}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(
	mapStateToProps,
	{ currentUser }
)(Landing);
