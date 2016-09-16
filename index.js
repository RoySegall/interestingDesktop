const $ = require('jquery');

window.$ = window.jQuery = $;

$(function() {

  if (localStorage.getItem('UserInfo') == null) {
    $('.rooms').hide();
    $('.dimmer').hide();


    $('.submit.button').click(function() {
      $('form').addClass('loading');
      $.get('https://api.github.com/users/' + $(".email").val()).done(function(data) {
          localStorage.setItem('UserInfo', data);
          $('form').removeClass('loading');
          location.reload();
        })
        .fail(function() {
          alert("Can't find this username");
        });
    });
  }
  else {
    $('.login').hide();
    
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

        var rooms = $('.rooms tbody').hide();

        db.table('interest_room').run(conn, function(err, cursor) {

          cursor.each(function(connection, value) {

            var room_point = r.point(parseFloat(value.location.lon), parseFloat(value.location.lat));

            r.distance(room_point, current_point, {unit: 'km'}).run(conn, function(error, data) {
              rooms.append("<tr><td><a href='room.html?id=" + value['id'] + "'>" + value['name'] + "</a></td><td>" + data + " KM</td></tr>");
            });

          }, function(value) {
            rooms.show();
            $('.dimmer').hide();
          });
        });
      });
    });
  }

});
