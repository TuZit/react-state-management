import logo from "./logo.svg";
import "./App.css";
import { Link } from "react-router-dom";
import Header from "./component/Header";
import Footer from "./component/Footer";

function App() {
  return (
    <div className="App">
      <Header />

      <header className="App-header">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "20px",
            justifyContent: "center",
            gap: "16px",
            color: "white",
          }}>
          <Link to={"/context-api"}>Context API</Link>
          <Link style={{ marginRight: "16px" }} to={"/redux"}>
            Redux
          </Link>
          <Link style={{ marginRight: "16px" }} to={"/redux-toolkit"}>
            Redux Toolkit
          </Link>
          <Link to={"/zustand"}>Zustand</Link>

          <Link to={"/swr"}>SWR</Link>
          <Link to={"/react-query"}>React Query</Link>
          <Link to={"/rtk-query"}>RTK Query</Link>
        </div>

        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer">
          Learn React
        </a>
      </header>

      <Footer />
    </div>
  );
}

export default App;
