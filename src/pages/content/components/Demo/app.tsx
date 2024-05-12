import { useEffect, useState } from "react";
import Pin from "@pages/content/components/Pin";
import { createRoot } from "react-dom/client";
import { sleep } from "@src/utils";
import Stack from "@mui/material/Stack";
import PinnedList from "@src/PinnedListOnPage";

function useUrlChange(onUrlChange) {
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          onUrlChange();
        }
      });
    });

    const targetNode = document.querySelector("body");
    observer.observe(targetNode, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [onUrlChange]);
}

function addStackToNav() {
  const nav = document.querySelector("nav");
  if (nav) {
    const oldStack = document.querySelector("#pin-my-chat-stack");
    if (oldStack) {
      oldStack.remove();
    }
    const stack = document.createElement("div");
    stack.id = "pin-my-chat-stack";

    if (nav.children.length >= 2) {
      nav.insertBefore(stack, nav.children[2]);
    } else {
      nav.appendChild(stack);
    }
    createRoot(stack).render(
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="stretch"
        spacing={2}
      ></Stack>
    );
  } else {
    //console.log("No <nav> element found on the page.");
  }
}

async function addListToStack(pinnedChats) {
  let parent = document.querySelector("#pin-my-chat-stack");
  for (let i = 0; i < 10 && !parent; i++) {
    if (!parent) {
      //console.log("add list: No <stack> element found on the page.");
      await sleep(500 * i + 500);
      parent = document.querySelector("#pin-my-chat-stack");
      if (parent) {
        break;
      } else {
        addStackToNav();
        continue;
      }
    } else {
      break;
    }
  }
  const stack = parent.querySelector(":first-child");
  if (stack) {
    const oldList = document.querySelector("#pin-my-chat-list");
    const oldPinnedChats = document.querySelector("#pin-my-chat-pinnedchats");
    if (oldList) {
      oldList.remove();
    }
    if (oldPinnedChats) {
      oldPinnedChats.remove();
    }
    const newList = document.createElement("div");
    newList.id = "pin-my-chat-list";
    stack.appendChild(newList);

    createRoot(newList).render(<PinnedList pinnedChats={pinnedChats} />);
  }
}

function extractChatId(url) {
  const regex = /https:\/\/chat\.openai\.com\/c\/([a-f0-9-]+)/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

export default function App() {
  const [pinnedChats, setPinnedChats] = useState([]);
  const [currentURL, setCurrentURL] = useState("");

  async function addPinToStack(title, chatId, isPinned) {
    let parent = document.querySelector("#pin-my-chat-readyforpin");
    for (let i = 0; i < 10 && !parent; i++) {
      if (!parent) {
        //console.log("No readyforpin found on the page.");
        await sleep(500 * i + 500);
        parent = document.querySelector("#pin-my-chat-readyforpin");
        if (parent) {
          break;
        } else {
          addListToStack(pinnedChats);
          continue;
        }
      } else {
        break;
      }
    }
    //select button with id "pin-my-chat-button" if it exists
    const oldButton = document.querySelector("#pin-my-chat-button");
    if (oldButton) {
      //if button exists, remove it
      oldButton.remove();
    }
    const button = document.createElement("div");
    button.id = "pin-my-chat-button";

    parent.appendChild(button);

    createRoot(button).render(
      <Pin title={title} chatId={chatId} pinned={isPinned} />
    );
  }

  // Function to handle URL changes
  function handleUrlChange() {
    const changedURL = window.location.href;
    if (changedURL !== currentURL) {
      //console.log("URL changed!");
      setCurrentURL(changedURL);
    }

    if (changedURL.startsWith("https://chatgpt.com/?")) {
      // Inject content for the first type of URL
      return true;
    } else if (changedURL.startsWith("https://chatgpt.com/c/")) {
      // Inject content for the second type of URL
      return false;
    }
    return true;
  }

  async function getCurrentTabTitle() {
    //get document.title:
    let title = document.title;
    if (title === "ChatGPT") {
      await sleep(2000);
      title = document.title;
    }
    return title;
  }

  async function processAddPin(isNewChat: boolean) {
    let linkAlreadyPinned: boolean;
    if (isNewChat) {
      addPinToStack("N23P1N8X9Q8N97L", "none", true);
    } else {
      for (let i = 0; i < 3; i++) {
        await sleep(100);
        const newTitle = await getCurrentTabTitle();
        if (newTitle === null) {
          await sleep(500 * i + 100);
          continue;
        } else {
          const url = window.location.href;
          const newChatId = extractChatId(url);

          sleep(1000).then(() => {
            chrome.storage.sync.get("pinnedChats", (data) => {
              if (data.pinnedChats === undefined) {
                data.pinnedChats = [];
              }
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
              }
              const pinnedChats = data.pinnedChats || [];
              // Check if the link is already in the pinnedChats array
              linkAlreadyPinned = pinnedChats.some(
                (chat) => chat.id === newChatId
              );

              // update the title if already pinned
              if (linkAlreadyPinned) {
                pinnedChats.forEach((chat) => {
                  if (chat.id === newChatId && chat.title !== newTitle) {
                    //console.log("updating title");
                    chat.title = newTitle;
                    chrome.storage.sync.set({ pinnedChats: pinnedChats });
                    setPinnedChats(pinnedChats);
                  }
                });
              }
              addPinToStack(newTitle, newChatId, linkAlreadyPinned);
            });
          });

          i = 3;
        }
      }
    }
  }

  async function init() {
    //setPinnedChatsReady(false);
    addStackToNav();
    chrome.storage.sync.get("pinnedChats", (data) => {
      const pinnedChats = data.pinnedChats || [];
      setPinnedChats(pinnedChats);
      addListToStack(pinnedChats);
      // setPinnedChatsReady(true);
    });

    await sleep(1000);
    await processAddPin(handleUrlChange());
    await sleep(500);
  }

  useEffect(() => {
    sleep(1000).then(() => {
      init();
    });
  }, []);

  useEffect(() => {
    //console.log("URL changed! Apply UseEffect");
    //processAddPin(handleUrlChange());
    init();
  }, [currentURL]);

  useUrlChange(() => {
    //console.log("Observer URL changed!");
    handleUrlChange();
  });

  return <div className="hello-pin-my-chat"></div>;
}
