import { useEffect, useState } from "react";
import Pin from "@pages/content/components/Pin";
import { createRoot } from "react-dom/client";
import { sleep } from "@src/utils";
import Stack from "@mui/material/Stack";
import PinnedList from "@src/PinnedList";

const initSelector =
  "a.flex.py-3.px-3.items-center.gap-3.relative.rounded-md.bg-gray-800.hover\\:bg-gray-800";

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

function useTitleChange(onTitleChange) {
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          onTitleChange();
        }
      });
    });

    const targetNode = document.querySelector("body");
    observer.observe(targetNode, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [onTitleChange]);
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
        direction="row-reverse"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      ></Stack>
    );
  } else {
    console.log("No <nav> element found on the page.");
  }
}

async function addPinToStack(title, chatId, isPinned) {
  let parent = document.querySelector("#pin-my-chat-stack");
  for (let i = 0; i < 10 && !parent; i++) {
    if (!parent) {
      console.log("No <stack> element found on the page.");
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
  if (!stack) {
    console.log("No <stack> child element found on the page.");
    await sleep(1500);
  }
  if (stack) {
    //select button with id "pin-my-chat-button" if it exists
    const oldButton = document.querySelector("#pin-my-chat-button");
    if (oldButton) {
      //if button exists, remove it
      oldButton.remove();
    }
    const button = document.createElement("div");
    button.id = "pin-my-chat-button";

    const list = document.querySelector("#pin-my-chat-list");
    if (list) {
      stack.insertBefore(button, list);
    } else {
      stack.appendChild(button);
    }
    createRoot(button).render(
      <Pin title={title} chatId={chatId} pinned={isPinned} />
    );
  } else {
    console.log("add pin failed");
  }
}

async function addListToStack(pinnedChats) {
  let parent = document.querySelector("#pin-my-chat-stack");
  for (let i = 0; i < 10 && !parent; i++) {
    if (!parent) {
      console.log("add list: No <stack> element found on the page.");
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
  const [pinnedChatsReady, setPinnedChatsReady] = useState(false);
  const [pinnedChats, setPinnedChats] = useState([]);
  const [currentURL, setCurrentURL] = useState("");
  //const [initElement, setInitElement] = useState(null);
  const [currentTitle, setCurrentTitle] = useState("");

  // Function to handle URL changes
  function handleUrlChange() {
    const changedURL = window.location.href;
    if (changedURL !== currentURL) {
      console.log("URL changed!");
      setCurrentURL(changedURL);
    }

    if (changedURL.startsWith("https://chat.openai.com/?")) {
      // Inject content for the first type of URL
      return true;
    } else if (changedURL.startsWith("https://chat.openai.com/c/")) {
      // Inject content for the second type of URL
      return false;
    }
  }

  async function handleIElementTitleChange() {
    const changedTitle = await getElementTitle();
    if (changedTitle !== currentTitle) {
      console.log("Title changed!");
      setCurrentTitle(changedTitle);
    }
  }

  async function getElementTitle() {
    const element = await getInitElement();
    if (element) {
      const contentElement = element.querySelector(".flex-1.text-ellipsis");
      const title = contentElement.textContent.trim();
      return title;
    } else {
      return null;
    }
  }

  const getInitElement = async () => {
    const element = document.querySelector(initSelector);
    for (let i = 0; i < 3; i++) {
      if (element === null) {
        await sleep(500 * i + 100);
        continue;
      } else {
        console.log("Found init element!");
        return element;
      }
    }
    return element;
  };

  async function processAddPin(isNewChat: boolean) {
    if (isNewChat) {
      addPinToStack("N23P1N8X9Q8N97L", "none", true);
    } else {
      for (let i = 0; i < 3; i++) {
        await sleep(100);
        const newTitle = await getElementTitle();
        if (newTitle === null) {
          await sleep(500 * i + 100);
          continue;
        } else {
          const url = window.location.href;
          const newChatId = extractChatId(url);

          sleep(1000).then(() => {
            chrome.storage.sync.get("pinnedChats", (data) => {
              const pinnedChats = data.pinnedChats || [];
              // Check if the link is already in the pinnedChats array
              const linkAlreadyPinned: boolean = pinnedChats.some(
                (chat) => chat.id === newChatId
              );

              // update the title if already pinned
              if (linkAlreadyPinned) {
                pinnedChats.forEach((chat) => {
                  if (chat.id === newChatId && chat.title !== newTitle) {
                    console.log("updating title");
                    chat.title = newTitle;
                    chrome.storage.sync.set({ pinnedChats: pinnedChats });
                    setPinnedChats(pinnedChats);
                  }
                });
              }
              setCurrentTitle(newTitle);
              addPinToStack(newTitle, newChatId, linkAlreadyPinned);
            });
          });

          i = 3;
        }
      }
    }
  }

  async function init() {
    setPinnedChatsReady(false);
    //const iElement = await getInitElement();
    //setInitElement(iElement);
    addStackToNav();
    await sleep(1000);
    await processAddPin(handleUrlChange());
    await sleep(500);
    chrome.storage.sync.get("pinnedChats", (data) => {
      const pinnedChats = data.pinnedChats || [];
      setPinnedChats(pinnedChats);
      setPinnedChatsReady(true);
    });
  }

  useEffect(() => {
    // chrome.runtime.sendMessage(
    //   { type: "greeting", message: "Hello from content.js!" },
    //   function (response) {
    //     console.log(response.message);
    //   }
    // );
    chrome.runtime.onMessage.addListener((request) => {
      if (request.action === "greets") {
        //chrome.runtime.openOptionsPage();
        console.log("greets received");
      }
    });

    sleep(1000).then(() => {
      init();
    });
  }, []);

  useEffect(() => {
    if (pinnedChatsReady) {
      addListToStack(pinnedChats);
      sleep(500).then(async () => {
        for (let i = 0; i < 3; i++) {
          const parent = document.querySelector("#pin-my-chat-stack");
          if (parent === null) {
            await sleep(500 * i + 100);
            continue;
          }
          if (parent) {
            const pinnedChatsElement = document.querySelector(
              "#pin-my-chat-pinnedchats"
            );
            if (pinnedChatsElement === null) {
              await sleep(500 * i + 100);
              continue;
            }
            if (pinnedChatsElement) {
              parent.appendChild(pinnedChatsElement);
              i = 3;
            }
          }
        }
      });
    }
  }, [pinnedChatsReady]);

  useEffect(() => {
    console.log("URL changed! Apply UseEffect");
    //processAddPin(handleUrlChange());
    init();
  }, [currentURL]);

  useEffect(() => {
    console.log("Title changed! Apply UseEffect");
    //TODO: add listener to title change(try both background and content)
    chrome.runtime.sendMessage({ action: "title_changed" });
  }, [currentTitle]);

  useUrlChange(() => {
    console.log("Observer URL changed!");
    handleUrlChange();
  });

  useTitleChange(() => {
    console.log("Observer Title changed!");
    handleIElementTitleChange();
  });

  return <div className="hello-pin-my-chat"></div>;
}
