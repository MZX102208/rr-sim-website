import { useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import '../App.css';

import PlayerPickerDialog from './PlayerPickerDialog';
import { getFreePlayerSet, getPossibleOpponents } from "../Utils";

export default function MatchPickerDialog(props) {
    const [open, setOpen] = useState(false);
    const [player1, setPlayer1] = useState(null);
    const [player2, setPlayer2] = useState(null);
    const [playerPickerList, setPlayerPickerList] = useState([]);
    const [isPlayerPickerOpen, setIsPlayerPickerOpen] = useState(false);

    useEffect(() => {
        setOpen(props.isOpen);
    }, [props.isOpen]);

    const handlePlayerPickerClose = () => {
        setIsPlayerPickerOpen(false);
    }

    const onSelectPlayer = (playerName) => {
        if (!player1) setPlayer1(playerName)
        else setPlayer2(playerName);

        handlePlayerPickerClose();
    }

    const openPlayerPicker = () => {
        if (!player1) {
            setPlayerPickerList(getFreePlayerSet(props.playersList, props.tablesList));
            setIsPlayerPickerOpen(true);
        } else {
            setPlayerPickerList(getPossibleOpponents(player1, props.playersList, props.tablesList));
            setIsPlayerPickerOpen(true);
        }
    }

    const descriptionText = !player1 ? "Select the first player" : !player2 ? "Select the second player" : `Is this ok?`;

    return (
        <div className="test123">
            <Dialog
                open={open}
                onClose={props.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{`Select Matchup`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {descriptionText}
                    </DialogContentText>
                    {!player1 && <Button onClick={openPlayerPicker} color="primary">Select Player 1</Button>}
                    {player1 && !player2 && <DialogContentText id="alert-dialog-description">{player1}</DialogContentText>}
                    {player1 && !player2 && <Button onClick={openPlayerPicker} color="primary">Select Player 2</Button>}
                    {player1 && player2 && <DialogContentText id="alert-dialog-description">{player1} vs. {player2}</DialogContentText>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        Cancel
                    </Button>
                    {player1 && player2 && <Button onClick={() => { props.setTable(player1, player2); }} color="primary">
                        Confirm
                    </Button>}
                </DialogActions>
            </Dialog>
            <PlayerPickerDialog isOpen={isPlayerPickerOpen} playersList={playerPickerList} onSelectPlayer={onSelectPlayer} handleClose={handlePlayerPickerClose} />
        </div>
    );
};
