require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('node:dns');
const Database = require("@replit/database")
const { v4: uuidv4 } = require("uuid")
const bodyParser = require("body-parser")

const app = express();


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));

const db = new Database()

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/shorturl/:short', async function (req, res) {
  var short_id = req.params.short
  console.log(short_id)
  var original_url = await db.get(short_id)

  res.redirect(original_url)
})

app.post('/api/shorturl', function (req, res) {
  const url = req.body.url

  if(!url.startsWith('https')) {
    res.json({ error: "invalid url" })
    return
  }

  var id = getRandomInt(50)
  
  db.set(id, url)
  res.send({ original_url: url, short_url: id })
})

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
