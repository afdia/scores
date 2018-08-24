function extractUsedNames(games) {
    const array = [];
    games.forEach(game => {
      game.players.forEach(player => {
        if (array.indexOf(player.name) === -1) array.push(player.name);
      });
    });
    array.sort();
   return array;
}

function drawGraphs(vue) {
    // see https://gionkunz.github.io/chartist-js/api-documentation.html
    var barOptions = {
        stackBars: true,
        axisX: {
            position: 'start',
            onlyInteger: true,
        },
        axisY: {
            position: 'end',
            onlyInteger: true,
        }
    };
    new Chartist.Bar('.ct-chart-wins', {
        labels: vue.options.board,
        series: getGameMatrix(true, vue),
    }, barOptions);
    new Chartist.Bar('.ct-chart-games', {
        labels: vue.options.board,
        series: getGameMatrix(false, vue),
    }, barOptions);
    const playerList = extractUsedNames(vue.oldGames);
    new Chartist.Bar('.ct-chart-factionWins', {
        labels: playerList,
        series: getPlayerFactionWins(playerList, true, vue),
    }, barOptions);
    new Chartist.Bar('.ct-chart-factionGames', {
        labels: playerList,
        series: getPlayerFactionWins(playerList, false, vue),
    }, barOptions);
}

function getGameMatrix(onlyWins, vue) {
    const winsByBoard = Array.apply(null, Array(vue.options.board.length)).map(function () { return 0 });
    const winsByBoardAndFaction = [winsByBoard, winsByBoard, winsByBoard, winsByBoard, winsByBoard, winsByBoard, winsByBoard, winsByBoard, winsByBoard];
    for (var i = 0; i < vue.options.faction.length; i++) {
        winsByBoardAndFaction[i] = winsByBoard.slice();
    }
    vue.oldGames.forEach(game => {
        game.players.every(player => {
            const winningBoardName = player.board;
            const winningFactionName = player.faction;
            const factionIdx = vue.options.faction.indexOf(winningFactionName);
            const boardIdx = vue.options.board.indexOf(winningBoardName);
            winsByBoardAndFaction[factionIdx][boardIdx] += 1;
            if (onlyWins) return false;
            else return true;
        });
    });
    return winsByBoardAndFaction;
}

function getPlayerFactionWins(playerList, onlyWins, vue) {
    const winsByPlayer = Array.apply(null, Array(playerList.length)).map(function () { return 0 });
    const winsByPlayerAndFaction = [winsByPlayer, winsByPlayer, winsByPlayer, winsByPlayer, winsByPlayer, winsByPlayer, winsByPlayer, winsByPlayer, winsByPlayer];
    for (var i = 0; i < vue.options.faction.length; i++) {
        winsByPlayerAndFaction[i] = winsByPlayer.slice();
    }
    vue.oldGames.forEach(game => {
        game.players.every(player => {
            const winningPlayerName = player.name;
            const winningFactionName = player.faction;
            const factionIdx = vue.options.faction.indexOf(winningFactionName);
            const playerIdx = playerList.indexOf(winningPlayerName);
            if (playerIdx !== -1) winsByPlayerAndFaction[factionIdx][playerIdx] += 1;
            if (onlyWins) return false;
            else return true;
        });
    });
    return winsByPlayerAndFaction;
}