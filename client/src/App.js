import "./App.css";
import Content from "./components/Content";
import Home from "./components/Home";
import { Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/content/:id" element={<Content />} />
      </Routes>
    </>
  );
}

export default App;
