module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: "192.241.152.237",
      username: "root",
      // pem: "./texasgold.pem"
      password: "advanta!1234"
      // or neither for authenticate from ssh-agent
    }
  },

  app: {
    // TODO: change app name and path
    name: "texasgold",
    path: ".",

    servers: {
      one: {}
    },

    buildOptions: {
      serverOnly: true
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      PORT: 2010,
      ROOT_URL: "http://192.241.152.237/texasGold:2010",
      MONGO_URL: "mongodb://mongodb/meteor",
      MONGO_OPLOG_URL: "mongodb://mongodb/local"
    },

    docker: {
      // change to 'abernix/meteord:base' if your app is using Meteor 1.4 - 1.5
      image: "abernix/meteord:base",
      prepareBundle: false
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },
  setupPhantom: true,
  setupNode: true,
  nodeVersion: "11.4.0",

  mongo: {
    version: "3.4.1",
    servers: {
      one: {}
    }
  }

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

  // proxy: {
  //   domains: 'mywebsite.com,www.mywebsite.com',

  //   ssl: {
  //     // Enable Let's Encrypt
  //     letsEncryptEmail: 'email@domain.com'
  //   }
  // }
};
