const Frame = require('./frame');
const Session = require('./session');
const User = require('./user');

// associations

// User.belongsToMany(Frame, { through: Session });
// Frame.belongsToMany(User, { through: Session });

User.belongsTo(Session);

module.exports = {
  Frame,
  Session,
  User,
};
