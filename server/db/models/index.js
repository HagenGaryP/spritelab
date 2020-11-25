const Frame = require("./frame");
const Session = require("./session");
const User = require("./user");

// associations
Session.belongsTo(User);
User.hasOne(Session);

module.exports = {
  Frame,
  Session,
  User,
};
