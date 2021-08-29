function getGroups(playersList) {
    let groups = {};
    Object.keys(playersList).forEach(playerName => {
        let groupNum = playersList[playerName].groupNum;
        if (!groups[groupNum]) groups[groupNum] = true;
    });
    return groups;
}

function getPlayersInGroup(groupNum, playersList) {
    return Object.keys(playersList).filter(playerName => playersList[playerName].groupNum === groupNum);
}

function calculateMatchesLeftInGroup(groupNum, playersList, tablesList) {
    let matchesLeft = 0;
    const visitedPlayers = {};

    Object.keys(playersList).forEach(playerName => {
        const playerInfo = playersList[playerName];
        const matchHistory = playerInfo.matchHistory;
        if (playerInfo.groupNum === groupNum) {
            visitedPlayers[playerName] = true;
            Object.keys(matchHistory).forEach(opponentName => { if (!visitedPlayers[opponentName]) matchesLeft--; });
        }
    });
    tablesList.forEach(tableInfo => { if (tableInfo && tableInfo[0].groupNum === groupNum) matchesLeft--; });

    const totalPlayersInGroup = Object.keys(visitedPlayers).length;
    matchesLeft += totalPlayersInGroup * (totalPlayersInGroup - 1);
    return matchesLeft;
}

function getPossibleOpponents(currPlayerName, playersList, tablesList) {
    let isPlaying = false;
    const currentlyPlaying = {};
    const currPlayerInfo = playersList[currPlayerName];
    const currGroupNum = currPlayerInfo.groupNum;

    tablesList.forEach(tableInfo => {
        if (!tableInfo) return;

        if (tableInfo[0] === currPlayerName || tableInfo[1] === currPlayerName) isPlaying = true;
        currentlyPlaying[tableInfo[0]] = true;
        currentlyPlaying[tableInfo[1]] = true;
    });
    if (isPlaying) return [];

    const playableOpponents = Object.keys(playersList).filter(playerName => {
        return playersList[playerName].groupNum === currGroupNum &&
        !currentlyPlaying[playerName] &&
        playerName !== currPlayerName &&
        !playersList[playerName].matchHistory[currPlayerName];
    });
    playableOpponents.sort();

    return playableOpponents;
}

function getParticipants(playersList, tablesList) {
    const inelligiblePlayers = {};
    tablesList.forEach(tableInfo => {
        if (tableInfo) {
            inelligiblePlayers[tableInfo[0]] = true;
            inelligiblePlayers[tableInfo[1]] = true;
        }
    });

    Object.keys(playersList).forEach(playerName => {
        if (playersList[playerName].isInactive) inelligiblePlayers[playerName] = true;
    });

    const groupPriorityList = Object.keys(getGroups(playersList)).map(groupNum => {
        return { groupNum: `${groupNum}`, matchesLeft: calculateMatchesLeftInGroup(groupNum, playersList, tablesList) };
    });
    groupPriorityList.sort((groupA, groupB) => groupB.matchesLeft - groupA.matchesLeft);

    let foundPair = null;
    if (groupPriorityList.length === 0) return null;

    groupPriorityList.forEach(groupToSelectFrom => {
        if (foundPair) return;

        const playersInGroup = getPlayersInGroup(groupToSelectFrom.groupNum, playersList);
        console.log("Players in group here: ", playersInGroup);

        const elligiblePlayersList = Object.keys(playersList)
            .map(playerName => { return { name: playerName, info: playersList[playerName] }; })
            .filter(player => {
                console.log("Player name here: ", inelligiblePlayers[player.name], player.info.groupNum === groupToSelectFrom.groupNum, Object.keys(player.info.matchHistory).length < playersInGroup.length - 1);
                return !inelligiblePlayers[player.name] &&
                    player.info.groupNum === groupToSelectFrom.groupNum &&
                    Object.keys(player.info.matchHistory).length < playersInGroup.length - 1;
            });
        elligiblePlayersList.sort((playerA, playerB) => {
            const matchesPlayedA = Object.keys(playerA.info.matchHistory).length;
            const matchesPlayedB = Object.keys(playerB.info.matchHistory).length;
            return matchesPlayedA - matchesPlayedB;
        });
        console.log("EP: ", elligiblePlayersList, inelligiblePlayers);

        if (elligiblePlayersList.length === 0) return;

        for (let i = 0; i < elligiblePlayersList.length - 1; i++) {
            if (foundPair) break;

            const player = elligiblePlayersList[i];
            console.log("Player: ", player);
            const possibleOpponents = getPossibleOpponents(player.name, playersList, tablesList);
            console.log("Player: ", player, "PO: ", possibleOpponents);
            for (let j = i + 1; j < elligiblePlayersList.length; j++) {
                if (foundPair) break;

                const opponent = elligiblePlayersList[j];
                if (possibleOpponents.includes(opponent.name)) {
                    foundPair = [player.name, opponent.name];
                }
            }
        };
    });

    return foundPair;
}

function getFreePlayerSet(playersList, tablesList) {
    const inelligiblePlayers = {};
    tablesList.forEach(tableInfo => {
        if (tableInfo) {
            inelligiblePlayers[tableInfo[0]] = true;
            inelligiblePlayers[tableInfo[1]] = true;
        }
    });

    Object.keys(playersList).forEach(playerName => {
        if (playersList[playerName].isInactive) {
            inelligiblePlayers[playerName] = true;
        } else {
            const playersInGroup = getPlayersInGroup(playersList[playerName].groupNum, playersList);
            if (playersInGroup.length === 0) inelligiblePlayers[playerName] = true;
        }
    });

    return Object.keys(playersList).filter(player => { return !inelligiblePlayers[player.name]; });
}

export { getParticipants, getPossibleOpponents, calculateMatchesLeftInGroup, getPlayersInGroup, getGroups, getFreePlayerSet };
