const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

let players = {};
let tables = [null, null, null];

//for (let i = 0; i < 30; i++) players[`test${i}`] = { matchHistory: {}, groupNum: 0, isInactive: false }

app.listen(port, () => console.log(`Listening on port ${port}`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'build')));

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/reset', (req, res) => {
    players = {};
    res.send(players);
});

app.post('/loadSave', (req, res) => {
    try {
        let { save } = req.body;
        players = save;
        res.send(players);
    } catch (err) {
        res.status(400).send({ err: "Error setting save state " });
    }
});

app.post('/addPlayer', (req, res) => {
    const name = req.query.name;
    if (players[name]) {
        res.status(400).send({ err: "This player already exists" });
    } else {
        const groupNum = req.query.groupNum ? req.query.groupNum : 0;
        players[name] = { matchHistory: {}, groupNum: groupNum, isInactive: false };
        res.send(players);
    }
});

app.post('/setNumTables', (req, res) => {
    const numTables = req.query.numTables;
    if (numTables) {
        tables = [];
        for (let i = 0; i < numTables; i++) {
            tables.push(null);
        }
        res.send(tables);
    } else {
        res.send({ err: `No numTables argument` });
    }
});

app.post('/setTable', (req, res) => {
    const { p1, p2, tableNum } = req.query;
    if (p1 && p2 && tableNum < tables.length) {
        tables[tableNum] = [p1, p2];
        res.send(tables);
    } else {
        res.status(400).send({ err: `Error` });
    }
});

app.post('/clearTable', (req, res) => {
    const { tableNum } = req.query;
    if (tableNum < tables.length) {
        tables[tableNum] = null;
        res.send(tables);
    } else {
        res.status(400).send({ err: `Error` });
    }
});

app.get('/getTables', (req, res) => {
    res.send(tables);
});

app.get('/getPlayers', (req, res) => {
    res.send(players);
});

app.post('/setScores', (req, res) => {
    const { p1, p2 } = req.query;
    const { scores } = req.body;
    console.log(p1, p2, scores, req.body);
    if (p1 && players[p1] && p2 && players[p2] && scores) {
        players[p1].matchHistory[p2] = scores;
        const p2Scores = [];
        scores.forEach(setInfo => {
            p2Scores.push([setInfo[1], setInfo[0]]);
        });
        players[p2].matchHistory[p1] = p2Scores;
        res.send(players);
    } else {
        res.status(400).send({ err: `Error` });
    }
});

app.post('/toggleActive', (req, res) => {
    const name = req.query.name;
    if (name && players[name]) {
        players[name].isInactive = !players[name].isInactive;
        res.send(players);
    } else {
        res.status(400).send({ err: `${name} is not found` });
    }
});
