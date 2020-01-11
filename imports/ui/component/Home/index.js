import React from 'react';
import { connect } from 'react-redux'
import {Link} from 'react-router-dom';
import { NotificationManager } from "react-notifications";
import { login } from '../../../actions/login';
import './style.scss';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }
  handleLogin(e) {
    e.preventDefault();
    const email = this.state.email;
    const password = this.state.password;
    this.props.login({
      email,
      password
    })
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.user.userId) {
      this.setState({
        email: '',
        password: ''
      })
    }
    const {error, errorMessage, inProgress} = nextProps.user;
    if(!this.props.error && error) {
      NotificationManager.error(errorMessage,'',2000);
    }
  }
  render() {
    return (
      <div className="home-container">
          <div className="jumbotron homejumbo">
            <div className="container text-center">
                <h2>Start Using Texas Gold Card</h2>
                <form className="navbar-form homesignin" role="form" onSubmit={this.handleLogin.bind(this)}>
                    <div className="input-group">
                        <span className="input-group-addon"><i className="fa fa-user"></i></span>
                        <input id="email" type="email" className="form-control" name="email" value={this.state.email} onChange={(e)=> this.setState({email:e.target.value})} placeholder="Email Address"/>
                    </div>
                    <div className="input-group">
                        <span className="input-group-addon"><i className="fa fa-lock"></i></span>
                        <input id="password" type="password" onChange={(e)=> this.setState({password:e.target.value})} className="form-control" name="password" value={this.state.password} placeholder="Password"/>
                    </div>
                    <br />
                    <br />
                    <button type="submit" className="btn btn-primary">Login</button> &nbsp;
                    <Link to="/register" className="btn btn-info">Register</Link>
              </form>

            </div>
            </div>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    user: state.user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    login: (data)=> {dispatch(login(data))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
