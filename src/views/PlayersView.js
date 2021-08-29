import { useEffect, useState } from "react";
import { DataGrid } from '@material-ui/data-grid';

export default function Scoreboard(props) {
    const [playerList, setPlayerList] = useState([]);

    useEffect(() => {
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
            return { name: playerName, matchWins, setWins, scoreDiff, matchesPlayed, groupNum: playerInfo.groupNum };
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

    return (
        <div style={{ height: 800, width: '100%' }}>
            <DataGrid
                rows={playerList}
                columns={columns}
                pageSize={40}
            />
        </div>
    );
}
