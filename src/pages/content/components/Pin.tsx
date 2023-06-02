import Tooltip from "@mui/material/Tooltip";
import PushPinIcon from "@mui/icons-material/PushPin";
import React, { useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Avatar from "@mui/material/Avatar";
import green from "@mui/material/colors/green";
import grey from "@mui/material/colors/grey";

interface Props {
  title: string;
  chatId?: string;
  pinned: boolean;
}

export default function Pin(props: Props) {
  const [isPinned, setIsPinned] = React.useState(props.pinned);
  const [tip, setTip] = React.useState("Pin chat");
  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  const pinChat = () => {
    chrome.storage.sync.get("pinnedChats", (data) => {
      const pinnedChats = data.pinnedChats || [];

      // Check if the link is already in the pinnedChats array
      const linkAlreadyPinned = pinnedChats.some(
        (chat) => chat.id === props.chatId
      );

      // update the title if already pinned
      if (linkAlreadyPinned) {
        handleToast("Already Pinned");
      }

      if (!linkAlreadyPinned) {
        // Add the current chat to the pinnedChats array if it's not already there
        pinnedChats.push({ id: props.chatId, title: props.title });

        // Save the updated pinnedChats array to the storage
        chrome.storage.sync.set({ pinnedChats: pinnedChats });
        handleToast("Chat Pinned");
        setIsPinned(true);
      }
    });
  };

  useEffect(() => {
    if (props.pinned) {
      setTip(`${props.title} Already Pinned`);
      setIsPinned(true);
    } else {
      setTip(`Pin My Chat: ${props.title}`);
      setIsPinned(false);
    }
  }, []);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleToast = (msg) => {
    if (msg) {
      setMsg(msg);
    }

    setOpen(true);
  };
  return (
    <div>
      <Tooltip title={tip}>
        {!isPinned ? (
          <Avatar
            onClick={pinChat}
            sx={{
              bgcolor: green[500],
              width: 24,
              height: 24,
              cursor: "pointer",
            }}
          >
            <PushPinIcon sx={{ fontSize: 20 }} />
          </Avatar>
        ) : (
          <Avatar sx={{ bgcolor: grey[500], width: 24, height: 24 }}>
            <PushPinIcon sx={{ fontSize: 20 }} />
          </Avatar>
        )}
      </Tooltip>
      <Snackbar
        sx={{ zIndex: "9999999" }}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        autoHideDuration={2800}
        open={open}
        onClose={handleClose}
        message={msg}
      />
    </div>
  );
}
