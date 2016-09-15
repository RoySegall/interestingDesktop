$ = require('jquery');

$(function() {

  $.get('https://maps.googleapis.com/maps/api/browserlocation/json?browser=chromium&sensor=true', function(data) {

    var
      r = require('rethinkdb'),
      info = require('./db.json'),
      location = data.location;

    var current_point = r.point(parseFloat(location.lng), parseFloat(location.lat));

    var connection = null;
    r.connect({host: info.host, port: info.port}, function(err, conn) {

      if (err) {
        throw err;
      }

      connection = conn;

      var db = r.db(info.database);

      db.table('interest_room').run(conn, function(err, cursor) {
        cursor.each(function(connection, value) {


          console.log(value);

          var room_point = r.point(parseFloat(value.location.lon), parseFloat(value.location.lat));
          r.distance(room_point, current_point, {unit: 'km'}).run(conn, function(data) {
            console.log(data);
          });

        });
      });
    });
  });
});

