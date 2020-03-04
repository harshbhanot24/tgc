import "../../api/api";
import SHA256 from "crypto-js/sha256";
import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { HTTP } from "meteor/http";
import { ExtraSpot } from "../../collections/ExtraSpot";
import { Distributor } from "../../collections/Distributor";
import { Profile } from "../../collections/Profile";
import { Money } from "../../collections/Money";
import { Silver } from "../../collections/Silver";
import { Gold } from "../../collections/Gold";

Meteor.startup(function() {
  /*   UploadServer.init({
         // tmpDir: '/Users/wadehrarshpreet/.uploads/tmp',
         tmpDir: '.uploads/tmp',
         // uploadDir: '/Users/wadehrarshpreet/.uploads/',
         uploadDir: '.uploads/',
         checkCreateDirectories: true,
         getDirectory: function(fileInfo, formData) {
             // create a sub-directory in the uploadDir based on the content type (e.g. 'images')
             return formData.contentType + "/";
         },
         getFileName: function(fileInfo, formData) {
             return (new Date()).valueOf() + "-" + fileInfo.name;
         },
         finished: function(fileInfo, formFields) {
             // console.log(fileInfo);
             // perform a disk operation
         },
         cacheTime: 100
     });*/
  if (ExtraSpot.findOne() === undefined) {
    ExtraSpot.insert({
      price: 0,
      multiplier: 2
    });
  }
  if (ExtraSpot.findOne().multiplier === undefined) {
    ExtraSpot.update(
      {
        _id: ExtraSpot.findOne()._id
      },
      {
        $set: {
          multiplier: 2
        }
      }
    );
  }
  if (
    !Meteor.users.findOne({
      username: "admin@tjgold.com"
    })
  ) {
    const userId = Accounts.createUser({
      username: "admin@tjgold.com",
      email: "admin@tjgold.com",
      password: "admin1234",
      profile: {
        name: "Admin",
        admin: true,
        userImg: "images/user.png",
        lastLogin: new Date(),
        loginInformation: [],
        lastCheckNotification: new Date(),
        createdAt: new Date()
      }
    });
  }
  if (Distributor.find().count() === 0) {
    Distributor.insert({
      id: 1,
      name: "",
      email: ""
    });
  }
  //test account
  if (
    !Meteor.users.findOne({
      username: "arsh3@eyepaste.com"
    })
  ) {
    const userId = Accounts.createUser({
      username: "arsh3@eyepaste.com",
      email: "arsh3@eyepaste.com",
      password: "aashuzone",
      profile: {
        name: "Arsh Preet",
        staff: true,
        moderator: false,
        userImg: "/img/user.png",
        lastLogin: new Date(),
        loginInformation: [],
        lastCheckNotification: new Date(),
        createdAt: new Date()
      }
    });
    // Profile.insert({
    //     userId: userId,
    //     createdAt: new Date(),
    //     fullname: "Arsh Preet",
    //     address: null,
    //     phone: null,
    //     email: Meteor.users.findOne({
    //         _id: userId
    //     }).emails[0].address,
    //     merchant: false
    // });
    //         Notifications.insert({
    //             userId: userId,
    //             message: "Notification 1",
    //             createdAt: new Date()
    //         });
    //         Notifications.insert({
    //             userId: userId,
    //             message: "Notification 2",
    //             createdAt: new Date()
    //         });
    //         Notifications.insert({
    //             userId: userId,
    //             message: "Notification 3",
    //             createdAt: new Date()
    //         });
  }

  Accounts.urls.resetPassword = function(token) {
    return Meteor.absoluteUrl("reset/" + token);
  };
  Accounts.emailTemplates.resetPassword.subject = function(user) {
    return "RESET Your Password for Texas Gold Card";
  };
  Accounts.emailTemplates.resetPassword.text = function(user, url) {
    var str = "Hello,\n";
    str += "To reset your password, please click following link...\n";
    str += url;
    return str;
  };

  if (
    !Meteor.users.findOne({
      // username: Meteor.settings.private.houseTjEmail
    })
  ) {
    const userId = Accounts.createUser({
      username: Meteor.settings.private.houseTjEmail,
      email: Meteor.settings.private.houseTjEmail,
      password: "mastermaster",
      profile: {
        name: "Texas Gold Card HOUSE",
        lastLogin: new Date(),
        lastCheckNotification: new Date(),
        loginInformation: [
          {
            date: new Date()
          }
        ],
        createdAt: new Date()
      }
    });
    Money.insert({
      userId: userId,
      createdAt: new Date(),
      tj: 0.0,
      gold: 0,
      container: [
        {
          name: "gold",
          val: 0
        }
      ],
      tjsend: 0,
      tjrecieved: 0,
      cards: 0,
      redeem: 0,
      resetPinToken: null,
      PIN: SHA256(new Date() + userId).toString(),
      feesTime: new Date()
    });
    Profile.insert({
      userId: userId,
      membership: "gold",
      both: true,
      createdAt: new Date(),
      fullname: "Texas Gold Card HOUSE",
      address: null,
      phone: null,
      img: "/images/user.png",
      email: Meteor.settings.private.houseTjEmail,
      resetEmailSent: false,
      merchant: false,
      merchantRequest: false,
      merchantFee: 0
    });
    //set Card number
    let card = "";
    for (;;) {
      let Tcard =
        (Math.random() + " ").substring(2, 5) +
        (Math.random() + " ").substring(2, 5);
      card = Tcard.substring(0, 2) + "-" + Tcard.substring(2, 6);
      if (
        Money.findOne({
          cards: card
        }) === undefined
      ) {
        Money.update(
          {
            userId: userId
          },
          {
            $set: {
              cards: card
            }
          }
        );
        break;
      }
    }
    //         MoneyS.insert({
    //             userId: userId,
    //             createdAt: new Date(),
    //             tj: 0.00000,
    //             gold: 0,
    //             tjsend: 0,
    //             tjrecieved: 0,
    //             container: [{
    //                 name: "silver",
    //                 val: 0
    //             }],
    //             cards: 0,
    //             redeem: 0,
    //             resetPinToken: null,
    //             PIN: CryptoJS.SHA256(new Date() + userId).toString(),
    //             feesTime: new Date()
    //         });
    //         card = "";
    //         for (;;) {
    //             Tcard = (Math.random() + ' ').substring(2, 5) + (Math.random() + ' ').substring(2, 5);
    //             card = Tcard.substring(0, 2) + "-" + Tcard.substring(2, 6);
    //             if (MoneyS.findOne({
    //                     cards: card
    //                 }) === undefined && Money.findOne({
    //                     cards: card
    //                 }) === undefined) {
    //                 MoneyS.update({
    //                     userId: userId
    //                 }, {
    //                     $set: {
    //                         cards: card
    //                     }
    //                 });
    //                 break;
    //             }
    //         }
    
  } else {
    Meteor.users.update(
      {
        username: Meteor.settings.private.houseTjEmail
      },
      {
        $set: {
          "profile.name": "Texas Gold Card House"
        }
      }
    );
  }

  process.env.MAIL_URL = Meteor.settings.private.MAIL_URL;
  // process.env.ROOT_URL = '';
  // 2. Format the email
  Accounts.urls.verifyEmail = function(token) {
    return Meteor.absoluteUrl("verify/" + token);
  };
  //-- Set the from address
  Accounts.emailTemplates.from = "Texas Gold Card <no-reply@texasgoldcard.com>";
  //-- Application name
  Accounts.emailTemplates.siteName = "Texas Gold Card";
  //-- Subject line of the email.
  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    // console.log(Accounts.urls.verifyEmail);
    return "Confirm Your Email Address for Texas Gold Card";
  };

  //Reset Password
  Accounts.urls.resetPassword = function(token) {
    return Meteor.absoluteUrl("reset/" + token);
  };
  Accounts.emailTemplates.resetPassword.subject = function(user) {
    return "RESET Your Password for Texas Gold Card";
  };
  Accounts.emailTemplates.resetPassword.text = function(user, url) {
    var str = "Hello,\n";
    str += "To reset your password, please click following link...\n";
    str += url;
    return str;
  };

  // Accounts.config({
  //   sendVerificationEmail: true
  // });

  try {
    let content = HTTP.call(
      "GET",
      "https://www.moneymetals.com/precious-metals-charts/silver-price"
    );
    const cheerio = require("cheerio");
    let $ = cheerio.load(content.content);
    let gold = $("#sp-price-gold")
      .text()
      .replace("$", "")
      .replace(",", "")
      .trim();
    // let gold = $('.intraday__price').text().replace("$", "").replace(",", "").trim();
    console.log(gold);
    // let update = $('.timestamp__time').text().trim();
    if (!isNaN(parseFloat(gold))) {
      let update = new Date().toISOString();
      if (Gold.find().count() === 0) {
        Gold.insert({
          data: parseFloat(gold).toFixed(2),
          update: update
        });
      } else {
        Gold.update(
          {},
          {
            $set: {
              data: parseFloat(gold).toFixed(2),
              update: update
            }
          }
        );
      }
    }
    // if (Silver.find().count() === 0) {
    // content = HTTP.call("GET", "https://www.moneymetals.com/precious-metals-charts/silver-price");
    // $ = cheerio.load(content.content);
    // console.log($('#bullionPriceTable table tr').text());
    // let silver = $('.intraday__price').text().replace("$", "").replace(",", "").trim();
    const silver = $("#sp-price-silver")
      .text()
      .replace("$", "")
      .replace(",", "")
      .trim();
    // console.log($('.intraday__price '))
    console.log(silver);

    if (!isNaN(parseFloat(silver))) {
      let update = new Date().toISOString();
      if (Silver.find().count() === 0) {
        // let update = $('.bullion-price-timestamp').text().trim();
        // let update = $('.timestamp__time').text().trim();
        Silver.insert({
          data: parseFloat(silver).toFixed(2),
          update: update
        });
      } else {
        Silver.update(
          {},
          {
            $set: {
              data: parseFloat(silver).toFixed(2),
              update: update
            }
          }
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
  // }
  Meteor.setInterval(function() {
    try {
      let content = HTTP.call(
        "GET",
        "https://www.moneymetals.com/precious-metals-charts/silver-price"
      );
      const cheerio = require("cheerio");
      let $ = cheerio.load(content.content);
      let gold = $("#sp-price-gold")
        .text()
        .replace("$", "")
        .replace(",", "")
        .trim();
      // let gold = $('.intraday__price').text().replace("$", "").replace(",", "").trim();
      console.log(gold);
      // let update = $('.timestamp__time').text().trim();
      if (!isNaN(parseFloat(gold))) {
        let update = new Date().toISOString();
        if (Gold.find().count() === 0) {
          Gold.insert({
            data: parseFloat(gold).toFixed(2),
            update: update
          });
        } else {
          Gold.update(
            {},
            {
              $set: {
                data: parseFloat(gold).toFixed(2),
                update: update
              }
            }
          );
        }
      }
      // if (Silver.find().count() === 0) {
      // content = HTTP.call("GET", "https://www.moneymetals.com/precious-metals-charts/silver-price");
      // $ = cheerio.load(content.content);
      // console.log($('#bullionPriceTable table tr').text());
      // let silver = $('.intraday__price').text().replace("$", "").replace(",", "").trim();
      let silver = $("#sp-price-silver")
        .text()
        .replace("$", "")
        .replace(",", "")
        .trim();
      // console.log($('.intraday__price '))
      console.log(silver);

      if (!isNaN(parseFloat(silver))) {
        let update = new Date().toISOString();
        if (Silver.find().count() === 0) {
          // let update = $('.bullion-price-timestamp').text().trim();
          // let update = $('.timestamp__time').text().trim();
          Silver.insert({
            data: parseFloat(silver).toFixed(2),
            update: update
          });
        } else {
          Silver.update(
            {},
            {
              $set: {
                data: parseFloat(silver).toFixed(2),
                update: update
              }
            }
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, 60000);
  let houseTjEmail = Meteor.settings.private.houseTjEmail;
  // monthly deduction & monthly statement
  Meteor.setInterval(function() {
    var profiles = Profile.find({
      $and: [
        {
          subscribe: true
        },
        {
          $or: [
            {
              lastSent: {
                $lt: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
              }
            },
            {
              lastSent: null
            },
            {
              lastSent: {
                $exists: false
              }
            }
          ]
        }
      ]
    }).fetch();
    profiles.map(ele => {
      var id = ele.userId;
      var startDate = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
      var mem = "Gold";
      var end = new Date();
      // end.setHours(23, 59, 59, 999);
      var refine = {
        startDate: new Date(startDate),
        endDate: end,
        member: mem.toLowerCase()
      };
      var transactions = Meteor.call("getUserTransaction", id, 0, null, refine);
      tableData = "";
      var cardNo = Money.findOne({
        userId: ele.userId
      }).cards;
      transactions.map(transact => {
        tableData =
          '<tr><td style="width:20%">' +
          transact.FromName +
          "(" +
          transact.FromCard +
          ") sent " +
          transact.Fromgold +
          ' (Gold Dollar)</td><td style="width:20%">' +
          transact.ToName +
          "(" +
          transact.ToCard +
          ") sent " +
          transact.Togold +
          ' (Gold Dollar)</td><td style="width:20%">' +
          transact._id +
          '</td><td style="width:20%">' +
          transact.Date +
          '</td><td style="width:20%">' +
          transact.remarks +
          "</td></tr>";
      });
      var htmlContent =
        '<h2 style="color:#fff">Texas Gold Card Monthly Statement</h2><br/><p>Hi ' +
        ele.fullname +
        ",<br/>Your this month Texas Gold Card Statement(Card No:" +
        cardNo +
        ') is given below</p><br/><br/><table border=2 cellpadding=2 style="display:block;width:100%;border:1px solid #fff; color:#fff"><thead><tr class="warning"><th style="width:20%">From</th><th style="width:20%">To</th><th style="width:20%">TransactionID</th><th style="width:20%">Date</th><th style="width:20%">Remarks</th></tr></thead><tbody>' +
        tableData +
        '</tbody></table><br/><br/><a href="http://texasgoldcard.com" style="color:#fff">Texas Gold Card</a><br/><br/>';
      html = Meteor.call("generateEmail", htmlContent);
      Meteor.call(
        "sendEmail",
        "Texas Gold Card Monthly Statment",
        html,
        ele.email
      );
      Profile.update(
        {
          _id: ele._id
        },
        {
          $set: {
            lastSent: new Date()
          }
        }
      );
    });
  }, 86400000); //00000
  Meteor.setInterval(function() {
    var users = Meteor.users.find().fetch();
    var tjHouseId = Meteor.users.findOne({
      username: houseTjEmail
    })._id;
    for (var i = 0; i < users.length; i++) {
      if (users[i].username == houseTjEmail) continue;
      var userId = users[i]._id;
      var userMoney = Money.findOne({
        userId: userId
      });
      var userCharge = ExtraSpot.findOne().userCharge || 200;
      var merchantCharge = ExtraSpot.findOne().merchantCharge || 600;
      var due = new Date() - new Date(userMoney.feesTime);
      // if (due >= 2592000000) { //30 day
      if (new Date().getDate() == 1) {
        //30 day
        //do transaction
        var isMerchant = Profile.findOne({
          _id: userId
        }).merchant;
        var TJLeft;
        var gold = userMoney.gold;
        var spotGold = parseFloat(Gold.findOne().data);
        var totalTJ = gold * spotGold * ExtraSpot.findOne().multiplier;
        var TotalAmount = parseFloat(totalTJ).toFixed(2);

        if (isMerchant) {
          //find all transaction within month
          //deduct 3% if 3%>600 then 600
          //deduct 3% or 600 whichever is max
          var transactions = Transaction.find({
            $and: [
              {
                To: userId
              },
              {
                createdAt: {
                  $gt: new Date(userMoney.feesTime)
                }
              }
            ]
          }).fetch();
          var total_amount = 0;
          for (var j = 0; j < transactions.length; j++) {
            if (transactions[j].From != tjHouseId)
              //only on sale not purchase
              total_amount = +transactions[j].TJTransfer;
          }
          var fee = Profile.findOne({
            _id: userId
          }).merchantFee;
          TJLeft =
            TotalAmount -
            (TotalAmount * (fee / 100) < merchantCharge
              ? TotalAmount * (fee / 100)
              : merchantCharge);
        } else TJLeft = TotalAmount - userCharge;
        if (TJLeft < 0) {
          TJLeft = 0;
        }
        var user_updatedGold = TJLeft / spotGold;
        var updatedGold = gold - user_updatedGold;
        Money.update(
          {
            userId: userId
          },
          {
            $set: {
              gold: user_updatedGold,
              feesTime: new Date()
            }
          }
        );
        Transaction.insert({
          From: userId,
          To: tjHouseid,
          TJTransfer: parseFloat(updatedGold),
          Date: new Date(),
          goldVal: spotGold,
          createdAt: new Date(),
          remarks: "Monthly Fees"
        });
        var updatedTjGold =
          Money.findOne({
            userId: tjHouseId
          }).gold + updatedGold;
        Money.update(
          {
            userId: tjHouseId
          },
          {
            $set: {
              gold: updatedTjGold
            }
          }
        );
      }
    }
  }, 86400000);
});

if (Meteor.isServer) {
  // Global API configuration
  var Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true
  });
 Api.addRoute(
   "user",
   { authRequired: true },
   {
     get: function() {
      const {username , emails} = this.user;
      const profile = Profile.findOne({userId: this.userId});
      const balance = Money.findOne({ userId: this.userId });
       return { username, emails,pin, ...profile, ...balance };
       
     }
   }
 );
 Api.addRoute(
   "transfer",
   { authRequired: true },
   {
     post: function(){
       const {
         receiverCard,
         amount,
         pin,
         remarks,
         userId
       } = this.bodyParams;
       
       let res; 
       try{
       const tranId =  Meteor.call(
         "transferMoney",
         receiverCard,
         amount, // the amount here is TGC
         pin,
         remarks,
         1, // to get tgc 
        userId
       );
       res = {"message":"your transaction is sucessful", tranId}
       }
       catch(err){
         res = err;
       }
           return res;  
     }
 
    }

 );
  
  }