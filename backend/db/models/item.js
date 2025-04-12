'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    accessToken: DataTypes.STRING,
    itemId: DataTypes.STRING,
    userExternalId: DataTypes.UUID
  }, {});

  Item.associate = function(models) {
    Item.belongsTo(models.User, {
      foreignKey: 'userExternalId', // field on Item model
      targetKey: 'externalId',      // field on User model
      as: 'user'
    });
  };
  
  return Item;
};