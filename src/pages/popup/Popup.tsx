import React, { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TwitterIcon from "@mui/icons-material/Twitter";
import logo from "@src/assets/img/logo.png";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import IconButton from "@mui/material/IconButton";
import UnPinIcon from "@mui/icons-material/PushPinOutlined";

export default function Popup() {
  const [listItems, setListItems] = React.useState([]);

  const init = () => {
    chrome.storage.sync.get("pinnedChats", (data) => {
      const pinnedChats = data.pinnedChats || [];
      setListItems(pinnedChats);
    });
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div style={{ marginTop: "20px" }}>
      <Box sx={{ minWidth: 300 }}>
        <Stack spacing={3}>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Avatar
              alt="Pin My Chat"
              src={logo}
              sx={{ width: 32, height: 32 }}
              variant="rounded"
            />
            <Typography variant="h6">Pin My Chat</Typography>
            <a
              href="https://twitter.com/whatajerrrk"
              target="_blank"
              rel="noreferrer"
            >
              <TwitterIcon color="primary" />
            </a>
          </Stack>
          <List>
            {listItems.length === 0 && (
              <ListItem>
                <ListItemText
                  primary={
                    <a
                      href={`https://chat.openai.com/`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      No pinned chats right now. Go to ChatGPT and pin some
                      chats!
                    </a>
                  }
                  secondary="Your pinned chats will appear here."
                />
              </ListItem>
            )}
            {listItems.map((item) => (
              <ListItem key={item.id}>
                <ListItemText
                  primary={
                    <a
                      href={`https://chat.openai.com/c/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.title}
                    </a>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => {
                      chrome.storage.sync.get("pinnedChats", (data) => {
                        const pinnedChats = data.pinnedChats || [];
                        const newPinnedChats = pinnedChats.filter(
                          (chat) => chat.id !== item.id
                        );
                        chrome.storage.sync.set({
                          pinnedChats: newPinnedChats,
                        });
                        setListItems(newPinnedChats);
                      });
                    }}
                  >
                    <UnPinIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Box>
    </div>
  );
}
