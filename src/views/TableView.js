import { useEffect, useState } from "react";
import '../App.css';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import EmptyTableDialog from "../components/EmptyTableDialog";
import MatchPickerDialog from "../components/MatchPickerDialog";
import TableSetterDialog from "../components/TableSetterDialog";
import ScoreSetterDialog from "../components/ScoreSetterDialog";

import { getParticipants } from "../Utils";

const useStyles = makeStyles({
    root: {
        minWidth: 100,
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

export default function TableView(props) {
    const classes = useStyles();
    const [tablesList, setTablesList] = useState([]);
    const [selectedTableNum, setSelectedTableNum] = useState(0);
    const [isEmptyDialogOpen, setIsEmptyDialogOpen] = useState(false);
    const [isMatchPickerOpen, setIsMatchPickerOpen] = useState(false);
    const [isTableSetterOpen, setIsTableSetterOpen] = useState(false);
    const [isScoreSetterOpen, setIsScoreSetterOpen] = useState(false);

    useEffect(() => {
        setTablesList(props.tablesList);
    }, [props.tablesList]);

    const handleEmptyDialogOpen = (tableNum) => {
        setSelectedTableNum(tableNum);
        setIsEmptyDialogOpen(true);
    };

    const handleEmptyDialogClose = () => {
        setIsEmptyDialogOpen(false);
    };

    const openMatchPicker = () => {
        setIsEmptyDialogOpen(false);
        setIsMatchPickerOpen(true);
    };

    const closeMatchPicker = () => {
        setIsMatchPickerOpen(false);
    };

    const openTableSetter = () => {
        setIsTableSetterOpen(true);
    };

    const closeTableSetter = () => {
        setIsTableSetterOpen(false);
    };

    const openScoreSetter = (tableNum) => {
        setSelectedTableNum(tableNum);
        setIsScoreSetterOpen(true);
    };

    const closeScoreSetter = () => {
        setIsScoreSetterOpen(false);
    };

    const setNumTables = (numTables) => {
        const parsedNumTables = Number(numTables);
        props.setNumTables(isNaN(parsedNumTables) ? 0 : parsedNumTables);
        closeTableSetter();
    };

    const autoAssignMatchup = () => {
        let matchUp = getParticipants(props.playersList, props.tablesList);
        if (!matchUp) {
            alert("No matches could be made");
        } else {
            setTable(matchUp[0], matchUp[1]);
        }
        handleEmptyDialogClose();
    };

    const setTable = (player1, player2) => {
        props.setTable(player1, player2, selectedTableNum);
        closeMatchPicker();
    };

    const finishMatch = (scoreStr) => {
        const p1 = props.tablesList[selectedTableNum][0];
        const p2 = props.tablesList[selectedTableNum][1];

        scoreStr = scoreStr.replace(/\s/g, '');
        const scores = scoreStr.split(',').map(str => {
            return str.split('-').map(num => { return Number(num); });
        });
        props.setScore(p1, p2, scores);
        props.clearTable(selectedTableNum);

        closeScoreSetter();
        handleEmptyDialogOpen(selectedTableNum);
    };

    const tableCards = [];
    tablesList.forEach((tableInfo, tableNum) => {
        if (tableInfo) {
            tableCards.push(
                <Card className={classes.root}>
                    <CardContent>
                        <Typography variant="h5" component="h5">
                            Table {tableNum + 1}
                        </Typography>
                        <Typography variant="body2" component="p">
                            {tableInfo[0]} vs. {tableInfo[1]}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={() => { openScoreSetter(tableNum); }}>Finish Match</Button>
                        <Button size="small" onClick={() => { props.clearTable(tableNum); }}>Clear</Button>
                    </CardActions>
                </Card>);
        } else {
            tableCards.push(
                <Card className={classes.root}>
                    <CardContent>
                        <Typography variant="h5" component="h5">
                            Table {tableNum + 1}
                        </Typography>
                        <Typography variant="body2" component="p">
                            Empty
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" value={tableNum} onClick={() => { handleEmptyDialogOpen(tableNum) }}>Set Players</Button>
                    </CardActions>
                </Card>);
        }
    });

    return (
        <div>
            <Button style={{ margin: '25px' }} variant="contained" color="primary" onClick={() => { openTableSetter(); }}>Set Number of Tables</Button>
            <div className="table-view">
                {tableCards}
                <EmptyTableDialog
                    isOpen={isEmptyDialogOpen}
                    handleClose={handleEmptyDialogClose}
                    tableNum={selectedTableNum}
                    setTable={setTable}
                    autoAssign={autoAssignMatchup}
                    openMatchPicker={openMatchPicker} />
                <MatchPickerDialog
                    isOpen={isMatchPickerOpen}
                    handleClose={closeMatchPicker}
                    tableNum={selectedTableNum}
                    playersList={props.playersList}
                    tablesList={props.tablesList}
                    setTable={setTable} />
                <TableSetterDialog
                    isOpen={isTableSetterOpen}
                    handleClose={closeTableSetter}
                    setNumTables={setNumTables} />
                <ScoreSetterDialog
                    isOpen={isScoreSetterOpen}
                    p1={tablesList[selectedTableNum] ? tablesList[selectedTableNum][0] : ""}
                    p2={tablesList[selectedTableNum] ? tablesList[selectedTableNum][1] : ""}
                    handleClose={closeScoreSetter}
                    finishMatch={finishMatch} />
            </div>
        </div>
    );
}
