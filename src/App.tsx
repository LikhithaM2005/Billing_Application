import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login_Page/Login";
import Signup from "./Login_Page/Signup";
import ForgotPassword from "./Login_Page/ForgotPassword";
import ResetPassword from "./Login_Page/ResetPassword";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


