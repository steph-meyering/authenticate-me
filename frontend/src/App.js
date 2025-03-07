import { Route, Routes } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage"; 
import SignupFormPage from "./components/SignupFormPage";

function App() {
  return (
      <Routes>
        <Route path="/login" element={<LoginFormPage />}/>
        <Route path="/signup" element={<SignupFormPage />}/>
      </Routes>
  );
}

export default App;