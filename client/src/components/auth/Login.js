import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import PropTypes from "prop-types";

class Login extends Component {
	constructor() {
		super();
		this.state = {
			email: "",
			password: "",
			errors: {}
		};

		this.onInputChange = this.onInputChange.bind(this);
		this.onFormSubmit = this.onFormSubmit.bind(this);
	}

	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.history.push("/landing");
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.auth.isAuthenticated) {
			this.props.history.push("/landing");
		}

		if (nextProps.errors) {
			this.setState({ errors: nextProps.errors });
		}
	}

	onFormSubmit(e) {
		e.preventDefault();

		const newUser = {
			email: this.state.email,
			password: this.state.password
		};

		this.props.loginUser(newUser);
	}

	onInputChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	render() {
		const { errors } = this.state;

		return (
			<div className="login">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<h1 className="display-4 text-center">Log In</h1>
							<p className="lead text-center">
								Sign in to your Connecty account
							</p>
							<form onSubmit={this.onFormSubmit}>
								<div className="form-group">
									<input
										type="email"
										className={classnames(
											"form-control form-control-lg",
											{
												"is-invalid": errors.email
											}
										)}
										placeholder="Email Address"
										name="email"
										value={this.state.email}
										onChange={this.onInputChange}
									/>
									{errors.email && (
										<div className="invalid-feedback">
											{errors.email}
										</div>
									)}
								</div>
								<div className="form-group">
									<input
										type="password"
										className={classnames(
											"form-control form-control-lg",
											{
												"is-invalid": errors.password
											}
										)}
										placeholder="Password"
										name="password"
										value={this.state.password}
										onChange={this.onInputChange}
									/>
									{errors.password && (
										<div className="invalid-feedback">
											{errors.password}
										</div>
									)}
								</div>
								<input
									type="submit"
									className="btn btn-info btn-block mt-4"
								/>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Login.propTypes = {
	loginUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(
	mapStateToProps,
	{ loginUser }
)(Login);
