PlayerList = new Mongo.Collection('Players');

if (Meteor.isClient) {

  //adding my first helper functions

      Template.leaderboard.helpers({
      'player': function(){
                var currentUserId = Meteor.userId();
                return PlayerList.find({},{sort: {score: -1, name: 1}})
                },
      'selectedClass': function(){
           //return this._id
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

    // adding events to the website
    Template.addPlayerForm.events({
        'submit form': function(){
                // code goes here
                event.preventDefault();
                var playerNameVar = event.target.playerName.value;
                var currentUserId = Meteor.userId();
              // Meteor.call('insertPlayerData');
              // adding an argument in the method call
                Meteor.call('insertPlayerData', playerNameVar);


/*                PlayerList.insert({
                    name: playerNameVar,
                    score: 0,
                    createdBy: currentUserId
                    });

                console.log(playerNameVar);
                console.log("Form submitted");
                console.log(event.type);*/
               }
        });

   //adding my first events
    Template.leaderboard.events({
        'click .player': function(){
                 var playerId = this._id;
                 Session.set('selectedPlayer', playerId);
                 var selectedPlayer = Session.get('selectedPlayer');
                 console.log(selectedPlayer);

                /*// console.log("You clicked .player element");
                 Session.set('selectedPlayer', 'session value test');
                 Session.get('selectedPlayer');
                 var selectedPlayer = Session.get('selectedPlayer');
                 console.log(selectedPlayer);*/

                 },
          'click .increment': function(){
                  // code goes here

                  var selectedPlayer = Session.get('selectedPlayer');
                 // Meteor.call('modifyPlayerScore', selectedPlayer);
                  Meteor.call('modifyPlayerScore', selectedPlayer, 5);

               /* var selectedPlayer = Session.get('selectedPlayer');
                  console.log(selectedPlayer);
                  //PlayerList.update(selectedPlayer, {score: 5});
                  //PlayerList.update(selectedPlayer, {$set: {score: 5} });
                  PlayerList.update(selectedPlayer, {$inc: {score: 5} });*/

                  },
          'click .decrement': function(){
                  var selectedPlayer = Session.get('selectedPlayer');
                  Meteor.call('modifyPlayerScore', selectedPlayer, -5);
                  },
           'click .remove': function(){
                   var selectedPlayer = Session.get('selectedPlayer');
                   console.log(selectedPlayer);
                   Meteor.call('removePlayerData', selectedPlayer);

                  // move the capability to a method on the server
                  // PlayerList.remove(selectedPlayer);
                   }
        });

    // adding my subscriptions
    Meteor.subscribe('thePlayers');
}

if (Meteor.isServer) {
      Meteor.publish('thePlayers', function(){
            var currentUserId = this.userId;
            return PlayerList.find({createdBy: currentUserId})
            });

      Meteor.methods({
            'insertPlayerData': function(playerNameVar){
            console.log("Hello world");
            var currentUserId = Meteor.userId();

            PlayerList.insert({
                name: playerNameVar,
                score: 0,
                createdBy: currentUserId
                });
            },

             'removePlayerData': function(selectedPlayer){
                // non users can only remove entries that belong to their userid
                var currentUserId = Meteor.userId();
                PlayerList.remove({_id: selectedPlayer, createdBy: currentUserId});


             },

             'modifyPlayerScore': function(selectedPlayer,scoreValue){
                // not as secure as users can cause issues from within the console
                // PlayerList.update(selectedPlayer, {$inc: {score: scoreValue} });

                // making it a little more secure now
                var currentUserId = Meteor.userId();
                PlayerList.update( {_id: selectedPlayer, createdBy: currentUserId},
                {$inc: {score: scoreValue} });
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
