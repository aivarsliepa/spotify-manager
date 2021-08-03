import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import WorkIcon from "@material-ui/icons/Work";
import { CSSProperties } from "react";

interface Props {
  text: string;
  onClick: () => void;
  //   image: string; TODO
  style?: CSSProperties;
}

export default function ContentListItem({ text, onClick, style }: Props) {
  return (
    <ListItem button onClick={onClick} style={style}>
      <ListItemAvatar>
        <Avatar>
          {/* TODO: put small image */}
          <WorkIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={text} />
    </ListItem>
  );
}
