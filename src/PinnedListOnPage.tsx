import React, { useEffect, useState } from "react";

interface Props {
  pinnedChats: { id: string; title: string }[];
}

export default function PinnedList(props: Props) {
  const [openList, setOpenList] = useState(true);
  const [listItems, setListItems] = useState([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
          justifyContent: "right",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <button
          onClick={handleCollapse}
          style={{
            backgroundColor: "#292f38",
            color: "white",
            padding: "3px 6px",
            margin: "0 12px 0 0",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {!openList ? "Expand 🔽" : "Collapse 🔼"}
        </button>

        <div
          style={{
            margin: "0 12px 0 0",
          }}
          id="pin-my-chat-readyforpin"
        ></div>
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
                    padding: "4px 8px",
                    borderBottom: "1px solid #f0f0f0",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  onMouseEnter={() => setHoveredId(element.id)}
                  onMouseLeave={() => setHoveredId(null)}
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
                      fontSize: "13px",
                      textAlign: "left",
                    }}
                  >
                    {element.title}
                  </button>

                  {hoveredId === element.id && (
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
                        border: "none",
                        height: "20px",
                        fontSize: "12px",
                        backgroundColor: "#007BFF",
                        color: "white",
                        padding: "2px",
                        margin: "0 0 0 4px",
                        borderRadius: "2px",
                        cursor: "pointer",
                      }}
                    >
                      Unpin
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
