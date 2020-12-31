module.exports = (app, { Router }) => {
  const router = new Router();
  const v1 = require("./v1")({ Router });

  router.use("/v1", v1);
  router.use("/", v1);

  app.use(router);
};
