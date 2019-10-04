"use strict";

const Bell = require("@hapi/bell");
const Hapi = require("@hapi/hapi");

const internals = {};

internals.start = async function() {
  const server = Hapi.server({ port: 3000 });
  await server.register(Bell);

  // Make sure to set a "Callback URL" and
  // check the "Allow this application to be used to Sign in with Twitter"
  // on the "Settings" tab in your Twitter application

  server.auth.strategy("twitter", "bell", {
    provider: "twitter",
    password: "cookie_encryption_password_secure",
    isSecure: false,
    clientId: "SHxg66zPFbTwr1kpXQotn4Il7", // Set client id
    clientSecret: "ytwJBGJWigTXUfseSb6koQYFgGxKrsZLh1Jj1K1qEkcdStUG2F" // Set client secret
  });

  server.route({
    method: ["GET", "POST"],
    path: "/auth/twitter/callback",
    options: {
      auth: {
        strategy: "twitter",
        mode: "try"
      },
      handler: function(request, h) {
        debugger;
        if (!request.auth.isAuthenticated) {
          return `Authentication failed due to: ${request.auth.error.message}`;
        }
        return "<pre>" + JSON.stringify(request.auth.credentials, null, 4) + "</pre>";
      }
    }
  });

  // server.route({
  //   method: "GET",
  //   path: "/",
  //   options: {
  //     handler: function(request, h) {
  //       return "Hello world!";
  //     }
  //   }
  // });

  await server.start();
  console.log("Server started at:", server.info.uri);
};

internals.start();
