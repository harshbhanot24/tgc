import {
  Meteor
} from 'meteor/meteor';
import SHA256 from 'crypto-js/sha256';
import {
  Accounts
} from 'meteor/accounts-base';
import AES from 'crypto-js/aes';
import sharp from 'sharp';
import {
  Profile
} from '../../collections/Profile'
import {
  Money
} from '../../collections/Money'
import {
  RecentTransferUser
} from '../../collections/RecentTransferUser'
import {
  Transaction
} from '../../collections/Transaction'
import {
  ExtraSpot
} from '../../collections/ExtraSpot'

Meteor.methods({
  registerNewUser: function(email, passwd, merchantRequest = false) {
    const membership = "gold";
    const pString = SHA256(passwd).toString();
    const createdAt = new Date();
    userId = Accounts.createUser({
      username: email,
      email: email,
      password: passwd,
      profile: {
        createdAt,
      },
      loginInformation: [{
        date: createdAt
      }]
    });
    const keyload = SHA256(userId + createdAt.getTime()).toString();
    Money.insert({
      userId: userId,
      createdAt: new Date(),
      tj: 0.00000,
      gold: 0,
      tjsend: 0,
      tjrecieved: 0,
      cards: 0,
      container: [{
        name: "gold",
        val: 0
      }],
      redeem: 0,
      resetPinToken: null,
      PIN: SHA256(new Date() + Meteor.userId()).toString(),
      feesTime: new Date()
    });
    // MoneyS.insert({
    //   userId: userId,
    //   createdAt: new Date(),
    //   tj: 0.00000,
    //   gold: 0,
    //   tjsend: 0,
    //   tjrecieved: 0,
    //   container: [{
    //     name: "silver",
    //     val: 0
    //   }],
    // });
    Profile.insert({
      userId: userId,
      membership: membership,
      both: false,
      createdAt: new Date(),
      fullname: null,
      address: null,
      phone: null,
      subscribe: false,
      lastSent: null,
      img: "/img/user.png",
      email: email,
      resetEmailSent: false,
      merchant: false,
      merchantRequest: merchantRequest,
      merchantRequestTime: merchantRequest ? new Date() : '',
      merchantFee: 0,
      profilePasswd: [pString],
      key: keyload,
      loginToken:null
    });
    RecentTransferUser.insert({
      userId: userId,
      recent: []
    });
    //set Card number
    card = "";
    for (;;) {
      Tcard = (Math.random() + ' ').substring(2, 5) + (Math.random() + ' ').substring(2, 5);
      card = Tcard.substring(0, 2) + "-" + Tcard.substring(2, 6);
      if (Money.findOne({
          cards: card
        }) === undefined) {
        Money.update({
          userId: userId
        }, {
          $set: {
            cards: card
          }
        });
        break;
      }
    }
    if (userId) {
      Meteor.call('sendVerificationEmail', email);
    }
    return userId;
  },
  getTodayTJSent: function() {
    totaltj = 0;
    tjsent = Transaction.find({
      $and: [{
        Date: {
          $lte: new Date()
        }
      }, {
        Date: {
          $gte: new Date(new Date() - 24 * 60 * 60 * 1000)
        }
      }, {
        From: Meteor.userId()
      }]
    }).fetch(); //fetch all records of transaction within 24 hours
    for (i = 0; i < tjsent.length; i++) {
      totaltj = parseFloat(totaltj) + parseFloat(tjsent[i].TJTransfer);
    }
    return totaltj.toFixed(5);
  },
  getTodayTJRecieve: function() {
    totaltj = 0;
    tjr = Transaction.find({
      $and: [{
        Date: {
          $lt: new Date()
        }
      }, {
        Date: {
          $gt: new Date(new Date() - 24 * 60 * 60 * 1000)
        }
      }, {
        To: Meteor.userId()
      }]
    }).fetch(); //fetch all records of transaction within 24 hours
    for (i = 0; i < tjr.length; i++) {
      totaltj = parseFloat(totaltj) + parseFloat(tjr[i].TJTransfer);
    }
    return totaltj.toFixed(5);
  },
  checkPassword: function(passwd) {
    check(passwd, String);
    if (Meteor.userId()) {
      let user = Meteor.user();
      let result = Accounts._checkPassword(user, passwd);
      return !result.error;
    } else {
      return false;
    }
  },
  resetPin: function(token, pin) {
    // mem = Profile.findOne({
    //   userId: Meteor.userId()
    // }).membership[0].toLowerCase();
    MoneyO = Money;
    // if (mem == "s") MoneyO = MoneyS;
    // cToken = Money.findOne({userId:Meteor.userId()}).resetPinToken;
    if (token == null) {
      MoneyO.update({
        userId: Meteor.userId()
      }, {
        $set: {
          PIN: SHA256(pin).toString()
        }
      });
      // Money.update({userId:Meteor.userId()}, {$set: {resetPinToken:null}});
      return true;
    } else return false;
  },
  updateProfile: function(profile) {
    Profile.update({
      userId: Meteor.userId()
    }, {
      $set: profile
    });
  },
  checkOldPasswordUse: function(passwd) {
    let pString = SHA256(passwd).toString();
    let data = Profile.findOne({
      userId: Meteor.userId()
    }).profilePasswd;
    if (data && data.indexOf(pString) !== -1) return false;
    return true;
  },
  storeOldPassword: function(passwd) {
    let pString = SHA256(passwd).toString();
    Profile.update({
      userId: Meteor.userId()
    }, {
      $addToSet: {
        profilePasswd: pString
      }
    });
  },
  getLast30Record: function() {
    let res = {
      gold: 0,
      silver: 0,
      tjsc: 0,
      tjsd: 0
    }
    let id = Meteor.userId();
    let refine = {
      startDate: new Date(new Date() - (30 * 24 * 60 * 60 * 1000)),
      endDate: new Date()
    }
    let admin = Meteor.users.findOne({
      username: Meteor.settings.private.houseTjEmail
    });
    let adminId = '';
    if (admin)
      adminId = admin._id;
    if (id) {
      let multiplier = parseFloat(ExtraSpot.findOne().multiplier) || 2;
      let tdetails = Transaction.find({
        $and: [{
          Date: {
            $lte: refine.endDate,
            $gte: refine.startDate
          }
        }, {
          $or: [{
            From: id
          }, {
            To: id
          }]
        }]
      }, {
        sort: {
          Date: -1
        }
      }).fetch();
      tdetails.forEach((ele) => {
        let TJ = ele.TJTransfer;
        if (ele.From === adminId) { //direct purchase gold or silver
          let material = ele.goldVal; //undefined in case of transfer b/w users
          if (ele.membership === "gold")
            res.gold += parseFloat((TJ / multiplier) / parseFloat(material));
          else res.silver += parseFloat((TJ / multiplier) / parseFloat(material));
        }
        if (ele.To === id) res.tjsc += TJ;
        else res.tjsd += TJ;
      })
    }
    return res;
  },
  getStaffName: function() {
    debugger;
    let users = Meteor.users.find({
      "profile.staff": true
    }).fetch();
    name = [];
    for (i = 0; i < users.length; i++) {
      name[i] = users[i].profile.name + "(" + users[i].username + ")";
    }
    return name;
  },
  uploadUserImg: function(img) {
    const AWS = require('aws-sdk');
    AWS.config.update({
      accessKeyId: Meteor.settings.private.s3.AccessKey,
      secretAccessKey: Meteor.settings.private.s3.SecretKey,
      region: Meteor.settings.private.s3.region
    });
    let s3 = new AWS.S3();
    const imageBuffer = Buffer.from(img.replace(/^data:image\/(png|gif|jpeg|jpg);base64,/, ''), 'base64');
    sharp(imageBuffer).toBuffer().then(buffer => {
      let data = {
        Bucket: Meteor.settings.private.s3.bucket,
        Key: 'users/images/' + Meteor.userId() + '-' + new Date().getTime() + '.jpg',
        Body: buffer,
        ContentEncoding: 'base64',
        ContentType: 'image/jpg'
      };
      s3.upload(data, Meteor.bindEnvironment((err, res) => {
        //call meteor delete
        Profile.update({
          userId: Meteor.userId()
        }, {
          $set: {
            img: res.Location
          }
        });
      }));
    });
  }
})
