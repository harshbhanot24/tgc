import React from 'react';
import Modal from 'react-bootstrap-modal';
import { Scrollbars } from 'react-custom-scrollbars';
import './style.scss';
import 'react-bootstrap-modal/lib/css/rbm-patch.css';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openPrivacy: false
    }
    this.closeModal = this.closeModal.bind(this);
  }
  closeModal(){
    this.setState({openPrivacy: false})
  }
  render() {
    return (
      <div style={{clear:'both'}}>
        <footer className="footer">
          <div className="container">
              <p className="text-muted">
                  Copyright {new Date().getFullYear()} Texas Gold Card. All Rights Reserved.
                  <a data-toggle="modal" href="#privacy" onClick={()=>{
                      this.setState({openPrivacy: true})
                    }}>
                      Privacy Policy
                  </a>
                  &nbsp;| &nbsp;
                  <a href="/support">
                      Support
                  </a>
              </p>
          </div>
      </footer>
      <Modal
          show={this.state.openPrivacy}
          onHide={this.closeModal}
          aria-labelledby="PrivacyPolicy"
        >
          <Modal.Header closeButton>
            <Modal.Title>Texas Gold Card  Privacy Policy</Modal.Title>
          </Modal.Header>
        <Modal.Body style={{height:'70vh'}}>
          <Scrollbars style={{ flex: "1 1 0" }}>
            <h2 style={{margin:0}}>
              Privacy Policy
            </h2>
            <p>
            Texas Gold Card, LLC (the “Company”), is committed to maintaining robust privacy protections for our users. Our Privacy Policy (“Privacy Policy”) is designed to help you understand how we collect, use and safeguard the information you provide to us and to assist you in making informed decisions when using our Service. </p>
            <p>
            For purpose of this Agreement, “Service” refers to the Company’s service which can be accessed via our website at www.texasgoldcard.com  (the “Site”) in which users can submit purchase requests for gold, manage their Gold Card account(s), and otherwise transact with other Gold Card users. The terms “we,” “us,” and “our” refer to the Company. “You” refers to you, as a user of the Service. By accepting our Privacy Policy and Terms of Use, you consent to our collection, storage, use and disclosure of your personal information as described in this Privacy Policy. </p>
            <ol type="I">
                <li>INFORMATION WE COLLECT</li>
                <p>
                    We collect “Non-Personal Information” and “Personal Information.” Non-Personal Information includes information that cannot be used to personally identify you, such as anonymous usage date, general demographic data that we may collect, referring/exit pages and URLs, platform types, and preferences that are generated based on the data you submit. Personal Information includes your email, which you submit to us through the registration process at the Site, your Gold Card number, your account balances, the dates and amounts of your transactions, and the secondary party to your transactions. In addition to the information provided automatically by your browser when you visit the Site, to become a subscriber to the Service you will need to create a personal profile. You can create a profile by registering with the Service and entering your email address, and creating a password.  By registering, you are authorizing us to collect, store, and use your email address in accordance with this Privacy Policy. The use the Service thereafter, your Personal Information will be automatically uploaded to the Site in order to provide accurate and functioning Service.
                </p>
                <li>HOW WE USE AND SHARE INFORMATION</li>
                <p>
                    Non-Personal Information. In general, we use Non-Personal Information to help us improve the Service and customize the user experience. We also aggregate Non-Personal Information in order to track trends and analyze use patterns on the Site. This Privacy Policy does not limit in any way our use or disclosure of Non-Personal Information and we reserve the right to use and disclose such Non-Personal Information to our partners and other third parties at our discretion.
                Personal Information. We do not sell, trade, rent, or otherwise share for marketing purposes your Personal Information with third parties for any reason. We will establish security procedures to confirm your identity. You must take reasonable precautions to maintain the confidentiality of any passwords that you select or receive from us. </p>
                <li>HOW WE PROTECT INFORMATION</li>
                <p>
                We consider protecting the security of your Personal Information as very important. We have implemented commercially reasonable security procedures for our Service and to protect information submitted to us, both during transmission and once we receive it. No method of transmission over the Internet, or method of electronic storage, is 100% secure. Therefore, while we will strive to continue using commercially reasonable means to protect your Personal Information, we do not guarantee absolute security. We are not responsible for the unauthorized acts of others and we assume no liability for any disclosure of information due to errors in transmission, unauthorized third party access, other acts of third parties, or acts or omissions beyond our reasonable control.</p>
                <li>YOUR RIGHTS REGARDING THE USE OF YOUR PERSONAL INFORMATION</li>
                <p>You have the right at any time to prevent us from contacting you for marketing purposes. When we send a promotional communication to a user, the user can contact us and request to be taken off of our list for future promotional communications. Please note that notwithstanding the promotional preferences you have, we may continue to send you administrative emails including, for example, periodic updates to our Privacy Policy.</p>
                <li>LINKS TO OTHER WEBSITES</li>
                <p>As part of the Service, we may provide links to or compatibility with other websites or applications. However, we are not responsible for the privacy practices employed by those websites or the information or content they contain. This Privacy Policy applies solely to information collected to us through the Site and the Service. Therefore, this Privacy Policy does not apply to your use of a third party website accessed by selecting a link on our Site or via our Service. To the extent that you access or use the Service through or on another website or application, the privacy policy of that other website or application will apply only to your access or use of that site or application, not to our Site or Service. We encourage our users to read the privacy statements of other websites before proceeding to use them.</p>
                <li>CHANGES TO OUR PRIVACY POLICY</li>
                <p>The Company reserves the right to change this policy and our Terms of Use at any time. We will notify you of significant changes to our Privacy Policy by sending a notice to the primary email address specified in your account or by placing a prominent notice on our Site. All significant changes will go into effect 30 days following such notification. Non-material changes or clarifications will take effect immediately. You should periodically check the Site and this privacy page for updates.</p>
                <li>CONTACT US</li>
                <p>If you have any questions regarding this Privacy Policy or the practices of this Site, please contact us by sending an email to [contact@texasgoldcard.com].
                Last Updated: This Privacy Policy was last updated on 12/22/16</p>
                </ol>
              </Scrollbars>
            </Modal.Body>
        </Modal>
      </div>
    )
  }
}
