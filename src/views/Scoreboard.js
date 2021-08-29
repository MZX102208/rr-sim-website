import { useEffect, useState } from "react";
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';

import PlayerAdderDialog from "../components/PlayerAdderDialog";

const columns = [
    {
        field: 'name',
        headerName: 'Name',
        width: 250,
        editable: false,
    },
    {
        field: 'groupNum',
        headerName: 'Group',
        type: 'number',
        width: 150,
        editable: false,
    },
    {
        field: 'isInactive',
        headerName: 'Disabled',
        type: 'boolean',
        width: 150,
        editable: false,
    },
    {
        field: 'matchWins',
        headerName: 'Matches Won',
        type: 'number',
        width: 170,
        editable: false,
    },
    {
        field: 'setWins',
        headerName: 'Sets Won',
        type: 'number',
        width: 170,
        editable: false,
    },
    {
        field: 'matchesPlayed',
        headerName: 'Matches Played',
        type: 'number',
        width: 180,
        editable: false,
    },
];

export default function Scoreboard(props) {
    const [playerList, setPlayerList] = useState([]);
    const [isPlayerAdderDialogOpen, setIsPlayerAdderDialogOpen] = useState(false);

    useEffect(() => {
        console.log(props.playersList);

        let id = 0;
        const processedPlayersList = Object.keys(props.playersList).map(playerName => {
            const playerInfo = props.playersList[playerName];
            let matchWins = 0;
            let setWins = 0;
            let scoreDiff = 0;
            let matchesPlayed = 0;

            Object.keys(playerInfo.matchHistory).forEach(opponentName => {
                const setInfo = playerInfo.matchHistory[opponentName];
                let numSetWins = 0;
                let numSetLosses = 0;
                setInfo.forEach(set => {
                    scoreDiff += set[0] - set[1];
                    if (set[0] > set[1]) numSetWins++;
                    else numSetLosses++;
                });
                setWins += numSetWins;
                if (numSetWins > numSetLosses) matchWins++;
                matchesPlayed++;
            });

            id++;
            return { id, name: playerName, matchWins, setWins, scoreDiff, matchesPlayed, groupNum: playerInfo.groupNum, isInactive: playerInfo.isInactive };
        });

        processedPlayersList.sort((p1, p2) => {
            if (p1.groupNum !== p2.groupNum) return p1.groupNum - p2.groupNum;
            if (p1.matchWins !== p2.matchWins) return p2.matchWins - p1.matchWins;
            if (p1.setWins !== p2.setWins) return p2.setWins - p1.setWins;
            if (p1.matchesPlayed !== p2.matchesPlayed) return p2.matchesPlayed - p1.matchesPlayed;
            return p2.scoreDiff - p1.scoreDiff;
        });

        setPlayerList(processedPlayersList);
    }, [props.playersList]);

    const handleCellClick = (info) => {
        const { field, row } = info;
        if (field === "isInactive") props.toggleInactive(row.name);
    };

    const closePlayerAdderDialog = () => {
        setIsPlayerAdderDialogOpen(false);
    };

    const openPlayerAdderDialog = () => {
        setIsPlayerAdderDialogOpen(true);
    };

    const addPlayer = (playerName, groupNum) => {
        props.addPlayer(playerName, groupNum);
    }

    return (
        <div style={{ height: 800, width: '100%' }}>
            <Button style={{ margin: '10px' }} variant="contained" color="primary" onClick={() => { openPlayerAdderDialog(); }}>Add Players</Button>
            <Button style={{ margin: '10px', marginLeft: '70%' }} variant="contained" color="primary" onClick={() => { props.clearAllPlayers(); }}>Clear All</Button>
            <DataGrid
                rows={playerList}
                columns={columns}
                pageSize={40}
                onCellClick={handleCellClick} />
            <PlayerAdderDialog
                isOpen={isPlayerAdderDialogOpen}
                handleClose={closePlayerAdderDialog}
                addPlayer={addPlayer} />
        </div>
    );
}
