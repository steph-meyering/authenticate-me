import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import * as plaidActions from '../../store/plaid';
import { useDispatch, useSelector } from 'react-redux';

function PlaidLink() {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.plaid.accounts);
  const items = useSelector((state) => state.plaid.items);
  const linkToken = useSelector((state) => state.plaid.linkToken);
  const accessToken = useSelector((state) => state.plaid.accessToken);
  const externalId = useSelector((state) => state.session.user?.externalId);
  const sessionUser = useSelector((state) => state.session.user);

  // Fetch Link token from backend
  useEffect(() => {
    if (!externalId) return;
    const fetchLinkToken = async () => {
      await dispatch(plaidActions.createLinkToken(externalId));
    };
    fetchLinkToken();
  }, [externalId]);

  // Handle success when Plaid Link completes
  const onSuccess = async (public_token, metadata) => {
    try {
      // console.log("metadata", metadata);
      // TODO FIXME: add logic using metadata to prevent token exchange if item for FI already exists
      const access_token = await dispatch(plaidActions.exchangePublicToken(public_token, externalId));
      await dispatch(plaidActions.fetchItem(access_token));
      await dispatch(plaidActions.fetchAccounts(access_token));
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  const testFunction = async (externalId) => {
    dispatch(plaidActions.fetchAllItems(externalId));
  }

  return (
    <div>
      {sessionUser ? (
        <button onClick={() => testFunction(externalId)}> Test Fetch items
        </button>) : null}

      {sessionUser ? (
        <button onClick={() => open()} disabled={!ready}>
          Connect Your Bank
        </button>
      ) : (
        <p>Please log in to connect your bank</p>
      )}
      {accessToken ? <p>Access Token: {accessToken}</p> : null}

      {accounts ? (
        <div>
          <h3>Accounts</h3>
          <ul>
            {accounts.map((account) => (
              <li key={account.account_id}>
                {account.name} - {account.balances.current} {account.balances.iso_currency_code}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {items ? (
        <div>
          <h3>ITEMS</h3>
          <ul>
            {items.map((item) => (
              <li key={item.itemId}>
                {item.institutionName} - 
                <button onClick={() => dispatch(plaidActions.deleteItem(item.accessToken))}>Delete</button> 
                <button onClick={() => dispatch(plaidActions.fetchItem(item.accessToken))}>/item/get</button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}


export default PlaidLink;
