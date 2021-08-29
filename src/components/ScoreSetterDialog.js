import { useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import '../App.css';

export default function ScoreSetterDialog(props) {
    const [open, setOpen] = useState(false);
    const [score, setScore] = useState(0);

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
            <DialogTitle id="alert-dialog-title">{`Set Score`}</DialogTitle>
            <DialogContent>
                <DialogContentText><b>Left: </b>{props.p1}<br/><b>Right: </b>{props.p2}</DialogContentText>
                <TextField
                    id="standard-multiline-flexible"
                    label="Score"
                    multiline
                    maxRows={5}
                    onInput={e => { setScore(e.target.value); }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => { props.finishMatch(score); }} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};
