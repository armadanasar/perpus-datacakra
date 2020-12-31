const cors = require("cors");
const bodyParser = require("body-parser");
const appRoutes = require("../app/routes");

module.exports = ({ express }) => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  appRoutes(app, express);

  app.get("/", (req, res) => res.send("Ok"));

  return app;
};
