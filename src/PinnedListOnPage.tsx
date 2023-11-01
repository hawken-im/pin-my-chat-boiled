import React, { useEffect, useState } from "react";

interface Props {
  pinnedChats: { id: string; title: string }[];
}

export default function PinnedList(props: Props) {
  const [openList, setOpenList] = useState(true);
  const [listItems, setListItems] = useState([]);

  const handleCollapse = () => {
    setOpenList(!openList);
  };

  const init = () => {
    setInterval(() => {
      chrome.storage.sync.get("pinnedChats", (data) => {
        const pinnedChats = data.pinnedChats || [];
        setListItems(pinnedChats);
      });
    }, 3000);
  };

  useEffect(() => {
    init();
    setListItems(props.pinnedChats);
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <button
          onClick={handleCollapse}
          style={{
            backgroundColor: "#007BFF",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {!openList ? "Expand" : "Collapse"}
        </button>

        <div id="pin-my-chat-readyforpin"></div>
      </div>

      <div id="pin-my-chat-pinnedchats">
        {openList && (
          <ul
            style={{
              listStyleType: "none",
              padding: 0,
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: "4px",
            }}
          >
            {listItems.map((element) => {
              return (
                <li
                  key={element.id}
                  style={{
                    padding: "10px 16px",
                    borderBottom: "1px solid #f0f0f0",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <button
                    onClick={() => {
                      window.location.href = `https://chat.openai.com/c/${element.id}`;
                    }}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "none",
                      color: "#007BFF",
                      fontSize: "16px",
                      textAlign: "left",
                    }}
                  >
                    {element.title}
                  </button>

                  <button
                    onClick={() => {
                      chrome.storage.sync.get("pinnedChats", (data) => {
                        const pinnedChats = data.pinnedChats || [];
                        const newPinnedChats = pinnedChats.filter(
                          (chat) => chat.id !== element.id
                        );
                        chrome.storage.sync.set({
                          pinnedChats: newPinnedChats,
                        });
                        setListItems(newPinnedChats);
                      });
                    }}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#FF4D4D",
                      fontSize: "18px",
                    }}
                  >
                    📌
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
