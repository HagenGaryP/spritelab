const Sequelize = require('sequelize');
const db = require('../db');

const Session = db.define('session', {
  name: {
    type: Sequelize.STRING,
    defaultValue: 'canvas',
    // allowNull: false,
    // validate: {
    //   notEmpty: true,
    // },
  },
  // frames: {
  //   type: Sequelize.ARRAY(Sequelize.JSONB),
  // },
  canvas: {
    // type: Sequelize.JSONB,
    type: Sequelize.ARRAY(Sequelize.JSONB),
    // validate: {
    //   isValidFormat(value) {
    //     for (let i = 0; i < value.length; i++) {
    //       if (!Array.isArray(value[i])) {
    //         throw new Error('Bad Value');
    //       }
    //     }
    //   },
    // },
  },
});

module.exports = Session;
