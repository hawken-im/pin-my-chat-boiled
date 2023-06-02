import { useEffect, useState } from "react";
import Pin from "@pages/content/components/Pin";
import { createRoot } from "react-dom/client";
import { sleep } from "@src/utils";
import Stack from "@mui/material/Stack";
import PinnedList from "@src/PinnedList";

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

function addPinToStack(title, chatId, isPinned) {
  const parent = document.querySelector("#pin-my-chat-stack");
  const stack = parent.querySelector(":first-child");
  if (stack) {
    //select button with id "pin-my-chat-button" if it exists
    const oldButton = document.querySelector("#pin-my-chat-button");
    if (oldButton) {
      //if button exists, remove it
      oldButton.remove();
    }
    const button = document.createElement("div");
    button.id = "pin-my-chat-button";
    //button.style.margin = "0px 20px 0px 0px";
    //button.style.padding = "0px 8px 0px 0px";

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
    console.log("No <pin> element found on the page.");
  }
}

function addListToStack(pinnedChats) {
  const parent = document.querySelector("#pin-my-chat-stack");
  const stack = parent.querySelector(":first-child");
  if (stack) {
    const oldList = document.querySelector("#pin-my-chat-list");
    if (oldList) {
      oldList.remove();
    }
    const newList = document.createElement("div");
    newList.id = "pin-my-chat-list";
    stack.appendChild(newList);
    // const firstChild = list.firstChild;
    // list.insertBefore(newList, firstChild);

    createRoot(newList).render(<PinnedList pinnedChats={pinnedChats} />);
  }
}

function getElementTitle() {
  const selector =
    "a.flex.py-3.px-3.items-center.gap-3.relative.rounded-md.bg-gray-800.hover\\:bg-gray-800";
  const element = document.querySelector(selector);

  if (element) {
    const contentElement = element.querySelector(".flex-1.text-ellipsis");
    const title = contentElement.textContent.trim();
    return title;
  } else {
    return null;
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
  // const [tittleAndChatId, setTittleAndChatId] = useState({
  //   title: null,
  //   chatId: null,
  // });
  let switchObserver = false;
  const [pinnedChatsReady, setPinnedChatsReady] = useState(false);
  const [pinnedChats, setPinnedChats] = useState([]);

  async function processAddPin() {
    for (let i = 0; i < 3; i++) {
      await sleep(1500);
      const newTitle = getElementTitle();
      if (newTitle === null) {
        await sleep(500 * i + 100);
        continue;
      } else {
        const url = window.location.href;
        const newChatId = extractChatId(url);
        // setTittleAndChatId({ title: newTitle, chatId: newChatId });
        sleep(2000).then(() => {
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

  useEffect(() => {
    async function init() {
      await sleep(2700);
      addStackToNav();
      await processAddPin();
      switchObserver = true;
      document.addEventListener("click", () => {
        if (!switchObserver) {
          switchObserver = true;
        }
      });
      await sleep(1000);
      chrome.storage.sync.get("pinnedChats", (data) => {
        const pinnedChats = data.pinnedChats || [];
        setPinnedChats(pinnedChats);
        setPinnedChatsReady(true);
      });
    }
    init();
  }, []);

  useEffect(() => {
    function observeChat() {
      if (switchObserver) {
        const chat = document.querySelector("#pin-my-chat-stack").parentElement;
        if (chat) {
          const observer = new MutationObserver(async (mutations) => {
            await processAddPin();
            switchObserver = false;
          });

          observer.observe(chat, {
            childList: true,
            subtree: true,
          });
        }
      }
    }

    if (switchObserver) {
      observeChat();
      switchObserver = false;
    }
  }, [switchObserver]);

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
  }, [pinnedChats]);

  return <div className="pin-my-chat"></div>;
}
