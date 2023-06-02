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

interface Props {
  pinnedChats: { id: string; title: string }[];
}

export default function PinnedList(props: Props) {
  const [openList, setOpenList] = React.useState(true);
  const [listItems, setListItems] = React.useState([]);

  const handleCollapse = () => {
    setOpenList(!openList);
  };

  useEffect(() => {
    setListItems(props.pinnedChats);
  }, []);
  return (
    <div>
      <Button
        onClick={handleCollapse}
        variant="text"
        size="small"
        startIcon={!openList ? <ExpandMoreIcon /> : <ExpandLessIcon />}
      >
        {!openList ? "Expand" : "Collapse"}
      </Button>
      <div id="pin-my-chat-pinnedchats">
        <Collapse in={openList} timeout="auto" unmountOnExit>
          <List
            component="div"
            disablePadding
            sx={{ width: "100%", maxWidth: 360 }}
          >
            {listItems.map((element) => {
              return (
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="unpin"
                      sx={{ width: 24, height: 24 }}
                    >
                      <UnPinIcon
                        sx={{ color: "white", width: 20, height: 20 }}
                      />
                    </IconButton>
                  }
                  sx={{ width: "100%", maxWidth: 360 }}
                  key={element.id}
                >
                  <ListItemButton dense>
                    <ListItemText
                      primary={`${element.title}`}
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
