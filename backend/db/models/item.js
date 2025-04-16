'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    accessToken: {
      type: DataTypes.STRING,
      allowNull: false
    },
    itemId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    userExternalId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'externalId'
      }
    },
    institutionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    institutionName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    webhook: {
      type: DataTypes.STRING,
      allowNull: true
    },
    error: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {});

  Item.createItem = async function (accessToken, itemId, userExternalId) {
    const item = await Item.create({ accessToken, itemId, userExternalId });
    return await Item.findOne({ where: { itemId } });
  };
  Item.updateItem = async function (itemId, accessToken) {
    const item = await Item.update({ accessToken }, { where: { itemId } });
    return await Item.findOne({ where: { itemId } });
  };
  Item.deleteItem = async function (itemId) {
    const item = await Item.destroy({ where: { itemId } });
    console.log('Item deleted:', item);
    // FIXME: not sure what to return here
    return ;
  };

  Item.getItemsForUser = async function (externalId) {
    return await Item.findAll({ where: { userExternalId: externalId } });
  };
  Item.getItemById = async function (itemId) {
    return await Item.findOne({ where: { itemId } });
  };
  
  Item.associate = function(models) {
    Item.belongsTo(models.User, {
      foreignKey: 'userExternalId', // field on Item model
      targetKey: 'externalId',      // field on User model
      as: 'user'
    });
  };
  
  return Item;
};