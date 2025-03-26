import { Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import { useEffect, useState } from "react";  
import * as sessionActions from "./store/session";
import { useDispatch } from "react-redux";
import PlaidLink from "./components/PlaidLink";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
    <Navigation isLoaded={isLoaded} />
    {isLoaded && (
      <Routes>
        <Route path="/plaid" element={<PlaidLink />}/>
      </Routes>
    )}
  </>
  );
}

export default App;