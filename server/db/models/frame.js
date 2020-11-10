const Sequelize = require('sequelize');
const db = require('../db');

const Frame = db.define('frame', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  grid: {
    type: Sequelize.JSON,
  },
});

module.exports = Frame;
