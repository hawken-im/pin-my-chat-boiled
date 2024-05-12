import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import { useEffect } from "react";
import React from "react";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import UnPinIcon from "@mui/icons-material/PushPinOutlined";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

interface Props {
  pinnedChats: { id: string; title: string }[];
}

export default function PinnedList(props: Props) {
  const [openList, setOpenList] = React.useState(true);
  const [listItems, setListItems] = React.useState([]);

  const handleCollapse = () => {
    setOpenList(!openList);
  };

  const init = () => {
    //check if the pinneChats changed and update the list, every 3 seconds
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
    <div>
      <Stack
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        spacing={2}
      >
        <Button
          onClick={handleCollapse}
          variant="text"
          size="small"
          startIcon={!openList ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        >
          {!openList ? "Expand" : "Collapse"}
        </Button>
        <div id="pin-my-chat-readyforpin"></div>
      </Stack>

      <div id="pin-my-chat-pinnedchats">
        <Collapse in={openList} timeout="auto" unmountOnExit>
          <List
            component="div"
            disablePadding
            sx={{ width: "100%", maxWidth: 480 }}
            dense
          >
            {listItems.map((element) => {
              return (
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="unpin"
                      sx={{ width: 24, height: 24 }}
                      onClick={() => {
                        //console.log("unpinning");
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
                    >
                      <UnPinIcon
                        sx={{ color: "white", width: 20, height: 20 }}
                      />
                    </IconButton>
                  }
                  sx={{ width: "100%", maxWidth: 480 }}
                  key={element.id}
                >
                  <ListItemButton
                    onClick={() => {
                      window.location.href = `https://chatgpt.com/c/${element.id}`;
                    }}
                    sx={{ py: 0, minHeight: 32, color: "rgba(255,255,255,.8)" }}
                  >
                    <ListItemText
                      primary={`${element.title}`}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: "medium",
                      }}
                      sx={{ color: "white" }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      </div>
    </div>
  );
}
