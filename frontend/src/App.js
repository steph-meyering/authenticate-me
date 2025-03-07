import { Route, Routes } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage"; 

function App() {
  return (
      <Routes>
        <Route path="/login" element={<LoginFormPage />}/>
      </Routes>
  );
}

export default App;