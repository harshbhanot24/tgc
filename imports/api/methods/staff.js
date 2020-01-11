import {
  Meteor
} from 'meteor/meteor';
import {
  Email
} from 'meteor/email';
import {
  ShipmentDetails
} from '../../collections/ShipmentDetails';
import sharp from 'sharp';
import {
  Distributor
} from '../../collections/Distributor';
import {
  StaffActivity
} from '../../collections/StaffActivity';
import {
  StaffRequest
} from '../../collections/StaffRequest';
import {
  MoveToVault
} from '../../collections/MoveToVault';

import {
  Vault
} from '../../collections/Vault';


Meteor.methods({
  addShipmentDetails: function({
    date,
    time,
    material,
    type,
    purchaseOrderNumber,
    methodShipment,
    trackingNumber,
    signingPerson,
    barSerial,
    numberOfBarCoin,
    imgURL
  }) {
    az = signingPerson;
    signingPerson = az.slice(az.indexOf("(")).replace("(", "").replace(")", "");
    signingPersons = Meteor.users.findOne({
      username: signingPerson
    });
    signingPersonName = signingPersons.profile.name;
    signingPersonId = signingPersons._id;
    var id = ShipmentDetails.insert({
      date,
      time,
      material,
      type,
      purchaseOrderNumber,
      methodShipment,
      trackingNumber,
      barSerial, //array contain barSerial,ounceWeight
      numberOfBarCoin,
      signingPerson,
      imgURL,
      createdAt: new Date()
    });
    try {
      Email.send({
        to: Meteor.users.findOne({
          "profile.admin": true
        }).username,
        from: "no-reply@texasgoldcard.com",
        subject: "TexasGoldCard: Shipment Info",
        text: "New Shipment is Arrived \n\n Shipment Tracking Number:" + trackingNumber + " of " + methodShipment + " and purchase Order Number : " + purchaseOrderNumber + "\n\nSigned By :" + signingPerson + "(Yet To Confirmed)\n\TexasGoldCard"
      });
      if (Distributor.findOne().email != "") Email.send({
        to: Distributor.findOne().email,
        from: "no-reply@TexasGoldCard.com",
        subject: "TexasGoldCard: Shipment Info",
        text: "New Shipment is Arrived \n\n Shipment Tracking Number:" + trackingNumber + " of " + methodShipment + " and purchase Order Number : " + purchaseOrderNumber + "\n\nSigned By :" + signingPerson + "(Yet To Confirmed)\n\nTexasGoldCard"
      });
    } catch (e) {}
    StaffActivity.insert({
      userId: Meteor.userId(),
      name: Meteor.user().profile.name,
      numberOfBarCoin: numberOfBarCoin,
      img: Meteor.user().profile.userImg,
      message: "Shipment is Added by " + Meteor.user().profile.name + " with Shipment Tracking Number:" + trackingNumber + " signed By:" + signingPersonName,
      createdAt: new Date()
    });
    StaffActivity.insert({
      userId: signingPersonId,
      name: signingPersons.profile.name,
      numberOfBarCoin: numberOfBarCoin,
      img: signingPersons.profile.userImg,
      message: "Shipment is Added by " + Meteor.user().profile.name + " with Shipment Tracking Number:" + trackingNumber + " signed By:" + signingPersonName,
      createdAt: new Date()
    });
    reqId = StaffRequest.find().count() + 1;
    StaffRequest.insert({
      requestId: reqId,
      userId: signingPersonId,
      name: signingPersons.profile.name,
      img: signingPersons.profile.userImg,
      createdAt: new Date(),
      requestType: "shipment",
      requestTypeId: id,
      requestStatus: undefined,
      message: "You Recieved(Signed) Shipment With Tracking Number: " + trackingNumber + " Shipment is Added By:" + Meteor.user().profile.name
    });
    return true;
  },
  acceptRequest: function(id) {
    var shipment = StaffRequest.findOne({
      _id: id
    });
    StaffRequest.update({
      _id: id
    }, {
      $set: {
        requestStatus: true
      }
    });
    try {
      if (shipment.requestType == "shipment") {
        var id = shipment.requestTypeId;
        var shipDetails = ShipmentDetails.findOne({
          _id: id
        });
        Email.send({
          to: Meteor.users.findOne({
            "profile.admin": true
          }).username,
          from: "no-reply@TexasGoldCard.com",
          subject: "TexasGoldCard: Shipment Info",
          text: "Status of Shipment Updated: \n\n Shipment Tracking Number:" + shipDetails.trackingNumber + " of " + shipDetails.methodShipment + " and purchase Order Number : " + shipDetails.purchaseOrderNumber + "\n\nSigned By :" + shipDetails.signingPerson + "(Confirmed)\n\nTGC"
        });
        if (Distributor.findOne().email != "") Email.send({
          to: Distributor.findOne().email,
          from: "no-reply@TexasGoldCard.com",
          subject: "TexasGoldCard: Shipment Info",
          text: "Status of Shipment Updated: \n\n Shipment Tracking Number:" + shipDetails.trackingNumber + " of " + shipDetails.methodShipment + " and purchase Order Number : " + shipDetails.purchaseOrderNumber + "\n\nSigned By :" + shipDetails.signingPerson + "(Confirmed)\n\nTGC"
        });
      } else if (shipment.requestType == "witness") {
        var id = shipment.requestTypeId;
        var shipDetails = MoveToVault.findOne({
          _id: id
        });

        Email.send({
          to: Meteor.users.findOne({
            "profile.admin": true
          }).username,
          from: "no-reply@TexasGoldCard.com",
          subject: "TexasGoldCard: Move To Vault Info",
          text: "Update Vault Movement Details: \n\n Vault Number:" + shipDetails.vaultNumber + "\n Shelf Number" + shipDetails.shelfNumber + "\n Box Number " + shipDetails.boxNumber + "\n Number of Bar Coin:" + shipDetails.numberOfBarCoin + "\nWitness By :" + shipDetails.witnessPerson + "(Confirmed)\n\nTGC"
        });
      } else if (shipment.requestType == "whotransfer") {
        var id = shipment.requestTypeId;
        var shipDetails = MoveToVault.findOne({
          _id: id
        });
        Email.send({
          to: Meteor.users.findOne({
            "profile.admin": true
          }).username,
          from: "no-reply@TexasGoldCard.com",
          subject: "TexasGoldCard: Move To Vault Info",
          text: "Update Vault Movement Details: \n\n Vault Number:" + shipDetails.vaultNumber + "\n Shelf Number" + shipDetails.shelfNumber + "\n Box Number " + shipDetails.boxNumber + "\n Number of Bar Coin:" + shipDetails.numberOfBarCoin + "\nTransfer By :" + shipDetails.whoTransferPerson + "(Confirmed)\n\nTGC"
        });
      }
    } catch (e) {}

    return true;
  },
  rejectRequest: function(id) {
    shipment = StaffRequest.findOne({
      _id: id
    });
    try {
      if (shipment.requestType == "shipment") {
        var id = shipment.requestTypeId;
        var shipDetails = ShipmentDetails.findOne({
          _id: id
        });
        Email.send({
          to: Meteor.users.findOne({
            "profile.admin": true
          }).username,
          from: "no-reply@TexasGoldCard.com",
          subject: "TexasGoldCard: Shipment Info",
          text: "Status of Shipment Updated: \n\n Shipment Tracking Number:" + shipDetails.trackingNumber + " of " + shipDetails.methodShipment + " and purchase Order Number : " + shipDetails.purchaseOrderNumber + "\n\nSigned By :" + shipDetails.signingPerson + "(Decline)\n\nTGC"
        });
        if (Distributor.findOne().email != "") Email.send({
          to: Distributor.findOne().email,
          from: "no-reply@TexasGoldCard.com",
          subject: "TexasGoldCard: Shipment Info",
          text: "Status of Shipment Updated: \n\n Shipment Tracking Number:" + shipDetails.trackingNumber + " of " + shipDetails.methodShipment + " and purchase Order Number : " + shipDetails.purchaseOrderNumber + "\n\nSigned By :" + shipDetails.signingPerson + "(Decline)\n\nTGC"
        });
      } else if (shipment.requestType == "witness") {
        var id = shipment.requestTypeId;
        var shipDetails = MoveToVault.findOne({
          _id: id
        });
        Email.send({
          to: Meteor.users.findOne({
            "profile.admin": true
          }).username,
          from: "no-reply@TexasGoldCard.com",
          subject: "TexasGoldCard: Move To Vault Info",
          text: "Update Vault Movement Details: \n\n Vault Number:" + shipDetails.vaultNumber + "\n Shelf Number" + shipDetails.shelfNumber + "\n Box Number " + shipDetails.boxNumber + "\n Number of Bar Coin:" + shipDetails.numberOfBarCoin + "\nWitness By :" + shipDetails.witnessPerson + "(Decline)\n\nTGC"
        });
      } else if (shipment.requestType == "whotransfer") {
        var id = shipment.requestTypeId;
        var shipDetails = MoveToVault.findOne({
          _id: id
        });
        Email.send({
          to: Meteor.users.findOne({
            "profile.admin": true
          }).username,
          from: "no-reply@TexasGoldCard.com",
          subject: "TexasGoldCard: Move To Vault Info",
          text: "Update Vault Movement Details: \n\n Vault Number:" + shipDetails.vaultNumber + "\n Shelf Number" + shipDetails.shelfNumber + "\n Box Number " + shipDetails.boxNumber + "\n Number of Bar Coin:" + shipDetails.numberOfBarCoin + "\nTransfer By :" + shipDetails.whoTransferPerson + "(Decline)\n\nTGC"
        });
      }
    } catch (e) {}
    StaffRequest.update({
      _id: id
    }, {
      $set: {
        requestStatus: false
      }
    });
  },
  MoveToVaults: function({
    date,
    time,
    material,
    vaultNumber,
    shelfNumber,
    boxNumber,
    numberOfBarCoin,
    witnessPerson,
    whoTransferPerson,
    imgURL,
    barSerial,
    shipID
  }) {
    function findByMatchingProperties(set, properties) {
      return set.filter(function(entry) {
        return Object.keys(properties).every(function(key) {
          return entry[key] === properties[key];
        });
      });
    }
    az = witnessPerson;
    witnessPerson = az.slice(az.indexOf("(")).replace("(", "").replace(")", "");
    witnessPersonI = Meteor.users.findOne({
      username: witnessPerson
    });
    az = whoTransferPerson;
    whoTransferPerson = az.slice(az.indexOf("(")).replace("(", "").replace(")", "");
    whoTransferPersonI = Meteor.users.findOne({
      username: whoTransferPerson
    });
    var err = false;
    var invalid = [];
    for (var i = 0; i < barSerial.length; i++) { //check for all serial valid or not
      if (ShipmentDetails.findOne({ //invalid shipment
          trackingNumber: shipID[i]
        }) == undefined) {
        err = true;
        invalid.push(barSerial[i]);
      } else if (findByMatchingProperties(ShipmentDetails.findOne({
          trackingNumber: shipID[i]
        }).barSerial, {
          barSerial: barSerial[i]
        }).length == 0) {
        err = true;
        invalid.push(barSerial[i]);
      }
      if (Vault.find({ //already register
          serialNo: barSerial[i]
        }).count() > 0) {
        err = true;
        invalid.push(barSerial[i]);
      }
    }
    if (err) {
      throw new Meteor.Error(400, "Bar Serial number invalid(Either Shipment Detail mismatch or already registered serial number). Serial Numbers (" + invalid.join(',') + ")");
    }
    var id = MoveToVault.insert({
      userId: Meteor.userId(),
      date: date,
      time: time,
      material: material,
      vaultNumber: vaultNumber,
      shelfNumber: shelfNumber,
      boxNumber: boxNumber,
      barSerial: barSerial,
      shipID: shipID,
      numberOfBarCoin: numberOfBarCoin,
      witnessPerson: witnessPerson,
      whoTransferPerson: whoTransferPerson,
      imgURL: imgURL,
      createdAt: new Date()
    });
    for (var i = 0; i < barSerial.length; i++) {
      var weight = findByMatchingProperties(ShipmentDetails.findOne({
        trackingNumber: shipID[i]
      }).barSerial, {
        barSerial: barSerial[i]
      })[0].ounceWeight;
      // for(var j=0; j<parseInt(weight);j++){
      Vault.insert({
        serialNo: barSerial[i],
        vaultNo: vaultNumber,
        shelfNo: shelfNumber,
        boxNo: boxNumber,
        weight: parseFloat(weight),
        left: parseFloat(weight),
        assignTo: [],
        membership: material,
        createdAt: new Date()
      });
      // assign {userid:,amount:}
      // }
    }
    try {
      var email = Meteor.users.findOne({
        "profile.admin": true
      }).username;
      var text = "Vault Movement Details: \n\n Vault Number:" + vaultNumber + "\n Shelf Number" + shelfNumber + "\n Box Number " + boxNumber + "\n Number of Bar Coin:" + numberOfBarCoin + "\nTransfered By : " + whoTransferPerson + "(yet to confirm)\nWitness By :" + witnessPerson + "(yet to confirm)\n\nTGC";
      var html = Meteor.call('generateEmail', text.replace(/\n/g, "<br />"));
      Meteor.call("sendEmail", subject, html, email);
      // Email.send({
      //     to: Meteor.users.findOne({
      //         "profile.admin": true
      //     }).username,
      //     from: "no-reply@TexasGoldCard.com",
      //     subject: "TexasGoldCard: Move To Vault Info",
      //     text: "Vault Movement Details: \n\n Vault Number:" + vaultNumber + "\n Shelf Number" + shelfNumber + "\n Box Number " + boxNumber + "\n Number of Bar Coin:" + numberOfBarCoin + "\nTransfered By : " + whoTransferPerson + "(yet to confirm)\nWitness By :" + witnessPerson + "(yet to confirm)\n\nTGC"
      // });
    } catch (e) {}
    StaffActivity.insert({
      userId: Meteor.userId(),
      name: Meteor.user().profile.name,
      numberOfBarCoin: numberOfBarCoin,
      img: Meteor.user().profile.userImg,
      message: "Vault Movement Log is Added by " + Meteor.user().profile.name + "(You). Vault  Number:" + vaultNumber + " & Number of Bar/Coin: " + numberOfBarCoin,
      createdAt: new Date()
    });
    StaffActivity.insert({
      userId: whoTransferPersonI._id,
      name: whoTransferPersonI.profile.name,
      numberOfBarCoin: numberOfBarCoin,
      img: whoTransferPersonI.profile.userImg,
      message: "Vault Movement Log is Added by " + Meteor.user().profile.name + "You Transer the Bar/Coin to Vault Number: " + vaultNumber + " & Number of Bar/Coin Transfer: " + numberOfBarCoin,
      createdAt: new Date()
    });
    StaffActivity.insert({
      userId: witnessPersonI._id,
      name: witnessPersonI.profile.name,
      numberOfBarCoin: numberOfBarCoin,
      img: witnessPersonI.profile.userImg,
      message: "Vault Movement Log is Added by " + Meteor.user().profile.name + " to Vault Number:" + vaultNumber + ", Number of Bar/Coin Transfer: " + numberOfBarCoin + " & You are witness of this Movement.",
      createdAt: new Date()
    });
    reqId = StaffRequest.find().count() + 1;
    StaffRequest.insert({
      requestId: reqId,
      userId: witnessPersonI._id,
      name: witnessPersonI.profile.name,
      img: witnessPersonI.profile.userImg,
      createdAt: new Date(),
      requestType: "witness",
      requestTypeId: id,
      requestStatus: undefined,
      message: "You are Witness Movement of " + numberOfBarCoin + " Bar/Coin to Vault Number" + vaultNumber + ", Shelf Number: " + shelfNumber + ", Box Number" + boxNumber,
    });
    StaffRequest.insert({
      requestId: reqId,
      userId: whoTransferPersonI._id,
      name: whoTransferPersonI.profile.name,
      img: whoTransferPersonI.profile.userImg,
      createdAt: new Date(),
      requestType: "whotransfer",
      requestTypeId: id,
      requestStatus: undefined,
      message: "You Transfer " + numberOfBarCoin + " Bar/Coin to Vault Number" + vaultNumber + ", Shelf Number: " + shelfNumber + ", Box Number" + boxNumber
    });
  },
  uploadStaffImg: function(img, filename) {
    const AWS = require('aws-sdk');
    AWS.config.update({
      accessKeyId: Meteor.settings.private.s3.AccessKey,
      secretAccessKey: Meteor.settings.private.s3.SecretKey,
      region: Meteor.settings.private.s3.region
    });
    let s3 = new AWS.S3();
    const imageBuffer = Buffer.from(img.replace(/^data:image\/(png|gif|jpeg|jpg);base64,/, ''), 'base64');
    let fileName = filename || Meteor.userId() + '-' + new Date().getTime() + '.jpg';
    let compressAndUpload = Meteor.wrapAsync((imageBuffer, callback2) => {
      sharp(imageBuffer).toBuffer().then(buffer => {
        let data = {
          Bucket: Meteor.settings.private.s3.bucket,
          Key: 'staff/images/' + fileName,
          Body: buffer,
          ContentEncoding: 'base64',
          ContentType: 'image/jpg'
        };
        let upload = Meteor.wrapAsync((data,callback)=> {
          s3.upload(data, Meteor.bindEnvironment((err, res) => {
            //call meteor delete
            console.log('staff Uploaded', res.Location + " - "+new Date().getTime());
            callback(err, res);
          }));
        })
        let result = upload(data);
        callback2(null, result.Location);
      });
    })
    return compressAndUpload(imageBuffer);
  }

})
