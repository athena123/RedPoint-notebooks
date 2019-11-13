import React from "react";
import "./App.css";
import Notebook from "./Components/Notebook";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";

function App() {
  return (
    <div className="App">
      <Container>
        <Notebook />
      </Container>
    </div>
  );
}

export default App;
