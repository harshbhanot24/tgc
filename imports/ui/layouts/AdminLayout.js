import React from 'react';
import { NotificationContainer } from "react-notifications";
import { Switch, Route } from 'react-router-dom';
import NotFound from '../component/NotFound';
import {
  Meteor
} from 'meteor/meteor';
import Home from '../component/Home';
import Navbar from '../component/AdminNavbar'
import Sidebar from '../component/AdminSidebar'
import Footer from '../component/Footer';
import Router from '../router';
import 'react-notifications/lib/notifications.css';
import '../style.css'
import '../custom.css'
import 'bootstrap3/dist/js/bootstrap.min';

export default class AdminLayout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
  }
  componentWillMount() {
    Meteor.subscribe('Gold')
    Meteor.subscribe('Silver')
    Meteor.subscribe('extraSpot')
  }
  render() {
    return (
      <div>
        <NotificationContainer />
        <Navbar />
        <Sidebar />
        <main style={{paddingTop: '60px', marginLeft: '222px'}}>
          {this.props.children}
        </main>
        <div style={{marginLeft:'182px'}}>
          <Footer />
        </div>
      </div>
    )
  }
}
