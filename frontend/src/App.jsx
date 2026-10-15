
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signin from "./pages/Signin";
import User from "./pages/User";
import Owner from "./pages/Owner";
import TableBooking from "./pages/TableBooking";
import Recipes from "./pages/Recipes";
import FoodOrder from "./pages/FoodOrder";
import Profile from "./pages/Profile";

import "./App.css";
import "./styles/style.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/user" element={<User />} />
        <Route path="/owner" element={<Owner />} />
        <Route path="/table-booking" element={<TableBooking />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/food-order" element={<FoodOrder />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
