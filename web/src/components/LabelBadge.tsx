import React from "react";

interface Props {
  labelName: string;
}

const LabelBadge: React.FC<Props> = props => {
  return <div>{props.labelName}</div>;
};

export default LabelBadge;
