import { createContext, useMemo, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { WithChildren } from "../../types";
import { useCallback } from "react";

interface DialogOptions {
  title: string;
  contentText: string;
}

interface IDialogContext {
  showDialog: (options: DialogOptions) => Promise<boolean>;
}

export const DialogContext = createContext<IDialogContext>({
  showDialog: () => {
    return Promise.resolve(false);
  },
});

type StoredResolve = (value: boolean | PromiseLike<boolean>) => void;

// TODO: this only working with single dialog, trying to open multiple dialogs will most certainly break things!
export default function DialogRoot({ children }: WithChildren) {
  const [open, setOpen] = useState(false);
  const [dialogOptions, setDialogOptions] = useState<DialogOptions>({ contentText: "", title: "" });
  const [storedResolve, setStoredResolve] = useState<StoredResolve>((x: any) => {});

  const dialogContext = useMemo<IDialogContext>(() => {
    return {
      showDialog: options => {
        setDialogOptions(options);
        setOpen(true);

        return new Promise(resolve => {
          setStoredResolve(() => resolve);
        });
      },
    };
  }, [setOpen, setDialogOptions]);

  const handleConfirm = useCallback(() => {
    setOpen(false);
    storedResolve(true);
  }, [setOpen, storedResolve]);

  const handleCancel = useCallback(() => {
    setOpen(false);
    storedResolve(false);
  }, [setOpen, storedResolve]);

  return (
    <DialogContext.Provider value={dialogContext}>
      <>{children}</>

      <Dialog open={open} onClose={handleCancel} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{dialogOptions.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{dialogOptions.contentText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </DialogContext.Provider>
  );
}
