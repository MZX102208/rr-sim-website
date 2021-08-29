import React, { useState, useEffect } from "react";
import './App.css';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Scoreboard from "./views/Scoreboard";
import TableView from "./views/TableView";

import { getParticipants } from "./Utils";

function App() {
	const [selectedTab, setSelectedTab] = useState(0);
	const [playersList, setPlayersList] = useState([]);
	const [tablesList, setTablesList] = useState([]);

	useEffect(() => {
		fetch(`/getPlayers`, { method: "GET" })
			.then((res) => res.json())
			.then((json) => {
				setPlayersList(json);
			});
		fetch(`/getTables`, { method: "GET" })
			.then((res) => res.json())
			.then((json) => {
				setTablesList(json);
			});
	}, []);

	const setTable = (playerName1, playerName2, tableNum) => {
		fetch(`/setTable?p1=${playerName1}&p2=${playerName2}&tableNum=${tableNum}`, { method: "POST" })
			.then((res) => res.json())
			.then((json) => {
				if (!json.err) setTablesList(json);
				else console.log(json.err);
			});
	};

	const clearTable = (tableNum) => {
		fetch(`/clearTable?tableNum=${tableNum}`, { method: "POST" })
			.then((res) => res.json())
			.then((json) => {
				if (!json.err) setTablesList(json);
				else console.log(json.err);
			});
	};

	const setNumTables = (numTables) => {
		fetch(`/setNumTables?numTables=${numTables}`, { method: "POST" })
			.then((res) => res.json())
			.then((json) => {
				if (!json.err) setTablesList(json);
				else console.log(json.err);
			});
	};

	const setScore = (p1, p2, scores) => {
		fetch(`/setScores?p1=${p1}&p2=${p2}`, { method: "POST", body: JSON.stringify({ scores }), headers: { 'Content-Type': 'application/json' } })
			.then((res) => res.json())
			.then((json) => {
				if (!json.err) setPlayersList(json);
				else console.log(json.err);
			});
	}

	const toggleInactive = (playerName) => {
		fetch(`/toggleActive?name=${playerName}`, { method: "POST" })
			.then((res) => res.json())
			.then((json) => {
				if (!json.err) setPlayersList(json);
				else console.log(json.err);
			});
	}

	const addPlayer = (playerName, groupNum) => {
		fetch(`/addPlayer?name=${playerName}&groupNum=${groupNum}`, { method: "POST" })
			.then((res) => res.json())
			.then((json) => {
				if (!json.err) setPlayersList(json);
				else console.log(json.err);
			});
	}

	const clearAllPlayers = () => {
		fetch(`/reset`, { method: "POST" })
			.then((res) => res.json())
			.then((json) => {
				if (!json.err) setPlayersList(json);
				else console.log(json.err);
			});
	}

	return (
		<div className="App">
			<Tabs value={selectedTab} onChange={(event, newValue) => { setSelectedTab(newValue); }}>
				<Tab label="Scoreboard" />
				<Tab label="Matches" />
			</Tabs>
			{/* <CircularProgress style={{ marginTop: '5rem', marginLeft: '5rem' }} /> */}
			{selectedTab === 0 && <Scoreboard playersList={playersList}
				toggleInactive={toggleInactive}
				addPlayer={addPlayer}
				clearAllPlayers={clearAllPlayers} />}
			{selectedTab === 1 && <TableView tablesList={tablesList}
				playersList={playersList}
				setTable={setTable}
				clearTable={clearTable}
				setNumTables={setNumTables}
				setScore={setScore} />}
		</div>
	);
}

export default App;
