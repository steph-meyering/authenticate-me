import { csrfFetch } from './csrf';
import { resetPlaid } from './plaid';

const SET_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';
const CREATE_USER = 'session/CREATE_USER';

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

export const restoreUser = () => async dispatch => {
  const response = await csrfFetch('/api/session');
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

export const createUser = (user) => {
  return {
    type: CREATE_USER,
    payload: user,
  };
}

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
}; 

export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });
  dispatch(removeUser());
  dispatch(resetPlaid());
  return response;
}

export const signup = (user) => async (dispatch) => {
  const { username, email, password } = user;
  const response = await csrfFetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
}

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case CREATE_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;