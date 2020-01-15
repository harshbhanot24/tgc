import React from 'react';
import Modal from 'react-bootstrap-modal';
import { Scrollbars } from 'react-custom-scrollbars';
import './style.scss';
import 'react-bootstrap-modal/lib/css/rbm-patch.css';
import { Link } from "react-router-dom";
export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openPrivacy: false
    }
  }
  render() {
    return (
      <div className="kt-footer kt-grid__item kt-grid kt-grid--desktop kt-grid--ver-desktop">
        <div className="kt-footer__copyright">
          2020&nbsp;&copy;&nbsp;
          <a href="" target="_blank" className="kt-link">
            Texas Gold Card. All Rights Reserved
          </a>
        </div>
        <div className="kt-footer__menu">
          <a
            data-toggle="modal"
            href="/privacy"
            
            className="kt-footer__menu-link kt-link"
             >
            Privacy Policy
          </a>
          <Link
            to="/support"
            target="_blank"
            className="kt-footer__menu-link kt-link"
          >
            Support
          </Link>
        </div>

     </div>
    );
  }

}