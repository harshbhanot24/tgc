import React from 'react';
import {
  Meteor
} from 'meteor/meteor';
import { NotificationContainer } from "react-notifications";
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withTracker } from 'meteor/react-meteor-data';
import { withRouter } from 'react-router'
import moment from 'moment';
import { logoutUser } from '../../../actions/login';
import { Profile } from '../../../collections/Profile';
import { Gold } from '../../../collections/Gold';
import { Silver } from '../../../collections/Silver';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.user && !nextProps.user) {
      nextProps.history.push('/');
      this.props.logoutUser();
    }
  }
  render() {
    const {location:{pathname}, user,gold,silver} = this.props;
    let email = '';
    let userId = '';
    if(user && user._id) {
      userId = user._id;
      email =  user.username;
    }
    const goldValue = gold?parseFloat(gold.data).toFixed(2):'';
    const silverValue = silver?parseFloat(silver.data).toFixed(2):'';
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation" id="navbar">
      	<div className="navbar-header">
      		<button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
      			<span className="sr-only">Toggle navigation</span>
      			<span className="icon-bar"></span>
      			<span className="icon-bar"></span>
      			<span className="icon-bar"></span>
      		</button>
      		<span style={{margin:0,padding:0}}><Link to="/"><img src="/img/logo43.png" className="img-circle" style={{marginLeft:'15px',marginTop:'5px'}} height="43" width="76"/></Link></span>

      	</div>
      	<div style={{marginLeft: '6%'}} className="collapse navbar-collapse navbar-ex1-collapse">
      		<ul className="nav navbar-nav">
      			<li><a href="#" title={gold?moment(gold.update).format('LLL'):''} className="bigSize">
              <h3 style={{margin: 0}}>
                {goldValue?'Gold: $'+goldValue+' | ':""}
                {silverValue?"Silver: $"+silverValue:""}
              </h3>
            </a></li>
      		</ul>
      			{userId ?
              <ul className="nav navbar-nav navbar-right" style={{marginRight: '10px'}}>
        				<li className={pathname === '/'?'active':''}><Link to="/">Overview</Link></li>
        				<li className={pathname === '/profile'?'active':''}><Link to="/profile">Profile</Link></li>
        				<li className={pathname === '/cards'?'active':''}><Link to="/cards">Cards</Link></li>
        				<li className={pathname === '/buy'?'active':''}><Link to="/buy">Buy Gold</Link></li>
        				<li className={pathname === '/send'?'active':''}><Link to="/send">Transfer</Link></li>
        				<li><Link to="/profile">{email}</Link></li>
                <li onClick={()=>{
                    this.props.logoutUser();
                  }}><Link to="/">LogOut</Link></li>
              </ul>
    				:
            <ul className="nav navbar-nav navbar-right" style={{marginRight: '10px'}}>
              <li style={{fontSize: '20px'}} className={pathname === '/login'?'active':''}>
                <Link to="/login">LogIn/Register</Link></li>
            </ul>
         }
      	</div>
      </nav>
    )
  }
}

const NavbarContainer = withTracker((props)=>{
  Meteor.subscribe('Gold')
  Meteor.subscribe('Silver')
  Meteor.subscribe('profile')
  return {
    gold: Gold.findOne(),
    silver: Silver.findOne(),
    profile: Profile.findOne(),
    user: Meteor.user()
  }
})(Navbar);

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: ()=> dispatch(logoutUser())
    // fetchPokemon: bindActionCreators(fetchPokemon, dispatch)
  }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavbarContainer))
