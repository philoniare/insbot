'use strict';
const BootBot = require('bootbot');
const request = require('request');
const bodyParser = require('body-parser')

const PAGE_ACCESS_TOKEN = 'EAACpKOmSXJEBALmPzmUZBM9H6nC9FoONKvxwiMA1sP6ZBEYCJ8S6FsZBCRxryUCJHVGUKZChPUaDhDtUXMp6wZBZBzuSTZCZBciyVFBD7SI9O7pzBc573n0mbumQB8dJBShHQX3eSfMsOmfE0rWVfCNhUWkU8ZA2t5uqVQgVfH75ESXuhDWN79NOZA';
const SERVER_URL='https://nonchalant-lingonberry-2prk28nam.glitch.me';

const date_submissions = {};

const bot = new BootBot({
  accessToken: PAGE_ACCESS_TOKEN,
  verifyToken: 'INS-BOT',
  appSecret: '0a29166e294376c0892da9d65463c052'
});

bot.app.use(bodyParser.urlencoded({
  extended: true
}));

bot.app.get('/options', (req, res, next) => {
    let referer = req.get('Referer');
    if (referer) {
        if (referer.indexOf('www.messenger.com') >= 0) {
            res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/');
        } else if (referer.indexOf('www.facebook.com') >= 0) {
            res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.facebook.com/');
        }
        res.sendFile('options.html', {root: __dirname});
    }
});

bot.app.post('/optionspostback', (req, res) => {
    let body = req.body;
    let response = {
        "text": `Эхлэх өдөр: ${body.startDate}, дуусах өдөр: ${body.endDate} сонгогдлоо.`
    };
    res.status(200).send('Please close this window to return to the conversation thread.');
    callSendAPI(body.psid, response);
});

function handleMessage(sender_psid, received_message) {
    let response;

    // Checks if the message contains text
    if (received_message.text) {
        response = setRoomPreferences(sender_psid);
    } else {
        response = {
            "text": `Sorry, I don't understand what you mean.`
        }
    }

    // Send the response message
    callSendAPI(sender_psid, response);
}

bot.on('postback:VERIFY_DATE', (payload, chat) => {
  chat.say('Success!');
});

bot.on('message', (payload, chat) => {
  chat.conversation(convo => {
    chat.say({
      text: 'Favorite color?',
      buttons: [
        { type: "web_url",
                    url: SERVER_URL + "/options",
                    title: "Set preferences",
                    webview_height_ratio: "tall",
                    messenger_extensions: true },
      ]
    });
    
    // convo.ask({
    //   text: 'Даатгалын төрөл сонгоно уу?',
    //   quickReplies: [ 'Иргэн', 'Гэр бүл', 'Групп аялал' ]
    // }, (payload, convo) => {
    //   const text = payload.message.text;
    //   convo.set('type', text);
    //   askLastName(convo);
    // }
    //           , [
    //   {
    //     event: 'quick_reply',
    //     callback: (payload, convo) => {
    //       const text = payload.message.text;
    //       convo.say(`Thanks for choosing one of the options. Your favorite color is ${text}`);
    //     }
    //   }
    // ]
             // );
  });
});


const askLastName = (convo) => {
  convo.ask(`Last name`, (payload, convo) => {
    const text = payload.message.text;
    convo.set('last_name', text);
    askFirstName(convo);
  });
}

const askFirstName = (convo) => {
  convo.ask(`First name`, (payload, convo) => {
    const text = payload.message.text;
    convo.set('first_name', text);
    askRegister(convo);
  });
}

const askRegister = (convo) => {
  convo.ask(`Register`, (payload, convo) => {
    const text = payload.message.text;
    convo.set('register', text);
    askPassport(convo);
  });
}

const askPassport = (convo) => {
  convo.ask(`Passport`, (payload, convo) => {
    const text = payload.message.text;
    convo.set('passport', text);
    askAddress(convo);
  });
}

const askAddress = (convo) => {
  convo.ask(`Address`, (payload, convo) => {
    const text = payload.message.text;
    convo.set('address', text);
    askPhone(convo);
  });
}

const askPhone = (convo) => {
  convo.ask(`phone`, (payload, convo) => {
    const text = payload.message.text;
    convo.set('phone', text);
    askEmail(convo);
  });
}

const askEmail = (convo) => {
  convo.ask(`Email`, (payload, convo) => {
    const text = payload.message.text;
    convo.set('email', text);
    askFirstName(convo);
  });
}

const askHealthInfo = (convo) => {
  convo.ask(`сүүлийн 2 жилд авч байсан эрүүл мэндийн тусламж үйлчилгээний талаар  мэдээлэл`, (payload, convo) => {
    const text = payload.message.text;
    convo.set('health_info', text);
    askTravelCountry(convo);
  });
}

const askTravelCountry = (convo) => {
  const countries = [
    {"title":"Шенгений орнууд",
            "image_url":"https://www.desipassport.com/wp-content/uploads/2018/04/Europe.jpg",
            "subtitle":"European Countries",
            "buttons":[{
                "type":"postback",
                "title":"Сонгох",
                "payload":"EUROPE"
              }              
            ]    },
    {
      "title": "Америк, канад, япон",
      "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxQZvRCaXU99DF1ZDY4d-OEFFX4iWgaI7R_xGaocxLSvqdK32xow&s",
                "subtitle":"United Status, Canada, Japan",
            "buttons":[{
                "type":"postback",
                "title":"Сонгох",
                "payload":"USA"
              }              
            ]    },
    {"title":"Азийн орнууд",
     "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSreT__l3b28bV7Yv3YtcG0WPxY7Vo_XYcb3ysvp0rmW_OBodVSMg&s",
                "subtitle":"Asian Countries",
            "buttons":[{
                "type":"postback",
                "title":"Сонгох",
                "payload":"ASIA"
              }              
            ]    },
    {"title": "Бусад орнууд",
    "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTMbDfOKCr5KN4XA--B5jHOCwFSpKcfVOAPXVsVTmQdh-bWKyea",
                "subtitle":"Other countries",
            "buttons":[{
                "type":"postback",
                "title":"Сонгох",
                "payload":"OTHER"
              }              
            ]    }
    ];
  convo.ask((convo) => {
    convo.sendGenericTemplate(countries);
  }, (payload, convo)=> {
    convo.set('country', payload.postback.payload);
    
  })
}

function setRoomPreferences(sender_psid) {
    let response = {
        attachment: {
            type: "template",
            payload: {
                template_type: "button",
                text: "OK, let's set your room preferences so I won't need to ask for them in the future.",
                buttons: [{
                    type: "web_url",
                    url: SERVER_URL + "/options",
                    title: "Set preferences",
                    webview_height_ratio: "compact",
                    messenger_extensions: true
                }]
            }
        }
    };

    return response;
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message":{
          "attachment":{
            "type":"template",
            "payload":{
              "template_type":"button",
              "text": response,
              "buttons":[
                {
                  "type":"postback",
                  "title":"Баталгаажуулах",
                  "payload":"VERIFY_DATE"
                }
              ]
            }
          }
        }
    };
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": {"access_token": PAGE_ACCESS_TOKEN},
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

const port = 8069;

bot._initWebhook();
bot.app.set('port', port || 3000);
bot.server = bot.app.listen(bot.app.get('port'), '127.0.0.1', () => {
  const portNum = bot.app.get('port');
  console.log('BootBot running on port', portNum);
  console.log(`Facebook Webhook running on 127.0.0.1:${portNum}${bot.webhook}`);
});


bot.start();