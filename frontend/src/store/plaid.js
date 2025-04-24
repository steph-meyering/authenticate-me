import { csrfFetch } from './csrf';
const SET_LINK_TOKEN = "plaid/SET_LINK_TOKEN";
const SET_ACCESS_TOKEN = "plaid/SET_ACCESS_TOKEN";
const SET_ACCOUNTS = "plaid/SET_ACCOUNTS";
const ADD_ITEM = "plaid/ADD_ITEM";
const DELETE_ITEM = "plaid/DELETE_ITEM";
const SET_ITEMS = "plaid/SET_ITEMS";
const RESET_PLAID = "plaid/RESET_PLAID";

// Action creators
const setLinkToken = (token) => ({ type: SET_LINK_TOKEN, payload: token });
const setAccessToken = (token) => ({ type: SET_ACCESS_TOKEN, payload: token });
const setAccounts = (accounts) => ({ type: SET_ACCOUNTS, payload: accounts });
const addItem = (item) => ({ type: ADD_ITEM, payload: item });
const setItems = (items) => ({ type: SET_ITEMS, payload: items });
const deleteItemAction = (access_token) => ({
  type: DELETE_ITEM,
  payload: access_token,
});

export const resetPlaid = () => ({ type: RESET_PLAID });

// Thunks
export const createLinkToken = (external_id) => async dispatch => {
  const response = await csrfFetch('/api/plaid/create_link_token', { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ external_id }),
  });
  const data = await response.json();
  dispatch(setLinkToken(data.link_token));
  return data.link_token;
}

export const exchangePublicToken = (public_token) => async dispatch => {
  const tokenExchangeResponse = await csrfFetch('/api/plaid/exchange_public_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ public_token }),
  });
  const data = await tokenExchangeResponse.json();

  dispatch(setAccessToken(data.access_token));
  console.log("Public token exchanged", data);
  return data.access_token;
}

export const sandboxPublicTokenCreate = (institution_id, initial_products) => async dispatch => {
  const response = await csrfFetch('/api/plaid/sandbox_public_token/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ institution_id, initial_products }),
  });
  const data = await response.json();
  return data.public_token;
}

export const createAndExchangeSandboxToken = (institution_id, initial_products) => async dispatch => {
  try {
    const public_token = await dispatch(sandboxPublicTokenCreate(institution_id, initial_products));
    const access_token = await dispatch(exchangePublicToken(public_token));
    // const item = await dispatch(fetchItem(access_token));
    return access_token;;
  } catch (error) {
    console.error("Token flow failed:", error);
    // Optionally handle or display UI errors
    throw error;
  }
};

// export const createItem =

export const fetchItem = (access_token) => async dispatch => {
  const response = await csrfFetch('/api/plaid/item/get', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token }),
  });
  const data = await response.json();
  // dispatch(addItem(data.item));
  return data;
}

export const getAndUpdateItemMetadata = (access_token) => async dispatch => {
  const response = await csrfFetch('/api/plaid/item/get_and_update_metadata', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      access_token
     }),
  });
  const data = await response.json();
  return data;
}

// Thunk to fetch all items for the logged-in user
export const fetchAllItems = () => async dispatch => {
  try {
    const response = await csrfFetch('/api/items/');
    const data = await response.json();
    console.log("All items fetched", data);
    dispatch(setItems(data));
    return data.items; 
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const deleteItem = (access_token) => async dispatch => {
  const response = await csrfFetch(`/api/items/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token }),
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(deleteItemAction(access_token));
    return data;
  } else {
    const error = await response.json();
    throw new Error(error.message);
  }
}

export const fetchAccounts = (access_token) => async dispatch => {
  const response = await csrfFetch('/api/plaid/accounts/get', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token }),
  });
  const data = await response.json();
  dispatch(setAccounts(data.accounts));
};


// Initial state
const initialState = {
  linkToken: null,
  accessToken: null,
  accounts: [],
  items: [],
};

const plaidReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LINK_TOKEN:
      return { ...state, linkToken: action.payload };
    case SET_ACCESS_TOKEN:
      return { ...state, accessToken: action.payload };
    case SET_ACCOUNTS:
      return { ...state, accounts: action.payload };
    case ADD_ITEM:
      return { ...state, items: [...state.items, action.payload] };
    case SET_ITEMS:
      return { ...state, items: action.payload };
    case DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item.accessToken !== action.payload),
      };
    case RESET_PLAID:
      return initialState;
    default:
      return state;
  }
};

export default plaidReducer;