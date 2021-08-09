import { Button, Stack, Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { CSSProperties, useMemo } from "react";
import { alpha, useTheme } from "@material-ui/core/styles";

type NavLinkButtonProps = {
  to: string;
  label: string;
  icon: JSX.Element;
  exact?: boolean;
};

export default function NavLinkButton({ to, icon, label, exact }: NavLinkButtonProps) {
  const theme = useTheme();

  const style: CSSProperties = {
    borderRadius: 0,
    height: 40,
    justifyContent: "flex-start",
    color: theme.palette.text.secondary,
  };

  const activeBackgroundColor = useMemo(() => alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity), [theme]);

  const activeStyle: CSSProperties = {
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.primary.main,
    backgroundColor: activeBackgroundColor,
  };

  return (
    <Button component={NavLink} to={to} exact={exact} activeStyle={activeStyle} style={style}>
      <Stack direction="row" spacing={2} justifyContent="flex-start" paddingLeft={1}>
        {icon}
        <Typography style={{ textTransform: "initial" }}>{label}</Typography>
      </Stack>
    </Button>
  );
}
