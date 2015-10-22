PlayerList = new Mongo.Collection('Players');
IPs = new Mongo.Collection('ips');

if (Meteor.isClient) {

      Template.leaderboard.helpers({
      'player': function(){
                var currentUserId = Meteor.userId();
                return PlayerList.find({},{sort: {score: -1, name: 1}})
                },
      'selectedClass': function(){
               var playerId = this._id;
               var selectedPlayer = Session.get('selectedPlayer');
               if(playerId == selectedPlayer){
                        return "selected"
                        }
               },
      'showSelectedPlayer': function(){
                 var selectedPlayer = Session.get('selectedPlayer');
                 return PlayerList.findOne(selectedPlayer)
                }
    });

    Template.addPlayerForm.events({
        'submit form': function(){
                event.preventDefault();
                var playerNameVar = event.target.playerName.value;
                var currentUserId = Meteor.userId();
                Meteor.call('insertPlayerData', playerNameVar);
               }
        });
//this is a test
    Template.leaderboard.events({
        'click .player': function(){
                 var playerId = this._id;
                 Session.set('selectedPlayer', playerId);
	                 var selectedPlayer = Session.get('selectedPlayer');
                 console.log(selectedPlayer);
                 },
/*          'click .increment': function(){
                  var selectedPlayer = Session.get('selectedPlayer');
                  Meteor.call('modifyPlayerScore', selectedPlayer, 5);
                  },*/
          'click .decrement': function(){
                  var selectedPlayer = Session.get('selectedPlayer');
                  Meteor.call('modifyPlayerScore', selectedPlayer, -5);
                  },
           'click .remove': function(){
                   var selectedPlayer = Session.get('selectedPlayer');
                   console.log(selectedPlayer);
                   Meteor.call('removePlayerData', selectedPlayer);
                   },

          'click .increment': function() {
            var playerId = Session.get('selectedPlayer');
            Meteor.call('givePoints', playerId, function(err) {
              if (err)
                alert(err.reason);
            });
          }
        });

    Meteor.subscribe('thePlayers');
}

if (Meteor.isServer) {
      Meteor.publish('thePlayers', function(){
            var currentUserId = this.userId;
            return PlayerList.find({createdBy: currentUserId})
            });

      Meteor.methods({
            'insertPlayerData': function(playerNameVar){
            var currentUserId = Meteor.userId();

            PlayerList.insert({
                name: playerNameVar,
                score: 0,
                createdBy: currentUserId
                });
            },

             'removePlayerData': function(selectedPlayer){
                var currentUserId = Meteor.userId();
                PlayerList.remove({_id: selectedPlayer, createdBy: currentUserId});
             },

             'modifyPlayerScore': function(selectedPlayer,scoreValue){
                var currentUserId = Meteor.userId();
                PlayerList.update( {_id: selectedPlayer, createdBy: currentUserId},
                {$inc: {score: scoreValue} });
             },

  'givePoints': function(playerId) {
                 console.log(playerId);
                 check(playerId, String);

                 // we want to use a date with a 1-day granularity
                 var startOfDay = new Date;
                 startOfDay.setHours(0, 0, 0, 0);

                 // the IP address of the caller
                 ip = this.connection.clientAddress;

                 // check by ip and date (these should be indexed)
                 if (IPs.findOne({ip: ip, date: startOfDay})) {
                   throw new Meteor.Error(403, 'You already voted!');
                 } else {
                   // the player has not voted yet
                   Players.update(playerId, {$inc: {score: 5}});

                   // make sure she cannot vote again today
                   IPs.insert({ip: ip, date: startOfDay});
                 }
               }
      });

   Meteor.startup(function () {
/*    //Sql.q("SELECT TOP 20 * from [Solution Design Repository].dbo.[System Instance]", function (err, res) {
    Sql.q("select 1 as num", function (err, res) {
        console.log(res);
    });*/
  });

/*  //------------------------------------------------
    //TEDIOUS CODE
      // on the server
      var Connection = Tedious.Connection;

      var config = {
                userName: 'user1',
                password: 'user1',
           //   server: '29REASONS-PC',
                server: 'localhost',
                options: {
                  encrypt: true,
                  database: 'Solution Design Repository'
                }
              };

      var connection = new Connection(config);

      connection.on('connect', function (err) {
        var request = new Tedious.Request('SELECT TOP 20 * from [Solution Design Repository].dbo.[System Instance]', function (err, rowCount) {
          if (err) {
            console.log(err);
          } else {
            console.log(rowCount + ' rows');
          }
        });

        request.on('row', function (columns) {
          var r = '';
          columns.forEach(function (column) {
            r = r + ' ' + column.value;
          });
          console.log('\n ', r);
         //  console.log( r);
        });
        connection.execSql(request);
      });
     //------------------------------------------------*/
}
