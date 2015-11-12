var request = require('request-promise');
var fs = require('fs');

request('http://mlb.mlb.com/gdcross/components/game/mlb/year_2015/month_06/day_10/master_scoreboard.json')
.then(data => JSON.parse(data))
.then(result => result.data.games.game)
.then(game => console.log(game));