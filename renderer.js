// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

$(function(){

  var r = require('rethinkdb');

  var connection = null;
  r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    
    if (err) {
      throw err;
    }

    connection = conn;

    r.db('test').table('names').changes().run(conn, function(err, cursor) {
      cursor.each(function(connection, value) {

        $('body').append(value['new_val'].message + "<br />");
      });
    })
  });

});

