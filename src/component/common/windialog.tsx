'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useEffect } from 'react';
import './windialog.css';
import { Gift } from 'lucide-react';

export const DialogDemo = ({
  gift,
  open,
  onDialogClose,
}: {
  gift: string;
  open: boolean;
  onDialogClose: () => void;
}) => {
  useEffect(() => {
    if (!open) {
      onDialogClose();
    }
  }, [open, onDialogClose]);

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay">
          <Dialog.Content className="DialogContent">
            <div className="dialog-header">
              <span className="dialog-icon">
                <Gift size={24} />
              </span>
              <Dialog.Title className="dialog-title">
                Congrats you won a {gift}
              </Dialog.Title>
            </div>

            <Dialog.Description className="DialogDescription">
              You will soon get an email from us giving more instructions about
              the gift!
            </Dialog.Description>

            <div
              style={{
                display: 'flex',
                marginTop: 25,
                justifyContent: 'flex-end',
              }}
            >
              <button
                className="Button green"
                onClick={() => {
                  window.close();
                }}
              >
                Close this tab
              </button>
            </div>

            <Dialog.Close asChild>
              <button
                className="IconButton"
                aria-label="Close"
                onClick={() => {
                  window.close();
                }}
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
