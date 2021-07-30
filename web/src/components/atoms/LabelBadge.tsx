import { Chip } from "@material-ui/core";

interface Props {
  label: string;
  onClick?: () => void;
  onDelete?: () => void;
}

export default function LabelBadge({ label, onClick, onDelete }: Props) {
  return <Chip label={label} onClick={onClick} onDelete={onDelete} />;
}
