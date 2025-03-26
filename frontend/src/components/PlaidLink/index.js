import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import * as plaidActions from '../../store/plaid';
import { useDispatch, useSelector } from 'react-redux';

function PlaidLink() {
  const dispatch = useDispatch();
  const [linkToken, setLinkToken] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Fetch Link token from backend
  useEffect(() => {
    const fetchLinkToken = async () => {
      const token = await dispatch(plaidActions.createLinkToken());
      setLinkToken(token);
    };
    fetchLinkToken();
  }, []);

  // Handle success when Plaid Link completes
  const onSuccess = async (public_token) => {
    const access_token = await dispatch(plaidActions.exchangePublicToken(public_token));
    setAccessToken(access_token);
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
    </div>
  );
}

export default PlaidLink;
