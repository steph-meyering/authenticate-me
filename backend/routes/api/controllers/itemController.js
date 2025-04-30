const plaidClient = require("../../../utils/plaidClient");
const { Item } = require("../../../db/models");

exports.savePlaidItem = async ({ access_token, item_id, userExternalId }) => {
  try {
    await Item.create({
      accessToken: access_token,
      itemId: item_id,
      userExternalId,
    });
    console.log('Item created successfully');
  }
  catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

exports.updateItemMetadata = async (access_token) => {
  try {
    console.log('Updating item metadata...');
    console.log('access_token type:', typeof access_token);
    console.log('access_token value:', access_token);
    const itemGetResponse = await plaidClient.itemGet({ access_token });

    const { item_id, institution_id, institution_name, webhook, error } = itemGetResponse.data.item;
    // Safe, minimal logging for debug
    console.log('item:', {
      item_id,
      institution_id,
      institution_name,
      webhook,
      error: error ? error.message || error : null,
    });


    await Item.updateItem(item_id, {
      institutionId: institution_id,
      institutionName: institution_name,
      webhook,
      error,
    });
    console.log('Item metadata updated successfully');
  } catch (error) {
    console.error('Error updating item metadata:', error);
    throw error;
  }
}

// verify here


// exports.getPlaidAccounts = async (access_token) => {
//   try {
//     const response = await plaidClient.accountsGet({ access_token });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching accounts:', error);
//     throw error;
//   }
// };
// exports.deletePlaidItem = async (access_token) => {
//   try {
//     const response = await plaidClient.itemRemove({ access_token });
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting item:', error);
//     throw error;
//   }
// };
// exports.updatePlaidItem = async (item_id, updateData) => {
//   try {
//     const response = await Item.updateItem(item_id, updateData);
//     return response;
//   } catch (error) {
//     console.error('Error updating item:', error);
//     throw error;
//   }
// };