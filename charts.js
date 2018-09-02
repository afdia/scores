'use strict';

var graphs = [];

function drawGraphs(vue, playerList) {
    graphs.forEach(g => g.destroy());
    graphs.push(drawChartJs(document.getElementById("ct-chart-games"), vue.options.board, vue.options.faction, getGameMatrix('games', vue), 'Board+Faction Games'));
    graphs.push(drawChartJs(document.getElementById("ct-chart-points"), vue.options.board, vue.options.faction, getGameMatrix('points', vue), 'Board+Faction Points (last place 0 points, above 1, ...)'));
    graphs.push(drawChartJs(document.getElementById("ct-chart-wins"), vue.options.board, vue.options.faction, getGameMatrix('wins', vue), 'Board+Faction Wins'));
    graphs.push(drawChartJs(document.getElementById("ct-chart-factionGames"), playerList, vue.options.faction, getPlayerFactionWins(playerList, 'games', vue), 'Player+Faction Games'));
    graphs.push(drawChartJs(document.getElementById("ct-chart-factionPoints"), playerList, vue.options.faction, getPlayerFactionWins(playerList, 'points', vue), 'Player+Faction Points (last place 0 points, above 1, ...)'));
    graphs.push(drawChartJs(document.getElementById("ct-chart-factionWins"), playerList, vue.options.faction, getPlayerFactionWins(playerList, 'wins', vue), 'Player+Faction Wins'));

    //TODO EXPERIMENTS
    /*var ctx = document.getElementById("ct-chart-experiment");
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Risk Level', 'Other'],
          datasets: [
            {
              label: 'Low',
              data: [67.8, 33],
              backgroundColor: '#D6E9C6',
              stack: 1,
            },
            {
              label: 'Moderate',
              data: [20.7, 10],
              backgroundColor: '#FAEBCC',
              stack: 1,
            },
            {
              label: 'High',
              data: [11.4, 5],
              backgroundColor: '#EBCCD1',
              stack: 2,
            }
          ]
        },
        options: {
            title: {
                display: true,
                text: 'Chart.js Bar Chart - Stacked'
            },
          scales: {
            xAxes: [{ stacked: true }],
            yAxes: [{ stacked: true }]
          }
        }
      });*/
}

function getGameMatrix(type, vue) {
    const winsByBoard = Array.apply(null, Array(vue.options.board.length)).map(function () { return 0 });
    const winsByBoardAndFaction = [winsByBoard, winsByBoard, winsByBoard, winsByBoard, winsByBoard, winsByBoard, winsByBoard, winsByBoard, winsByBoard];
    for (var i = 0; i < vue.options.faction.length; i++) {
        winsByBoardAndFaction[i] = winsByBoard.slice();
    }
    vue.oldGames.forEach(game => {
        game.players.every((player, gamePlayerIdx) => {
            const winningBoardName = player.board;
            const winningFactionName = player.faction;
            const factionIdx = vue.options.faction.indexOf(winningFactionName);
            const boardIdx = vue.options.board.indexOf(winningBoardName);
            const inc = getInc(type, gamePlayerIdx, game.players.length);
            winsByBoardAndFaction[factionIdx][boardIdx] += inc;
            if (type === 'wins') return false;
            else return true;
        });
    });
    return winsByBoardAndFaction;
}

function getInc(type, gamePlayerIdx, playerCount) {
    let inc = 1;
    if (type === 'points') { // in points mode, last place gets 0 points and for every place above you get 1 point
        inc = playerCount - gamePlayerIdx -1;
        if (inc < 0)
            inc = 0;
    }
    return inc;
}

function getPlayerFactionWins(playerList, type, vue) {
    const winsByPlayer = Array.apply(null, Array(playerList.length)).map(function () { return 0 });
    const winsByPlayerAndFaction = [winsByPlayer, winsByPlayer, winsByPlayer, winsByPlayer, winsByPlayer, winsByPlayer, winsByPlayer, winsByPlayer, winsByPlayer];
    for (var i = 0; i < vue.options.faction.length; i++) {
        winsByPlayerAndFaction[i] = winsByPlayer.slice();
    }
    vue.oldGames.forEach(game => {
        game.players.every((player, gamePlayerIdx) => {
            const winningPlayerName = player.name;
            const winningFactionName = player.faction;
            const factionIdx = vue.options.faction.indexOf(winningFactionName);
            const playerIdx = playerList.indexOf(winningPlayerName);
            const inc = getInc(type, gamePlayerIdx, game.players.length);
            if (playerIdx !== -1) winsByPlayerAndFaction[factionIdx][playerIdx] += inc;
            if (type === 'wins') return false;
            else return true;
        });
    });
    return winsByPlayerAndFaction;
}

function drawChartJs(ctx, labelArray, datasetLabel, data, title) {
    var factionIdx = 0;
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labelArray,
            datasets: [
                {
                    label: datasetLabel[factionIdx],
                    data: data[factionIdx++],
                    backgroundColor: 'rgba(0, 128, 0, 0.6)',
                },
                {
                    label: datasetLabel[factionIdx],
                    data: data[factionIdx++],
                    backgroundColor: 'rgba(255, 234, 0, 0.6)',
                },
                {
                    label: datasetLabel[factionIdx],
                    data: data[factionIdx++],
                    backgroundColor: 'rgba(255, 140, 0, 0.6)',
                },
                {
                    label: datasetLabel[factionIdx],
                    data: data[factionIdx++],
                    backgroundColor: 'rgba(0, 0, 255, 0.6)',
                },
                {
                    label: datasetLabel[factionIdx],
                    data: data[factionIdx++],
                    backgroundColor: 'rgba(225, 225, 225, 0.6)',
                },
                {
                    label: datasetLabel[factionIdx],
                    data: data[factionIdx++],
                    backgroundColor: 'rgba(255, 0, 0, 0.6)',
                },
                {
                    label: datasetLabel[factionIdx],
                    data: data[factionIdx++],
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                },
                {
                    label: datasetLabel[factionIdx],
                    data: data[factionIdx++],
                    backgroundColor: 'rgba(137, 43, 226, 0.6)',
                },
                {
                    label: datasetLabel[factionIdx],
                    data: data[factionIdx++],
                    backgroundColor: 'rgba(64, 224, 208, 0.6)',
                },
            ],
            borderWidth: 1
        },
        options: {
            // Show total sum of stacked bars // see https://stackoverflow.com/a/42648298
            tooltips: {
                mode: 'index',
                callbacks: {
                    afterTitle: function () {
                        window.total = 0;
                    },
                    label: function (tooltipItem, data) {
                        var corporation = data.datasets[tooltipItem.datasetIndex].label;
                        var valor = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        window.total += valor;
                        return corporation + ": " + valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                    },
                    footer: function () {
                        return "Total: " + window.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                    }
                }
            },
            maintainAspectRatio: false, // necessary to allow higher graphs for phone display
            title: {
                display: true,
                text: title
            },
            scales: {
                xAxes: [{ stacked: true }],
                yAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero: true,
                        callback: function (value) { if (value % 1 === 0) { return value; } },
                    }
                }]
            }
        }
    });
    return myChart;
}