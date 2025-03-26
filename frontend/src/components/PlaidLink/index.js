import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import * as plaidActions from '../../store/plaid';
import { useDispatch, useSelector } from 'react-redux';

function PlaidLink() {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.plaid.accounts);
  const linkToken = useSelector((state) => state.plaid.linkToken);
  const accessToken = useSelector((state) => state.plaid.accessToken);


  // Fetch Link token from backend
  useEffect(() => {
    const fetchLinkToken = async () => {
      await dispatch(plaidActions.createLinkToken());
    };
    fetchLinkToken();
  }, []);

  // Handle success when Plaid Link completes
  const onSuccess = async (public_token) => {
    try {
      const access_token = await dispatch(plaidActions.exchangePublicToken(public_token));
      await dispatch(plaidActions.fetchAccounts(access_token));
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  return (
    <div>
      {linkToken ? (
        <button onClick={() => open()} disabled={!ready}>
          Connect Your Bank
        </button>
      ) : (
        <p>Loading...</p>
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
    </div>
  );
}


export default PlaidLink;
