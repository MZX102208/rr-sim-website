import { useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import '../App.css';

export default function TableSetterDialog(props) {
    const [open, setOpen] = useState(false);
    const [numTables, setNumTables] = useState(0);

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
            <DialogTitle id="alert-dialog-title">{`Set number of tables`}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Warning: This will overwrite existing tables with empty ones
                </DialogContentText>
                <TextField id="outlined-basic" label="Number of Tables" variant="outlined" onInput={e => { setNumTables(e.target.value); }} />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => { props.setNumTables(numTables); }} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};
