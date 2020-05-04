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
    const style= {
    "margin-top": "100px"
}
    return (
      <>
        <NotificationContainer />
        <Navbar />
        <Sidebar />
        <main style={style}>{this.props.children}</main>
        <div>
          <Footer />
        </div>
      </>
    );
  }
}
