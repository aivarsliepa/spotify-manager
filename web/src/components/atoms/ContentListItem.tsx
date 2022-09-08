import { alpha, Avatar, Checkbox, ListItem, ListItemAvatar, ListItemText, styled } from "@material-ui/core";
import { CSSProperties } from "react";

interface Props {
  text: string;
  onClick: () => void;
  image: string;
  style?: CSSProperties;
  isChecked?: boolean;
  onCheckboxClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const StyledListItem = styled(ListItem)(({ theme }) => ({
  cursor: "pointer",
  ":hover": {
    backgroundColor: alpha(theme.palette.action.hover, theme.palette.action.hoverOpacity),
  },
}));

export default function ContentListItem({ text, onClick, style, image, isChecked, onCheckboxClick }: Props) {
  return (
    <StyledListItem onClick={onClick} style={style}>
      <Checkbox checked={isChecked} onClick={onCheckboxClick} />
      <ListItemAvatar>
        <Avatar src={image} alt={text}></Avatar>
      </ListItemAvatar>
      <ListItemText primary={text} />
    </StyledListItem>
  );
}
