'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const pg = require('pg')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// app.js
Bot.init(
  config.FBChatToken || '',
  'SETUP_PLAY_GO_THIS_IS_RIGHT',
  config.useFBChatLocalTest || false,
);

Bot.on('text', async (event: object) => {
  // do something
});

Bot.on('attachments', async (event: object) => {
  // do something
});

Bot.on('postback', async (event: object) => {
  // do something
});

app.use('/webhook', Bot.router());
// go to http://localhost:5000/webhook/localChat/ for local chat debugging

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('/db', {results: result.rows} ); }
    });
  });
});

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function isUser(sender) {
    sendTextMessage(sender, "called isUser")
    db.any('SELECT sender FROM USERS')
     .then(function(data) {
       res.ststus(200)
        .json({
          status: 'success',
          data: data,
          message: 'Queried USERS for sender'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createNewUser (sender) {
  db.any('INSERT sender INTO USERS' )
  sendTextMessage(sender, "not null, called isUser")
    .then(function(data) {
      res.ststus(200)
        .json({
          status: 'success',
          data: data,
          message: 'Returned the state of the user_id session'
        });
    })
    .catch(function (err) {
      return next(err);
    });


}


var menuMsg = "MENU\nVIEW: to view topics\nNEW: to add topics\nVET: to see who wants to talk\nTALK: to see your conversations\nME: to edit your profile\nTerms: https://example.com/terms\nHelp: https://example.com/help\nStandard message & data rates apply."
// for Facebook verification
app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id

        if (event.message && event.message.text) {
            let text = event.message.text.toLowerCase()
            if (text =! null) {
                isUser(sender)
            } else{
                //This would be an empty message
                sendTextMessage(sender, "null")
            }
        }
    }
    res.sendStatus(200)
})



const token = process.env.FB_PAGE_ACCESS_TOKEN

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})