import React from 'react';
import { NotificationContainer } from "react-notifications";
import { Switch, Route } from 'react-router-dom';
import NotFound from '../component/NotFound';
import {
  Meteor
} from 'meteor/meteor';
import Home from '../component/Home';
import Footer from '../component/Footer';
import Navbar from '../component/Navbar';
import Router from '../router';
import 'react-notifications/lib/notifications.css';

export default class AppLayout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
  }
  componentWillMount() {
    Meteor.subscribe('Gold')
    Meteor.subscribe('Silver')
  }
  render() {
    const style = {
   
      "margin-top": "100px"
    };
    return (
      <>
        <NotificationContainer />
        <Navbar />
        <main style={style}>{this.props.children}</main>
        <Footer />
      </>
    );
  }
}
