import React from "react";
import { Route, Routes } from "react-router-dom";
import SearchPage from "./components/SearchPage";
import DetailsPage from "./components/DetailsPage";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/detail" element={<DetailsPage />} />
      </Routes>
    </div>
  );
};

export default App;

