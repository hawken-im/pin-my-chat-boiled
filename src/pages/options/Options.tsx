import React from "react";
import "@pages/options/Options.css";

function getAllSyncData(callback) {
  chrome.storage.sync.get(null, (data) => {
    callback(data);
  });
}

const Options: React.FC = () => {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    getAllSyncData((data) => {
      setData(data);
    });
  }, []);

  return <div className="OptionsContainer">data: {JSON.stringify(data)}</div>;
};

export default Options;
