import {
  Meteor
} from 'meteor/meteor';
import {
  Profile
} from '../../collections/Profile';
import {
  Money
} from '../../collections/Money';
import {
  Transaction
} from '../../collections/Transaction';
import {
  RecentTransferUser
} from '../../collections/RecentTransferUser';
import {
  StaffRequest
} from '../../collections/StaffRequest';
import {
  StaffActivity
} from '../../collections/StaffActivity';

Meteor.publish('profile', function() {
  return Profile.find({
    userId: this.userId
  }, {
    fields: {
      resetEmailSent: 0,
      merchantRequest: 0,
      merchantRequestTime: 0,
      questionPassword: 0,
      questionPassword2: 0,
      profilePasswd: 0
    }
  });
});

Meteor.publish('balance', function() {
  return Money.find({
    userId: this.userId
  }, {
    fields: {
      resetPinToken: 0,
      PIN: 0,
      feesTime: 0
    }
  });
});

Meteor.publish('transaction', function(options) {
  return Transaction.find({
    $or: [{
      From: this.userId
    }, {
      To: this.userId
    }]
  }, {
    sort: {
      createdAt: -1,
      limit: options.limit || 10,
      skip: options.skip || 0
    }
  });
});


Meteor.publish('RecentTransferUser', function() {
  return RecentTransferUser.find({
    userId: this.userId
  });
});

Meteor.publish('activity', function() {
  return StaffActivity.find({
    userId: this.userId
  }, {
    sort: {
      createdAt: -1
    }
  });
});
Meteor.publish('requestA', function() {
  return StaffRequest.find({
    $and: [{
      userId: this.userId
    }, {
      requestStatus: undefined
    }]
  }, {
    sort: {
      createdAt: -1
    }
  });
});
