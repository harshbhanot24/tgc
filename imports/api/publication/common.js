import {
  Meteor
} from 'meteor/meteor';
import {
  Gold
} from '../../collections/Gold';
import {
  Silver
} from '../../collections/Silver';
import {
  ExtraSpot
} from '../../collections/ExtraSpot';
import {
  Profile
} from '../../collections/Profile';
import {
  Distributor
} from '../../collections/Distributor';
import {
  PurchaseRequest
} from '../../collections/PurchaseRequest';
import {
  Money
} from '../../collections/Money';
import {
  Transaction
} from '../../collections/Transaction';
import {
  BlockChain
} from '../../collections/BlockChain';
import {
  TJRedeem
} from '../../collections/TJRedeem';
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
import {
  Vault
} from '../../collections/Vault';

Meteor.publish('Gold', function() {
  return Gold.find();
});
Meteor.publish('Silver', function() {
  return Silver.find();
});

Meteor.publish('admin-db', function(options) {
  if (this.userId && Meteor.users.findOne({
      _id: this.userId
    }).profile.admin) {
    let dbName = options.dbName;
    let page = parseInt(options.page || 1) - 1;
    let max = options.max || 20;
    if (eval(dbName))
      return eval(dbName).find({}, {
        fields: {
          key: 0,
          profilePasswd: 0,
          "services": 0,
          "profile.loginInformation": 0,
          "loginInformation": 0
        },
        limit: max,
        skip: max * page,
        sort: {
          createdAt: -1
        }
      });
    else return null
  }
})

Meteor.publish('extraSpot', function() {
  if (this.userId && Meteor.users.findOne({
      _id: this.userId
    }).profile.admin)
    return ExtraSpot.find();
});

Meteor.publish('distributor', function() {
  if (this.userId && Meteor.users.findOne({
      _id: this.userId
    }).profile.admin) {
    return Distributor.find();
  }
});

Meteor.publish('purchaseRequest', function() {
  if (this.userId && Meteor.users.findOne({
      _id: this.userId
    }).profile.admin) {
    const self = this;
    let observer = PurchaseRequest.find({
      status: "progress"
    }).observe({
      added: function(entry) {
        let userId = entry.userId;
        let user = Profile.findOne({
          userId
        })
        self.added("purchaseRequest", entry._id, { ...entry,
          name: user.fullname,
          address: user.address,
          email: user.email,
          phone: user.phone
        });
      },
      changed: function(newDocument, oldDocument) {
        self.changed('purchaseRequest', oldDocument._id, oldDocument);
      },
      removed: function(oldDocument) {
        self.removed('purchaseRequest', oldDocument._id);
      }
    });
    self.onStop(function() {
      observer.stop();
    });
    self.ready();
  }
});

Meteor.publish('Multiplier', function() {
  if (this.userId)
    return ExtraSpot.find({}, {
      fields: {
        multiplier: 1
      }
    });
});
