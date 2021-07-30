import Spinner from "../atoms/Spinner";

type Props = {
  showSpinner: boolean;
  render: () => JSX.Element;
};

export default function SpinnerTemplate({ showSpinner, render }: Props) {
  if (showSpinner) {
    return <Spinner />;
  }

  return <>{render()}</>;
}
