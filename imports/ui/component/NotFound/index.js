import React from 'react';
import './style.scss'
export default class NotFound extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (
      <div className="notfound-container">
          <div className="row">
              <div className="col-md-12">
                  <div className="error-template">
                      <h1>
                          Oops!</h1>
                      <h2>
                          404 Not Found</h2>
                      <div className="error-details">
                          Sorry, an error has occured, Requested page not found!
                      </div>
                      <div className="error-actions">
                          <a href="/" className="btn btn-primary btn-lg"><span className="glyphicon glyphicon-home"></span>
                              &nbsp;Take Me Home </a><a href="mailto:help@texasgoldcard.com" className="btn btn-default btn-lg"><span className="glyphicon glyphicon-envelope"></span> Contact Support </a>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    )
  }
}
