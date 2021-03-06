"use strict";
require("dotenv").config();

const express = require("express");
const httpErrors = require("http-errors");
const pino = require("pino");
const pinoHttp = require("pino-http");

module.exports = function main(options, cb) {
  // Set default options
  const ready = cb || function () {};
  const opts = Object.assign(
    {
      port: "8000",
      host: "0.0.0.0",
    },
    options
  );

  const logger = pino();

  // Server state
  let server;
  let serverStarted = false;
  let serverClosing = false;

  // Setup error handling
  function unhandledError(err) {
    // Log the errors
    logger.error(err);

    // Only clean up once
    if (serverClosing) {
      return;
    }
    serverClosing = true;

    // If server has started, close it down
    if (serverStarted) {
      server.close(function () {
        process.exit(1);
      });
    }
  }
  process.on("uncaughtException", unhandledError);
  process.on("unhandledRejection", unhandledError);

  // Create the express app
  const app = require("./config/express")({ express });

  // Common middleware
  // app.use(/* ... */)
  app.use(pinoHttp({ logger }));

  // Common error handlers
  app.use(function fourOhFourHandler(req, res, next) {
    next(httpErrors(404, `Route not found: ${req.url}`));
  });
  app.use(function fiveHundredHandler(err, req, res, next) {
    if (err.status >= 500) {
      logger.error(err);
    }
    res.status(err.status || 500).json({
      messages: [
        {
          code: err.code || "InternalServerError",
          message: err.message,
        },
      ],
    });
  });

  // Start server
  server = app.listen(opts.port, opts.host, function (err) {
    if (err) {
      return ready(err, app, server);
    }

    // If some other error means we should close
    if (serverClosing) {
      return ready(new Error("Server was closed before it could start"));
    }

    require("./app/models");

    serverStarted = true;
    const addr = server.address();
    logger.info(
      `Started at ${opts.host || addr.host || "localhost"}:${addr.port}`
    );
    ready(err, app, server);
  });
};
