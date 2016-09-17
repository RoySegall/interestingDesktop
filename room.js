const $ = require('jquery');
const queryString = require('query-string');
const queryArguments = queryString.parse(location.search);

window.$ = window.jQuery = $;

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

      cursor.each(function(connection, value) {
        $('.body').append("<div class='message'>" + value['new_val'].text + "</div>");
      });
    });

    $('.ui.submit.button').click(function() {
      db.table('interest_room_messages').insert({
        'created': parseInt(Math.floor(new Date().getTime() / 1000)),
        'room_id': queryArguments['id'],
        'text': $('#message').val(),
        'user_id': 1 // for now.
      }).run(conn, function(err, cursor) {
        $('#message').val('');
      });
    });
  });

});

