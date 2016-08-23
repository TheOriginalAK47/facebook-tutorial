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

var menuMsg = "MENU\nVIEW: to view topics\nNEW: to add topics\nVET: to see who wants to talk\nTALK: to see your conversations\nME: to edit your profile\nTerms: https://example.com/terms\nHelp: https://example.com/help\nStandard message & data rates apply."

// for Facebook verification
app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text.toLowerCase()
            if (text === "hi" || text === "hello") {
                sendTextMessage(sender, "Welcome to MapleChat! Text MENU to get started!")
            } else if (text === "menu") {
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