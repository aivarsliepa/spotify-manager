import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import WorkIcon from "@material-ui/icons/Work";

interface Props {
  text: string;
  onClick: () => void;
  //   image: string; TODO
}

export default function ContentListItem({ text, onClick }: Props) {
  return (
    <ListItem button onClick={onClick}>
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
