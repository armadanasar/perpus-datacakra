const cors = require("cors");
const appRoutes = require("../app/routes");

module.exports = ({ express }) => {
  const app = express();

  app.use(cors());
  appRoutes(app, express);

  app.get("/", (req, res) => res.send("Ok"));

  return app;
};
