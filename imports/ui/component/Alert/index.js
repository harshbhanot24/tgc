import React from 'react';
import './style.scss';


export default class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (
      <div className="container">
        <div className="row">
            <div className="col-sm-12">
                <div className={"alert-message alert-message-"+this.props.type}>
                    <h4>{this.props.title}</h4>
                    <p>{this.props.message}</p>
                </div>
            </div>
        </div>
      </div>
    )
  }
}
