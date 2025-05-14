'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'fake1@user.io',
        username: 'Donald Duck',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        email: 'fake2@user.io',
        username: 'MJackson',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'barack@user.io',
        username: 'Barack Obama',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['Donald Duck', 'MJackson', 'Barack Obama'] }
    }, {});
  }
};