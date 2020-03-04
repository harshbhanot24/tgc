import {
  Meteor
} from 'meteor/meteor';
import {
  Random
} from 'meteor/random';
import SparkPost from 'sparkpost';
import {
  Accounts
} from 'meteor/accounts-base';
import {
  Profile
} from '../../collections/Profile'
import {
  Money
} from '../../collections/Money';

Meteor.methods({
  sendResetEmail: function(email, req) {
    let exist = Meteor.users.findOne({
      username: email
    });
    //not exist
    if (exist == undefined) throw new Meteor.Error(400, "User Not Found");
    // if user is admin or staff
    if (req == "manage") {
      if (exist.profile.admin === undefined && exist.profile.staff === undefined) throw new Meteor.Error(400, "User Not Found");
    }
    try {
      this.unblock();
      Accounts.sendResetPasswordEmail(Meteor.users.findOne({
        username: email
      })._id, email);
      return true;
    } catch (e) {
      throw new Meteor.Error(400, e.message);
    }
  },
  sendEmail: function(subject, html, address, ufrom, name, replyto) {
    var sp = new SparkPost(Meteor.settings.private.smtpkey);
    if (ufrom == undefined) ufrom = "no-reply@texasgoldcard.com";
    if (name == undefined) name = "Texas Gold Card";
    if (replyto == undefined) replyto = "no-reply@texasgoldcard.com";
    sp.transmissions.send({
      transmissionBody: {
        content: {
          from: {
            'name': name,
            'email': ufrom
          },
          subject: subject,
          reply_to: replyto,
          html: html
        },
        recipients: [{
          address: address
        }]
      }
    }, function(err, res) {
      if (err) {
        return false;
      } else {
        return true;
      }
    });
  },
  sendVerificationEmail: function(email) {
    exist = Meteor.users.findOne({
      username: email
    });
    if (exist == undefined) throw new Meteor.Error(400, "User Not Found");
    try {
      this.unblock();
      var token = Random.secret();
      var tokenRecord = {
        token: token,
        address: email,
        when: new Date(),
      };
      //Save the user
      Meteor.users.update({
        _id: exist._id
      }, {
        $push: {
          'services.email.verificationTokens': tokenRecord
        }
      }, function(err) {
        //Send an email containing this URL
        var url = Meteor.absoluteUrl() + 'verify/' + token;
        var html = 'Hello ,<br>Thank you for registering.<br>To confirm your registration, click on the link below. The link is valid upto 3 days.<br>Click Below Link to Confirm your Email <br><br>' + url + '<br>Thank you,<br>Texas Gold Card';
        html = Meteor.call('generateEmail', html);
        Meteor.call("sendEmail", "Texas Gold Card Email Verification", html, email);
        //Send using SendGrid, Mandrill, MailGun etc
      });
      // Accounts.sendVerificationEmail(exist._id, email);
      return true;
    } catch (e) {
      throw new Meteor.Error(400, e.message);
    }
  },
  generateEmail: (html) => {
    var content = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml"><head><!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>Template Base</title> <style type="text/css" id="media-query"> body{margin: 0; padding: 0;}table, tr, td{vertical-align: top; border-collapse: collapse;}.ie-browser table, .mso-container table{table-layout: fixed;}*{line-height: inherit;}a[x-apple-data-detectors=true]{color: inherit !important; text-decoration: none !important;}[owa] .img-container div, [owa] .img-container button{display: block !important;}[owa] .fullwidth button{width: 100% !important;}.ie-browser .col, [owa] .block-grid .col{display: table-cell; float: none !important; vertical-align: top;}.ie-browser .num12, .ie-browser .block-grid, [owa] .num12, [owa] .block-grid{width: 500px !important;}.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height: 100%;}.ie-browser .mixed-two-up .num4, [owa] .mixed-two-up .num4{width: 164px !important;}.ie-browser .mixed-two-up .num8, [owa] .mixed-two-up .num8{width: 328px !important;}.ie-browser .block-grid.two-up .col, [owa] .block-grid.two-up .col{width: 250px !important;}.ie-browser .block-grid.three-up .col, [owa] .block-grid.three-up .col{width: 166px !important;}.ie-browser .block-grid.four-up .col, [owa] .block-grid.four-up .col{width: 125px !important;}.ie-browser .block-grid.five-up .col, [owa] .block-grid.five-up .col{width: 100px !important;}.ie-browser .block-grid.six-up .col, [owa] .block-grid.six-up .col{width: 83px !important;}.ie-browser .block-grid.seven-up .col, [owa] .block-grid.seven-up .col{width: 71px !important;}.ie-browser .block-grid.eight-up .col, [owa] .block-grid.eight-up .col{width: 62px !important;}.ie-browser .block-grid.nine-up .col, [owa] .block-grid.nine-up .col{width: 55px !important;}.ie-browser .block-grid.ten-up .col, [owa] .block-grid.ten-up .col{width: 50px !important;}.ie-browser .block-grid.eleven-up .col, [owa] .block-grid.eleven-up .col{width: 45px !important;}.ie-browser .block-grid.twelve-up .col, [owa] .block-grid.twelve-up .col{width: 41px !important;}@media only screen and (min-width: 520px){.block-grid{width: 500px !important;}.block-grid .col{display: table-cell; Float: none !important; vertical-align: top;}.block-grid .col.num12{width: 500px !important;}.block-grid.mixed-two-up .col.num4{width: 164px !important;}.block-grid.mixed-two-up .col.num8{width: 328px !important;}.block-grid.two-up .col{width: 250px !important;}.block-grid.three-up .col{width: 166px !important;}.block-grid.four-up .col{width: 125px !important;}.block-grid.five-up .col{width: 100px !important;}.block-grid.six-up .col{width: 83px !important;}.block-grid.seven-up .col{width: 71px !important;}.block-grid.eight-up .col{width: 62px !important;}.block-grid.nine-up .col{width: 55px !important;}.block-grid.ten-up .col{width: 50px !important;}.block-grid.eleven-up .col{width: 45px !important;}.block-grid.twelve-up .col{width: 41px !important;}}@media (max-width: 520px){.block-grid, .col{min-width: 320px !important; max-width: 100% !important;}.block-grid{width: calc(100% - 40px) !important;}.col{width: 100% !important;}.col > div{margin: 0 auto;}img.fullwidth{max-width: 100% !important;}}</style></head><!--[if mso]><body class="mso-container" style="background-color:#FFFFFF;"><![endif]--><body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #FFFFFF"> <div class="nl-container" style="min-width: 320px;Margin: 0 auto;background-color: #FFFFFF"> <div style="background-color:#2C2D37;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 500px;width: 500px;width: calc(19000% - 98300px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid two-up"> <div style="border-collapse: collapse;display: table;width: 100%;"> <div class="col num6" style="Float: left;max-width: 320px;min-width: 250px;width: 250px;width: calc(35250px - 7000%);background-color: transparent;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:20px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"> <div align="center" class="img-container center" style="padding-right: 0px; padding-left: 0px;"> <a href="https://beefree.io" target="_blank"> <img class="center" align="center" border="0" src="http://www.texasgoldcard.com/assets/images/logo_dark.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 126px" width="126"> </a></div></div></div></div><div class="col num6" style="Float: left;max-width: 320px;min-width: 250px;width: 250px;width: calc(35250px - 7000%);background-color: transparent;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:20px; padding-bottom:20px; padding-right: 0px; padding-left: 0px;"> <div style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><div style="font-size:12px;line-height:18px;color:#6E6F7A;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 18px"><span style="font-size: 20px; line-height: 30px;"><strong>Texas Gold Card</strong></span></p></div></div></div></div></div></div></div></div><div style="background-color:#04050a;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 500px;width: 500px;width: calc(19000% - 98300px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "> <div style="border-collapse: collapse;display: table;width: 100%;"> <div class="col num12" style="min-width: 320px;max-width: 500px;width: 500px;width: calc(18000% - 89500px);background-color: transparent;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:30px; padding-bottom:30px; padding-right: 0px; padding-left: 0px;"> <div style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 20px;"><div style="font-size:12px;line-height:18px;color:#FFFFFF;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;text-align:left;"><span style="color:#FFFFFF;"> ${html} </span></div></div><div style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"> <div align="center"><div style="border-top: 0px solid transparent; width:100%;">&nbsp;</div></div></div></div></div></div></div></div></div><div style="background-color:#ffffff;"> <div style="Margin: 0 auto;min-width: 320px;max-width: 500px;width: 500px;width: calc(19000% - 98300px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid "> <div style="border-collapse: collapse;display: table;width: 100%;"> <div class="col num12" style="min-width: 320px;max-width: 500px;width: 500px;width: calc(18000% - 89500px);background-color: transparent;"> <div style="background-color: transparent; width: 100% !important;"> <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:30px; padding-bottom:30px; padding-right: 0px; padding-left: 0px;"> <div style="padding-right: 10px; padding-left: 10px; padding-top: 15px; padding-bottom: 10px;"><div style="font-size:12px;line-height:18px;color:#959595;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 18px">Please do not reply to this email. If you want any help visit our <a style="color:#C7702E;text-decoration: underline;" title="Support" href="http://secure.texasgoldcard.com/support" target="_blank" rel="noopener noreferrer">support</a>.</p></div><div style="font-size:12px;line-height:18px;color:#959595;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 18px">Â© 2017 Texas Gold Card. All Rights Reserved.</p></div></div></div></div></div></div></div></div></div></body></html>`;
    return content;
  },
  emailSupport: function(from, subject, text) {
    var html = Meteor.call('generateEmail', text.replace(/\n/g, "<br />"));
    Meteor.call("sendEmail", subject, html, "contact@texasgoldcard.com", from);
    return true;
  },
  logoutAll: () => {
    Meteor.users.update({
      _id: Meteor.userId()
    }, {
      $set: {
        "services.resume.loginTokens": []
      }
    });
  },
  getTodaySignUp: function() {
    let totalsignup = 0;
    let signUp = Profile.find({
      $and: [{
        createdAt: {
          $lt: new Date()
        }
      }, {
        createdAt: {
          $gt: new Date(new Date() - 24 * 60 * 60 * 1000)
        }
      }]
    }).fetch();
    return signUp.length;
  },
  getHouseTJ: function(membership) {
    let tjHouseid = Meteor.users.findOne({
      username: Meteor.settings.private.houseTjEmail
    })._id;
    let money = Money.findOne({
      userId: tjHouseid
    });
    let gold = money? money.gold || 0 : 0;
    return parseFloat(gold);
  },
})
