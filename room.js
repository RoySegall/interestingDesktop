const $ = require('jquery');
const queryString = require('query-string');
const queryArguments = queryString.parse(location.search);

$(function() {

  var
    r = require('rethinkdb'),
    info = require('./db.json'),
    connection = null;

  r.connect({host: info.host, port: info.port}, function(err, conn) {

    if (err) {
      throw err;
    }

    connection = conn;

    var db = r.db(info.database);

    db.table('interest_room_messages').filter({'room_id': queryArguments['id']}).changes().run(conn, function(err, cursor) {
      $('.dimmer').hide();

      cursor.each(console.log);
    });
  });

});

