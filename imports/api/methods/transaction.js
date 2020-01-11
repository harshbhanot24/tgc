import {
  Meteor
} from 'meteor/meteor';
import SHA256 from 'crypto-js/sha256';
import UTILS from '../../util';
import {
  Transaction
} from '../../collections/Transaction'
import {
  TJRedeem
} from '../../collections/TJRedeem'
import {
  PurchaseRequest
} from '../../collections/PurchaseRequest'
import {
  Money
} from '../../collections/Money';
import {
  ExtraSpot
} from '../../collections/ExtraSpot';
import {
  RecentTransferUser
} from '../../collections/RecentTransferUser';
import {
  BlockChain
} from '../../collections/BlockChain'
import {
  Profile
} from '../../collections/Profile'
import {
  Gold
} from '../../collections/Gold'
import {
  Vault
} from '../../collections/Vault'

const numberWithCommas = function(x) {//add commas to number thousands,millions...
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
Meteor.methods({
  getUserTransaction: function(id, skip, individual, refine, search, limit) {
    if (refine == undefined) refine = null;
    if (search == undefined) search = "";
    MoneyO = Money;
    try {
      tid = null;
      if (individual == undefined || individual == null) individual = null;
      if (id == "all") {
        //All Transactions all user recently top 40
        tid = Transaction.find({
          _id: {
            '$regex': search,
            '$options': 'i'
          }
        }, {
          sort: {
            Date: -1
          },
          limit: 40,
          skip: (40 * parseFloat(skip))
        }).fetch();
      } else if (id == null) {
        //All Transactions all user recently top 10
        tid = Transaction.find({}, {
          sort: {
            Date: -1
          },
          limit: 10,
          skip: (10 * parseFloat(skip))
        }).fetch();
      } else if (individual == null) {
        //particular id transactions
        /*member = Profile.findOne({
            userId: Meteor.userId()
        }).membership;*/
        if (refine == null) {
          tid = Transaction.find({
            $and: [{
              $or: [{
                From: id
              }, {
                To: id
              }]
            }]
          }, {
            sort: {
              Date: -1
            },
            limit: limit
          }).fetch();
        } else {
          tid = Transaction.find({
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
            },
            limit: limit
          }).fetch();
        }
      } else tid = Transaction.find({
        _id: individual
      }).fetch(); // individual transaction details

      for (i = 0; i < tid.length; i++) {
        from = tid[i].From;
        to = tid[i].To;
        FromName = Profile.findOne({
          userId: from
        }).fullname;
        FromCard = MoneyO.findOne({
          userId: from
        }).cards;
        ToName = Profile.findOne({
          userId: to
        }).fullname;
        ToCard = MoneyO.findOne({
          userId: to
        }).cards;
        tid[i].FromName = FromName;
        tid[i].FromCard = FromCard;
        tid[i].ToName = ToName;
        tid[i].ToCard = ToCard;
        tid[i].index = i + 1;
        tid[i].Togold = parseFloat(tid[i].TJTransfer);
        tid[i].FromTJTransfer = parseFloat(tid[i].TJTransfer);
        tid[i].Fromgold = parseFloat(tid[i].FromTJTransfer);
        tid[i].Fromgold = tid[i].Fromgold.toFixed(2);
        tid[i].Togold = tid[i].Togold.toFixed(2);
        tid[i].TJTransfer = parseFloat(tid[i].TJTransfer).toFixed(5);
      }
      return tid;
    } catch (e) {
      throw new Meteor.Error(400, e.message);
    }
  },
  sendPurchaseRequest: function(USDamount, goldPrice, type, name) {
    let amount = USDamount / goldPrice;
    PurchaseRequest.insert({
      userId: Meteor.userId(),
      amount: amount,
      status: "progress",
      membership: type,
      container: name,
      price: goldPrice,
      createdAt: new Date()
    });
  },
  checkPayeeExist: function(payeeCard, member) {
    // mem = Profile.findOne({
    //   userId: Meteor.userId()
    // }).membership[0].toLowerCase();
    let MoneyO = Money;
    // if (mem == "s") MoneyO = MoneyS;
    if (MoneyO.findOne({
        cards: payeeCard
      }) === undefined) {
      throw new Meteor.Error(400, "Receiver's Card Number Invalid");
    } else {
      return true;
    }
    // let id = MoneyO.findOne({
    //   cards: payeeCard
    // }).userId;
    // if (member.toLowerCase() == Profile.findOne({
    //     userId: id
    //   }).membership) {
    //   return true;
    // } else {
    //   throw new Meteor.Error(400, "Payee Must have Same MemberShip");
    // }
  },
  checkPIN: function(pin) {
    // mem = Profile.findOne({
    //   userId: Meteor.userId()
    // }).membership[0].toLowerCase();
    let MoneyO = Money;
    // if (mem == "s") MoneyO = MoneyS;
    let currentUser = MoneyO.findOne({
      userId: Meteor.userId()
    });
    const _pin = SHA256(pin).toString();
    let originalPin = currentUser.PIN;
    if (_pin === originalPin) {
      return true;
    }
    return false;
  },
  transferMoney: function(payeeCard, Amount, pinNumber, remarks, goldValue) {
    // mem = Profile.findOne({
    // userId: Meteor.userId()
    // }).membership[0].toLowerCase();
    goldValue = parseFloat(goldValue);
    const multiplier = ExtraSpot.findOne().multiplier;
    Amount = Amount / multiplier;
    let goldOunce = parseFloat(parseFloat(Amount) / parseFloat(goldValue));
    let MoneyO = Money;
    // if (mem == "s") MoneyO = MoneyS;
    let PayeeUserId = MoneyO.findOne({
      cards: payeeCard
    }).userId;
    //details of current user
    let currentUser = MoneyO.findOne({
      userId: Meteor.userId()
    });
    if (PayeeUserId == Meteor.userId()) {
      throw new Meteor.Error(504, 'Cannot Send GoldDollar to yourself');
    }
    //details of payee user
    let PayeeUser = MoneyO.findOne({
      userId: PayeeUserId
    });
    //is merchant payee
    let isPayeeMerchant = false;
    let pin = SHA256(pinNumber).toString();
    let originalPin = currentUser.PIN;
    // console.log(goldValue);

    // console.log(goldValue);
    if (pin === originalPin) {
      let MerchantFeePer = Profile.findOne({
        userId: PayeeUserId
      }).merchantFee;
      if (MerchantFeePer == undefined || MerchantFeePer == null) MerchantFeePer = 0;
      MerchantFeePer = parseFloat(MerchantFeePer) / 100;
      forAdmin = 0;
      // forAdmin = (MerchantFeePer * parseFloat(Amount));
      //tj send update in Money db
      newtjsend = parseFloat(Amount) + parseFloat(currentUser.tjsend);
      //update tj in Money db
      newtj = parseFloat(currentUser.tj) - parseFloat(Amount);
      newPtj = parseFloat(Amount) + parseFloat(PayeeUser.tj);
      newtjPrecieved = parseFloat(Amount) + parseFloat(PayeeUser.tjrecieved);
      originalAmount = Amount;
      // if (isPayeeMerchant == true) {
      //     newPtj = parseFloat(newPtj) - parseFloat(forAdmin);
      //     // Amount = parseFloat(Amount) - parseFloat(forAdmin);
      //     //houseTJ commission
      //     tjHouseid = Meteor.users.findOne({
      //         username: "housetjgold@gmail.com"
      //     })._id;
      //     otj = MoneyO.findOne({
      //         userId: tjHouseid
      //     }).tj;
      //     ntj = parseFloat(otj) + parseFloat(forAdmin);
      //     MoneyO.update({
      //         userId: tjHouseid
      //     }, {
      //         $set: {
      //             tj: ntj
      //         }
      //     });
      // }
      //update senders tj and total send tj
      let decreaseGold = parseFloat(currentUser.gold - goldOunce)
      let increaseGold = parseFloat(PayeeUser.gold + goldOunce);
      MoneyO.update({
        userId: Meteor.userId()
      }, {
        $set: {
          tj: newtj,
          tjsend: newtjsend,
          gold: decreaseGold
        }
      });
      //update payee tj and total recieved tj
      MoneyO.update({
        userId: PayeeUserId
      }, {
        $set: {
          tj: newPtj,
          tjrecieved: newtjPrecieved,
          gold: increaseGold
        }
      });
      //transaction update transaction details {from , to , tjtransfer, date}
      let tid = Transaction.insert({
        From: Meteor.userId(),
        To: PayeeUserId,
        TJTransfer: (parseFloat(Amount * multiplier) - forAdmin),
        Date: new Date(),
        createdAt: new Date(),
        remarks: remarks,
      });
      //add recent transfer
      let recent = RecentTransferUser.findOne({
        userId: Meteor.userId()
      });
      let obj = {
        cardNo: payeeCard,
        member: "g",
        name: Profile.findOne({
          userId: PayeeUserId
        }).fullname
      };
      if (recent == undefined) {
        RecentTransferUser.insert({
          userId: Meteor.userId(),
          recent: [obj]
        });
      } else {
        recent.recent.push(obj);
        let recentTrans = recent.recent;
        recentTrans = _.uniq(recentTrans, function(p) {
          return p._id;
        });
        recentTrans = recentTrans.splice(-5);
        RecentTransferUser.update({
          _id: recent._id
        }, {
          $set: {
            recent: recentTrans
          }
        });
      }
      //sender blockchain updated
      getAllBlock = BlockChain.find({
        userId: Meteor.userId()
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
          userId: PayeeUserId,
          comeFrom: getAllBlock[j]._id,
          tj: tempTJ,
          createdAt: new Date()
        });
        if (i == 0) break;
        //comeFrom for origin of gold is null
      }
      let nowGold = parseFloat(Gold.findOne().data);
      let newBalance = parseFloat(Money.findOne({
        userId: PayeeUserId
      }).gold) * nowGold * multiplier;
      let newMyBalance = parseFloat(Money.findOne({
        userId: Meteor.userId()
      }).gold) * nowGold * multiplier;
      //send reciver a update email
      text = "Hello,\nYou Recieve PAYMENT of GoldDollar " + (parseFloat(Amount * multiplier)).toFixed(2) + " From " + Profile.findOne({
        userId: Meteor.userId()
      }).fullname + "(" + Profile.findOne({
        userId: Meteor.userId()
      }).email + ")" + "\nTransaction Number : " + tid + "\nSender's Remarks: " + Transaction.findOne({
        _id: tid
      }).remarks + "\n\nYour New GoldDollar Balance is: \n" + UTILS.currencyFormat((parseFloat(newBalance)).toFixed(2)) + "\n\nFor More Info Login To Your Account\n\nYour Gold Dollar balance tends to change with spot price.";
      if (isPayeeMerchant == true) {
        text += "\n\n**You have Merchant Account, So Merchant Fees will be Applied On Recieved Amount";
      }
      try {
        html = Meteor.call('generateEmail', text.replace(/\n/g, "<br />"));
        let email = Profile.findOne({
          userId: PayeeUserId
        }).email;
        Meteor.call("sendEmail", "Texas Gold Card: RECIEVE PAYMENT INFO", html, email);
        // Email.send({
        //     to: Profile.findOne({
        //         userId: PayeeUserId
        //     }).email,
        //     from: "no-reply@texasgoldcard.com",
        //     subject: "Texas Gold Card: RECIEVE PAYMENT INFO",
        //     text: text
        // });
        //send sender a update email
        text = "Hello,\nYou Send PAYMENT of GoldDollar " + (parseFloat(Amount * multiplier)).toFixed(2) + " To " + Profile.findOne({
          userId: PayeeUserId
        }).fullname + "(" + Profile.findOne({
          userId: PayeeUserId
        }).email + ")" + "\nTransaction Number : " + tid + "\nYour New GoldDollar Balance is: \n" + numberWithCommas((parseFloat(newMyBalance)).toFixed(2)) + "\n\nFor More Info Login To Your Account\n\nYour Gold Dollar balance tends to change with spot price.";
        html = Meteor.call('generateEmail', text.replace(/\n/g, "<br />"));
        email = Profile.findOne({
          userId: Meteor.userId()
        }).email;
        Meteor.call("sendEmail", "Texas Gold Card: SEND PAYMENT INFO", html, email);
        // Email.send({
        //     to: Profile.findOne({
        //         userId: Meteor.userId()
        //     }).email,
        //     from: "no-reply@texasgoldcard.com",
        //     subject: "TexasGoldCard: SEND PAYMENT INFO",
        //     text: text
        // });
      } catch (e) {}
      return tid;
    } else {
      throw new Meteor.Error(504, 'PIN not Matched');
    }
  },
  reverseTransaction: function(id) {
    if (!Meteor.user().profile.staff) {
      throw new Error(400, 'Not Found');
    }
    let transaction = Transaction.findOne({
      _id: id
    });
    let multiplier = parseFloat(ExtraSpot.findOne().multiplier) || 2;
    let from = Money.findOne({
      userId: transaction.From
    });
    let to = Money.findOne({
      userId: transaction.To
    });
    if (to.tj < transaction.TJTransfer) throw new Meteor.Error(400, "User have insufficient balance for reverse transaction");
    let gold = parseFloat(transaction.TJTransfer / (multiplier * transaction.goldVal));
    let updatedGold = from.gold - gold;
    let updateToGold = to.gold + gold;
    Money.update({
      userId: transaction.From
    }, {
      $set: {
        "gold": updatedGold,
        "tj": parseFloat(from.tj + transaction.TJTransfer)
      }
    });
    Money.update({
      userId: transaction.To
    }, {
      $set: {
        "gold": updateToGold,
        "tj": parseFloat(to.tj - transaction.TJTransfer)
      }
    });
    let tid = Transaction.insert({
      From: transaction.To,
      To: transaction.From,
      TJTransfer: transaction.TJTransfer,
      Date: new Date(),
      createdAt: new Date(),
      goldVal: transaction.goldVal,
      remarks: "Refund Transaction " + id
    });
    Transaction.update({
      _id: id
    }, {
      $set: {
        "remarks": "Refund Transaction Id " + tid
      }
    });
    return true;
  },
  getUserMerchantCharges: function() {
    if (ExtraSpot.findOne())
      return [
        ExtraSpot.findOne().userCharge || 200,
        ExtraSpot.findOne().merchantCharge || 600
      ];
    else
      return [
        200,
        600
      ];
  },
  purchaseMeGold: function(userId, membership, amount, goldprice, container, id) {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    var mem, tj, MoneyO, gold, availableGold, allContainer;
    var mem = membership[0].toLowerCase();
    var MoneyO = Money;
    var multiplier = parseFloat(ExtraSpot.findOne().multiplier) || 2;
    // if (mem == "s") MoneyO = MoneyS;
    var money = MoneyO.findOne({
      userId: userId
    });
    var allContainer = money.container;
    // for (var k = 0; k < allContainer.length; k++) {
    //     if (allContainer[i].name.toLowerCase() == container.toLowerCase()) {
    //         allContainer[i].val += amount;
    //     }
    // }
    var tj = money.tj; //gold section common TJ
    var gold = money.gold;
    var availGold = parseFloat(Meteor.call('leftAmount', "gold"));
    if (availGold < amount) throw new Meteor.Error(400, "Error In Processing your Request Try Again Later");
    var availableGold = Vault.find({
      left: {
        $gt: 0
      },
      membership: membership
    }).fetch();
    if (availableGold.length == 0) {
      throw new Meteor.Error(400, "Error In Processing your Request Try Again Later");
    }
    //update value
    var utj = parseFloat(tj) + (parseFloat(amount) * parseFloat(goldprice) * multiplier);
    var ugold = parseFloat(gold) + parseFloat(amount);
    MoneyO.update({
      userId: userId
    }, {
      $set: {
        tj: utj,
        gold: ugold,
        container: allContainer
      }
    });
    var Amount = (parseFloat(amount) * parseFloat(goldprice) * multiplier);
    var tid = Transaction.insert({
      From: Meteor.users.findOne({
        username: Meteor.settings.private.houseTjEmail
      })._id,
      To: userId,
      TJTransfer: Amount,
      Date: new Date(),
      createdAt: new Date(),
      remarks: "purchase",
      goldVal: goldprice,
      membership: membership
    });
    var available = Vault.findOne({
      left: {
        $gte: amount
      },
      membership: membership
    });
    var total = parseFloat(amount);
    for (i = 0; i < availableGold.length; i++) {
      var vault = availableGold[i];
      var left = vault.left;
      var assignTo = vault.assignTo;
      if (left > total) {
        assignTo.push({
          userId: userId,
          amount: total,
          createdAt: new Date()
        });
        Vault.update({
          _id: vault._id
        }, {
          $set: {
            left: left - total,
            assignTo: assignTo
          }
        })
        total = 0;
        break;
      } else {
        assignTo.push({
          userId: userId,
          amount: left,
          createdAt: new Date()
        });
        Vault.update({
          _id: vault._id
        }, {
          $set: {
            left: 0,
            assignTo: assignTo
          }
        })
        total -= left;
      }
    }
    purchase = BlockChain.insert({ //set id of blockchain as serial number id
      userId: userId,
      comeFrom: null,
      tj: Amount,
      membership: membership,
      createdAt: new Date()
    });
    PurchaseRequest.update({
      _id: id
    }, {
      $set: {
        status: "success"
      }
    });
    var multiplier = parseFloat(ExtraSpot.findOne().multiplier) || 2;
    var nowGold = parseFloat(Gold.findOne().data);
    var newtj = Money.findOne({
      userId: userId
    }).gold * nowGold * multiplier;
    //send email
    var text = "Hello,\nYou Account is Successfully Credited with " + numberWithCommas((parseFloat(Amount)).toFixed(2)) + " GoldDollar \nTransaction Number : " + tid + "\nYour New GoldDollar Balance is: \n" + numberWithCommas((parseFloat(newtj)).toFixed(2)) + "\n\nFor More Info Login To Your Account";
    html = Meteor.call('generateEmail', text.replace(/\n/g, "<br />"));
    var email = Profile.findOne({
      userId: userId
    }).email;
    Meteor.call("sendEmail", "TexasGoldCard: Amount Credited Successfully", html, email);
    // Email.send({
    //     to: ,
    //     from: "no-reply@texasgoldcard.com",
    //     subject: "TexasGoldCard: Amount Credited Successfully",
    //     text: text
    // });
    return 1;
  },
  rejectPurchaseRequest: (request, id) => {
    if (Meteor.user() && Meteor.user().profile.admin !== true) {
      throw new Error(400, 'Not Found');
    }
    PurchaseRequest.update({
      _id: id
    }, {
      $set: {
        "status": "rejected"
      }
    });
    var tid = Transaction.insert({
      From: Meteor.users.findOne({
        username: Meteor.settings.private.houseTjEmail
      })._id,
      To: request.userId,
      TJTransfer: 0,
      Date: new Date(),
      createdAt: new Date(),
      remarks: "Purchase Request of " + request.amount + "Oz " + request.membership + " Rejected",
      goldVal: request.price,
      membership: "gold"
    });
    var multiplier = parseFloat(ExtraSpot.findOne().multiplier) || 2;
    var nowGold = parseFloat(Gold.findOne().data);
    var newtj = Money.findOne({
      userId: request.userId
    }).gold * nowGold * multiplier;
    //send email
    text = "Hello,\nYour Request of Amount " + request.amount + "Oz " + request.membership + " Rejected \nTransaction Number : " + tid + "\nYour New GoldDollar Balance is: \n" + (parseFloat(newtj.toFixed(2))) + "\n\nFor More Info Login To Your Account";
    var email = Profile.findOne({
      userId: request.userId
    }).email;
    html = Meteor.call('generateEmail', text.replace(/\n/g, "<br />"));
    Meteor.call("sendEmail", "TexasGoldCard: Request Rejected ", html, email);
    return true;
  },
})
