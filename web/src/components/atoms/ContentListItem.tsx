import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import { CSSProperties } from "react";

interface Props {
  text: string;
  onClick: () => void;
  image: string;
  style?: CSSProperties;
}

export default function ContentListItem({ text, onClick, style, image }: Props) {
  return (
    <ListItem button onClick={onClick} style={style}>
      <ListItemAvatar>
        <Avatar src={image} alt={text}></Avatar>
      </ListItemAvatar>
      <ListItemText primary={text} />
    </ListItem>
  );
}
