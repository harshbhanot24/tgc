import {
  Meteor
} from 'meteor/meteor';
import {
  Accounts
} from 'meteor/accounts-base';
import {
  Random
} from 'meteor/random';

Accounts.validateLoginAttempt(function(attempt) {
  if (attempt.user && attempt.user._id) {
    let lastLogin = Meteor.users.findOne({
      _id: attempt.user._id
    }).loginInformation || [];
    let loginObj;
    if (!lastLogin)
      lastLogin = [];
    if (Meteor.users.findOne({
        _id: attempt.user._id
      }).status)
      loginObj = Meteor.users.findOne({
        _id: attempt.user._id
      }).status.lastLogin;
    try {
      lastLogin.push(loginObj !== undefined ? loginObj : {
        date: new Date()
      });
    } catch (e) {
      lastLogin = [];
      lastLogin.push(loginObj !== undefined ? loginObj : {
        date: new Date()
      });
    }
    lastLogin = lastLogin.slice(-20); //max 20
    Meteor.users.update({
      _id: attempt.user._id
    }, {
      $set: {
        "loginInformation": lastLogin
      }
    })

    if (attempt.user && attempt.user.profile.admin === true) {
        return true;
    }
    if (attempt.user && attempt.user.profile.staff === true) {
        return "staff";
    }
    if (attempt.user && attempt.user.emails && !attempt.user.emails[0].verified) {
        if (attempt.error == undefined || attempt.error == null) {
            var token = Random.secret();
            var tokenRecord = {
                token: token,
                address: attempt.user.emails[0].address,
                when: new Date(),
            };
            Meteor.users.update({
                _id: attempt.user._id
            }, {
                $push: {
                    'services.email.verificationTokens': tokenRecord
                }
            }, function(err) {
                //Send an email containing this URL
                var url = Meteor.absoluteUrl() + 'verify/' + token;
                var html = 'Hello ,<br>Thank you for registering.<br>To confirm your registration, click on the link below. The link is valid upto 3 days.<br>Click Below Link to Confirm your Email <br><br>' + url + '<br>Thank you,<br>Texas Gold Card';
                html = Meteor.call('generateEmail',html);
                Meteor.call("sendEmail", "Texas Gold Card Email Verification", html, attempt.user.emails[0].address);
            });
            // Accounts.sendVerificationEmail(attempt.user._id, attempt.user.emails[0].address);
            throw new Meteor.Error(430, "Email Not Verified. Email has sent, please verify your email.");
        }
    }
  }
  return true;
});
