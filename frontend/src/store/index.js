import { configureStore, combineReducers } from '@reduxjs/toolkit'; 
import { thunk } from 'redux-thunk'; 
import { default as logger } from 'redux-logger'; 
import { default as sessionReducer } from './session';

const rootReducer = combineReducers({
  session: sessionReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    process.env.NODE_ENV === 'production'
      ? getDefaultMiddleware().concat(thunk)
      : getDefaultMiddleware().concat(thunk, logger),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
