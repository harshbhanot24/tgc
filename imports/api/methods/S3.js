import {
  Meteor
} from 'meteor/meteor';
Meteor.methods({
  delete_s3: function(key) {
    const AWS = require('aws-sdk');
    AWS.config.update({accessKeyId: Meteor.settings.private.s3.AccessKey, secretAccessKey: Meteor.settings.private.s3.SecretKey, region: Meteor.settings.private.s3.region});
    var s3 = new AWS.S3();
    var params = {
      Bucket: Meteor.settings.private.s3.bucket,
      Key: key
    };
    var deleteObject = Meteor.wrapAsync(s3.deleteObject(params, function(error, data) {
      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }
    }));
  }
});
