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
  BlockChain
} from '../../collections/BlockChain'
import {
  Money
} from '../../collections/Money';
import {
  TJRedeem
} from '../../collections/TJRedeem';
import {
  Vault
} from '../../collections/Vault';
import {
  ExtraSpot
} from '../../collections/ExtraSpot';
import {
  PurchaseRequest
} from '../../collections/PurchaseRequest';
import {
  Gold
} from '../../collections/Gold';
import {
  Distributor
} from '../../collections/Distributor';
import {
  Transaction
} from '../../collections/Transaction';
import {
  StaffActivity
} from '../../collections/StaffActivity';
import {
  StaffRequest
} from '../../collections/StaffRequest';
import {
  ShipmentDetails
} from '../../collections/ShipmentDetails';
import {
  MoveToVault
} from '../../collections/MoveToVault';

Meteor.methods({
  getPurchaseMerchantRequestCount: function() {
    return [Profile.find({
      merchantRequest: true
    }).count(), PurchaseRequest.find({
      status: "progress"
    }).count()];
  },
  getTodayGoldPurchase: function(membership) {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    // let totalgold = 0;
    //get last 24 hour blockchain gold purchased i.e. comeFrom = null
    let count = BlockChain.find({
      $and: [{
        membership: membership
      }, {
        createdAt: {
          $lt: new Date()
        }
      }, {
        createdAt: {
          $gt: new Date(new Date() - 24 * 60 * 60 * 1000)
        }
      }, {
        comeFrom: null
      }]
    }).count();
    // for (i = 0; i < blockchain.length; i++) {
    // totalgold = parseFloat(totalgold) + parseFloat(blockchain[i].tj);
    // }
    return count;
  },
  getTodayTJRedeem: function(membership) {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }

    totaltj = 0;
    tjred = TJRedeem.find({
      $and: [{
        membership: membership
      }, {
        createdAt: {
          $lt: new Date()
        }
      }, {
        createdAt: {
          $gt: new Date(new Date() - 24 * 60 * 60 * 1000)
        }
      }]
    }).fetch();
    for (i = 0; i < tjred.length; i++) {
      totaltj = parseFloat(totaltj) + parseFloat(tjred[i].Amount);
    }
    return totaltj;
  },
  getP: function() {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    return ExtraSpot.findOne().price || 0
  },
  leftAmount: function(membership) {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    let data = Vault.find({
      membership: membership
    }).fetch();
    let total = 0;
    for (i = 0; i < data.length; i++) total += data[i].left;
    return total;
  },
  transferToVault: () => {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    //TJhouse to Vault
    let tjHouseid = Meteor.users.findOne({
      username: Meteor.settings.private.houseTjEmail
    })._id;
    let gold = Money.findOne({
      userId: tjHouseid
    }).gold;
    if (gold <= 0) return true;
    Vault.insert({
      serialNo: "HouseTJ",
      vaultNo: "HouseTJ",
      shelfNo: "HouseTJ",
      boxNo: "HouseTJ",
      weight: parseFloat(gold),
      left: parseFloat(gold),
      assignTo: [],
      membership: "gold",
      createdAt: new Date()
    });
    Money.update({
      userId: tjHouseid
    }, {
      $set: {
        gold: 0
      }
    });
    return true;
  },
  getAllUsersDetail: function(skip, limit = 20, userId) {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    let array = [];
    if (userId) {
      array = Profile.find({
        userId
      }).fetch();
    } else
      array = Profile.find({
        $or: [{
          both: false
        }, {
          both: true
        }]
      }, {
        sort: {
          createdAt: -1
        },
        fields: {
          email: 1,
          fullname: 1,
          cards: 1,
          merchant: 1,
          membership: 1,
          userId: 1,
          dob: 1,
          address: 1,
          phone: 1
        },
        skip: skip,
        limit: 20
      }).fetch();
    let multiplier = parseFloat(ExtraSpot.findOne().multiplier) || 2;
    let nowGold = parseFloat(Gold.findOne().data);
    for (i = 0; i < array.length; i++) {
      let id = array[i].userId;
      if (array[i].both === false) {
        array[i].subs = array[i].membership;
        if (array[i].membership == "gold") array[i].isGold = true;
        else array[i].isSilver = true;
      } else {
        array[i].subs = "gold & silver";
        array[i].isGold = true;
        array[i].isSilver = true;
      }
      // if (array[i].isGold) {
      array[i].cards = Money.findOne({
        userId: id
      }).cards;
      array[i].tjg = Money.findOne({
        userId: id
      }).gold * nowGold * multiplier;
      array[i].lastUpdate = new Date().toISOString()
      // }
      // if (array[i].isSilver) {
      //   array[i].scards = MoneyS.findOne({
      //     userId: id
      //   }).cards;
      //   array[i].tjs = MoneyS.findOne({
      //     userId: id
      //   }).gold * nowGold * multiplier;
      // }
    }
    return array;
  },
  updateCharges: (uC, mC) => {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    let id = ExtraSpot.findOne()._id;
    ExtraSpot.update({
      _id: id
    }, {
      $set: {
        userCharge: uC,
        merchantCharge: mC
      }
    });
    return true;
  },
  changeAPassword: function(id, pass) {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    Accounts.setPassword(id, pass);
    return true;
  },
  chargeByAdmin: (id, amt, remarks) => {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    let user = Money.findOne({
      userId: id
    });
    let tjHouseid = Meteor.users.findOne({
      username: Meteor.settings.private.houseTjEmail
    })._id;
    let tjHouseMoney = Money.findOne({
      userId: tjHouseid
    });
    let gold = parseFloat(Gold.findOne().data);
    let _amt = amt;
    let multiplier = ExtraSpot.findOne().multiplier;
    amt = parseFloat(parseFloat(amt) / gold) / multiplier; //in gold ounce
    if (user && amt && user.gold >= amt) {
      //charge user
      //deduct user
      let newValue = user.gold - amt;
      let newtj = newValue * gold * multiplier; //in GD
      Money.update({
        userId: id
      }, {
        $set: {
          gold: newValue //update ounces
        }
      });
      //credit house
      let newHouseValue = tjHouseMoney.gold + amt;
      Money.update({
        userId: tjHouseid
      }, {
        $set: {
          gold: newHouseValue
        }
      });
      //add transaction
      let Amount = _amt;
      tid = Transaction.insert({
        From: id,
        To: tjHouseid,
        TJTransfer: (parseFloat(_amt)),
        Date: new Date(),
        createdAt: new Date(),
        remarks: remarks,
      });
      //update blockchain
      getAllBlock = BlockChain.find({
        userId: id
      }, {
        sort: {
          createdAt: 1
        }
      }).fetch();
      for (i = parseFloat(Amount), j = 0; parseFloat(i) > 0, j < getAllBlock.length; j++) {
        //get first tj from blokchain belong to userId
        stj = parseFloat(getAllBlock[j].tj);
        tempTJ = 0;
        //if blockchain tj value is empty then do nothing
        if (stj == 0) continue;
        //if amount is greater than current blockchain TJ then subtract current TJ from Amount
        if (i > stj) {
          i = i - stj;
          tempTJ = stj;
          stj = 0; //set current tj of blockchain to zero
        } else { //if amount is less than blockchain TJ than subtract Amount from current TJ
          stj = stj - i;
          tempTJ = i;
          i = 0; //set amount value to zero
        }
        // console.log(stj);
        //update selected blockchain
        BlockChain.update({
          _id: getAllBlock[j]._id
        }, {
          $set: {
            tj: stj
          }
        });
        //insert blockchain for payee set tj subtract from
        BlockChain.insert({
          _id: BlockChain.find().count() + 1000000 + '',
          userId: tjHouseid,
          comeFrom: getAllBlock[j]._id,
          tj: tempTJ,
          createdAt: new Date()
        });
        if (i == 0) break;
        //comeFrom for origin of gold is null
      }
      //send email
      let text = "Hello,\nYour account was charge of " + numberWithCommas((parseFloat(_amt)).toFixed(2)) + " GoldDollar for " + remarks + "\nTransaction Number : " + tid + "\nYour New GoldDollar Balance is: \n" + numberWithCommas((parseFloat(newtj)).toFixed(2)) + "\n\nFor More Info Login To Your Account\n\n-TexasGoldCard";
      let email = Profile.findOne({
        userId: id
      }).email;
      let html = Meteor.call('generateEmail', text.replace(/\n/g, "<br />"));
      Meteor.call("sendEmail", "TexasGoldCard: Amount Deducted from Successfully", html, email);
      // Email.send({
      //     to: Profile.findOne({
      //         userId: id
      //     }).email,
      //     from: "no-reply@texasgoldcard.com",
      //     subject: "TexasGoldCard: Amount Deducted from TexasGoldCard",
      //     text: text
      // });
      return true;
    } else {
      throw new Meteor.Error(400, 'insufficient amount');
    }
  },
  sendEmailToAll: function(sub, message) {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    //send email to all users
    var users = Meteor.users.find({
      $and: [{
        "profile.staff": {
          $exists: false
        }
      }, {
        "profile.admin": {
          $exists: false
        }
      }]
    }).fetch();
    users.map((ele) => {
      html = Meteor.call('generateEmail', message.replace(/\n/g, "<br />"));
      Meteor.call("sendEmail", sub + "| TexasGoldCard", html, ele.username);
      console.log("send email to ", ele.username);
    });
    return true;

  },
  updateDistributor: function(name, email) {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    if (!name || !email) {
      throw new Error(400, 'Both Name and Email required');
    }
    Distributor.update({
      id: 1
    }, {
      $set: {
        name: name,
        email: email
      }
    });
    return true;
  },
  purchaseRequestCount: function() {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }

    return PurchaseRequest.find({
      status: "progress"
    }).count();
  },
  leftAmount: function(membership) {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    var data = Vault.find({
      membership: membership
    }).fetch();
    var total = 0;
    for (i = 0; i < data.length; i++) total += data[i].left;
    return total;
  },
  changeMultiplier: (multiplier, pwd) => {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    let validPwd = Meteor.call('checkPassword', pwd);
    if(validPwd) {
      ExtraSpot.update({
        _id: ExtraSpot.findOne()._id
      }, {
        $set: {
          multiplier: multiplier
        }
      });
      return true;
    } else {
      // throw new Error(402, 'Not Valid Password');
      return false;
    }
  },
  getMerchantRequestUser: function() {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    return Profile.find({
      merchantRequest: true
    }).fetch();
  },
  getMerchantRequestUserCount: function() {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    return Profile.find({
      merchantRequest: true
    }).count();
  },
  setMerchant: function(id, flag, percent) {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    if (percent == undefined || percent == null) percent = 0;
    percent = parseFloat(percent);
    Profile.update({
      userId: id
    }, {
      $set: {
        merchant: flag,
        merchantRequest: false,
        merchantFee: percent
      }
    });
    return true;
  },
  getStaffDetail: function() {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    let array = Meteor.users.find({
      "profile.staff": true
    }).fetch();
    for (i = 0; i < array.length; i++) {
      array[i].fullname = array[i].profile.name;
      array[i].email = array[i].username;
      array[i].moderator = array[i].profile.moderator;
    }
    return array;
  },
  registerNewStaff: function(name, email, password, moderator) {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    let userId = Accounts.createUser({
      username: email,
      email: email,
      password: password,
      profile: {
        name: name,
        staff: true,
        moderator: moderator,
        userImg: 'images/user.png',
        createdAt: new Date()
      },
      loginInformation: [],
    });
    Profile.insert({
      userId: userId,
      createdAt: new Date(),
      fullname: name,
      address: null,
      phone: null,
      email: email,
      merchant: false
    });
    return true;
  },
  getStaffData: function(userId) {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    return Meteor.users.findOne({
      _id: userId
    }, {
      fields: {
        profile: 1,
        username: 1
      }
    })
  },
  getTotalDB: function(dbName) {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    if (eval(dbName))
      return eval(dbName).find().count();
    return 0;
  },
  getDBBackup: function(dbName, start, end) {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    if (eval(dbName))
      return eval(dbName).find({
        $and: [{
          createdAt: {
            $lte: new Date(end)
          }
        }, {
          createdAt: {
            $gte: new Date(start)
          }
        }]
      }, {
        fields: {
          "services": 0,
          "profile.loginInformation": 0,
          "loginInformation": 0
        }
      }).fetch();
    return [];
  },
  getUserBlockChain: function(id) {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    let blockChain = BlockChain.find({
      userId: id
    }, {
      sort: {
        createdAt: 1
      }
    }).fetch();
    for (i = 0; i < blockChain.length; i++) {
      if (blockChain[i].comeFrom != null) {
        bc = blockChain[i].comeFrom;
        sourceUserId = BlockChain.findOne({
          _id: bc
        }).userId;
        blockChain[i].sourceID = sourceUserId;
        fullname = Profile.findOne({
          userId: sourceUserId
        }).fullname;
        blockChain[i].fullname = fullname;
      } else {
        fullname = Profile.findOne({
          userId: blockChain[i].userId
        }).fullname;
        blockChain[i].fullname = fullname;
        blockChain[i].comeFrom = "";
        blockChain[i].sourceID = blockChain[i].userId;
      }
    }
    return blockChain;
  },
  getUserName: function(id) {
    try {
      return Profile.findOne({
        userId: id
      }).fullname;
    } catch (e) {
      throw new Meteor.Error(400, e.message);
    }
  },
})
