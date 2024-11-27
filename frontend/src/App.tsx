import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Historico from "./Pages/TripHistory";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/historico/:customer_id" element={<Historico />} />
      </Routes>
    </Router>
  );
};

export default App;
