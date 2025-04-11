import { csrfFetch } from './csrf';
const SET_LINK_TOKEN = "plaid/SET_LINK_TOKEN";
const SET_ACCESS_TOKEN = "plaid/SET_ACCESS_TOKEN";
const SET_ACCOUNTS = "plaid/SET_ACCOUNTS";
const RESET_PLAID = "plaid/RESET_PLAID";

// Action creators
const setLinkToken = (token) => ({ type: SET_LINK_TOKEN, payload: token });
const setAccessToken = (token) => ({ type: SET_ACCESS_TOKEN, payload: token });
const setAccounts = (accounts) => ({ type: SET_ACCOUNTS, payload: accounts });

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
  const response = await csrfFetch('/api/plaid/exchange_public_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ public_token }),
  });
  const data = await response.json();
  dispatch(setAccessToken(data.access_token));
  return data.access_token;
}

// Thunk to fetch accounts
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
};

const plaidReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LINK_TOKEN:
      return { ...state, linkToken: action.payload };
    case SET_ACCESS_TOKEN:
      return { ...state, accessToken: action.payload };
    case SET_ACCOUNTS:
      return { ...state, accounts: action.payload };
    case RESET_PLAID:
      return initialState;
    default:
      return state;
  }
};

export default plaidReducer;