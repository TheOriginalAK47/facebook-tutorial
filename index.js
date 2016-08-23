'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

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

var menuMsg = """MENU
VIEW: to view topics
NEW: to add topics
VET: to see who wants to talk
TALK: to see your conversations
ME: to edit your profile
Terms: https://example.com/terms
Help: https://example.com/help
Standard message & data rates apply.
"""

// for Facebook verification
app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            if (text.toLowerCase() === "hi" || text.toLowerCase() === "hello") {
                sendTextMessage(sender, "Welcome to MapleChat! Text MENU to get started!")
            } else if (text.toLowerCase() === "menu") {
                sendTextMessage(sender, menuMsg)
            } else {
                sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
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