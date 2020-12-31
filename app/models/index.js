const { MONGO_URI, NODE_ENV } = process.env;
const mongoose = require("mongoose");
const fs = require("fs");

if (NODE_ENV === "test" && !MONGO_URI.includes("localhost"))
  throw new Error("cannot run test on non localhost db!");

const db = {
  models: {},
  mongoose,
};

fs.readdirSync(`${__dirname}/`)
  .filter((fileName) => fileName.indexOf(".js") >= 0 && fileName != "index.js")
  .forEach((modelFile) => {
    const modelName = modelFile.replace(".js", "");
    const currentModel = require(`${__dirname}/${modelFile}`);
    db.models[modelName] = currentModel;
  });

db.mongoConnection = () => mongoose.connect(MONGO_URI, { keepAlive: 1 });

db.mongoConnection()
  .then(() => console.log("connected to mongo"))
  .catch((err) => console.error(err));

module.exports = db;
