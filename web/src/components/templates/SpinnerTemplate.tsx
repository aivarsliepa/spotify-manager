import Spinner from "../atoms/Spinner";
import DialogRoot from "../organisms/DialogRoot";

type Props = {
  showSpinner: boolean;
  render: () => JSX.Element;
};

export default function SpinnerTemplate({ showSpinner, render }: Props) {
  if (showSpinner) {
    return <Spinner />;
  }

  return <DialogRoot>{render()}</DialogRoot>;
}
