"use strict";

const Bell = require("@hapi/bell");
const Hapi = require("@hapi/hapi");
const Cookie = require("@hapi/cookie");

const internals = {};

internals.start = async function() {
  const server = Hapi.server({ port: 3000 });
  await server.register([Bell, Cookie]);

  //Setup the session strategy
  // server.auth.strategy("session", "cookie", {
  //   password: "cookie_encryption_password_secure", //Use something more secure in production
  //   redirectTo: "/auth/twitter", //If there is no session, redirect here
  //   isSecure: false //Should be set to true (which is the default) in production
  // });

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
        if (!request.auth.isAuthenticated) {
          return `Authentication failed due to: ${request.auth.error.message}`;
        }
        // const profile = request.auth.credentials.profile;

        // request.cookieAuth.set({
        //   twitterId: profile.id,
        //   username: profile.username,
        //   displayName: profile.displayName
        // });

        // return reply.redirect("/");
        return "<pre>" + JSON.stringify(request.auth.credentials, null, 4) + "</pre>";
      }
    }
  });

  server.route({
    method: "GET",
    path: "/",
    config: {
      // auth: {
      //   strategy: "session", //<-- require a session for this, so we have access to the twitter profile
      //   mode: "try"
      // },
      handler: function(request, reply) {
        // Return a message using the information from the session
        // return reply("Hello, " + request.auth.credentials.displayName + "!");
        return reply("Congrats you are logged in to Twitter!");
      }
    }
  });

  await server.start();
  console.log("Server started at:", server.info.uri);
};

internals.start();
