import { useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import '../App.css';

export default function PlayerPickerDialog(props) {
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
            <DialogTitle id="alert-dialog-title">{`Pick a player`}</DialogTitle>
            <DialogContent>
                <List component="nav" aria-label="main mailbox folders">
                    {props.playersList.map(playerName => {
                        return (
                            <ListItem button onClick={() => { props.onSelectPlayer(playerName); }}>
                                <ListItemText>{playerName}</ListItemText>
                            </ListItem>
                        );
                    })}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};
