import { configureStore, combineReducers } from '@reduxjs/toolkit'; 
import { thunk } from 'redux-thunk'; 
import { default as logger } from 'redux-logger'; 

const rootReducer = combineReducers({
  // Add your reducers here
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
