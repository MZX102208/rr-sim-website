import { useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import '../App.css';

export default function EmptyTableDialog(props) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(props.isOpen);
    }, [props.isOpen]);
    
    return (
        <Dialog
            open={open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{`Fill Table ${props.tableNum + 1}`}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Choose between letting the system choose the participants or choosing them manually.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={props.openMatchPicker} color="primary">
                    Manually
                </Button>
                <Button onClick={props.autoAssign} color="primary">
                    System
                </Button>
            </DialogActions>
        </Dialog>
    );
};
