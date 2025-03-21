import { Route, Routes } from "react-router-dom";
import LoginFormModal from "./components/LoginFormModal"; 
import SignupFormPage from "./components/SignupFormPage";
import Navigation from "./components/Navigation";
import { useEffect, useState } from "react";  
import * as sessionActions from "./store/session";
import { useDispatch } from "react-redux";

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
        <Route path="/login" element={<LoginFormModal />}/>
        <Route path="/signup" element={<SignupFormPage />}/>
      </Routes>
    )}
  </>
  );
}

export default App;