import { useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import '../App.css';

export default function PlayerAdderDialog(props) {
    const [open, setOpen] = useState(false);
    const [player, setPlayer] = useState("");
    const [groupNum, setGroupNum] = useState(0);

    useEffect(() => {
        setOpen(props.isOpen);
    }, [props.isOpen]);

    const resetFields = () => {
        setPlayer("");
    }

    return (
        <Dialog
            open={open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{`Set Score`}</DialogTitle>
            <DialogContent>
                <DialogContentText>Add player and group number</DialogContentText>
                <TextField id="outlined-basic" label="Name" variant="outlined" value={player} onInput={e => { setPlayer(e.target.value); }} />
                <TextField id="outlined-basic" label="Group" variant="outlined" value={groupNum} onInput={e => { setGroupNum(e.target.value); }} />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Close
                </Button>
                <Button onClick={() => { props.addPlayer(player, groupNum); resetFields(); }} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};
