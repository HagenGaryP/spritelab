const Sequelize = require('sequelize');
const db = require('./db');

const Session = db.define('session', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

module.exports = Session;
