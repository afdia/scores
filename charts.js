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