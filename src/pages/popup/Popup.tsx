import React from "react";
import logo from "@assets/img/logo.svg";
import "@pages/popup/Popup.css";

function getAllSyncData(callback) {
  chrome.storage.sync.get(null, (data) => {
    callback(data);
  });
}

const Popup = () => {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    getAllSyncData((data) => {
      setData(data);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>data: {JSON.stringify(data)}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React!
        </a>
      </header>
    </div>
  );
};

export default Popup;
