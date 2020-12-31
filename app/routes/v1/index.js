const fs = require("fs");
const path = require("path");

module.exports = ({ Router }) => {
  const router = new Router();

  fs.readdirSync(`${__dirname}/`).forEach((file) => {
    const extname = path.extname(file);
    const basename = path.basename(file, extname);

    if (file.indexOf(".js") > 0 && basename !== "index") {
      const loadFile = require(`./${basename}`)({ Router });
      console.log("basename", basename);
      router.use(`/${basename}`, loadFile);
    }
  });

  return router;
};
