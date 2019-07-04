const Twit = require('twit');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');

const { execSync } = require('child_process');
// stderr is sent to stderr of parent process
// you can set options.stdio if you want it to go elsewhere
console.log('la ruta');
console.log(execSync('ls').toString('utf8'));

const T = new Twit({
  consumer_key:         'HNDJyTtLSgTqaECGzN9Go2f9w',
  consumer_secret:      'qee32Bi9DuI1GXvRKCJEsWhd7YO5ON1z1qpPurGexJaYZydFVJ',
  access_token:         '123662346-1G2QmhixSBqOg0XPnqtVo3XP9ytwULeT8PimhL4m',
  access_token_secret:  'BfNHY4saSz7SMHip2APrFGlvtBLG0qab2L1RqX8RewcKR',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});


console.log(path.join(__dirname, 'public', 'index.html'));

http://expressjs.com/en/starter/static-files.html   
app.use(express.static('public'));

const brand = 'movistar';

io.on('connection', function(socket) {
  
  T.get('search/tweets', { q: brand, count: 100 }, function(err, data, response) {
    var tweetArray=[];
    for (let index = 0; index < data.statuses.length; index++) {
            const tweet = data.statuses[index];
            var tweetbody = {
              'text': tweet.text,
              'userScreenName': "@" + tweet.user.screen_name,
              'userImage': tweet.user.profile_image_url_https,
              'userDescription': tweet.user.description,
            }
            tweetArray.push(tweetbody);
        }     
        io.emit('allTweet',tweetArray)
    })

    var stream = T.stream('statuses/filter', { track: brand, language: 'es', filter_level: 'none' })

    stream.on('tweet', function (tweet) {
        console.log(tweet);
        io.emit('tweet',{ 'tweet': tweet });
    })
});


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});




// listen for requests :)
const listener = server.listen(process.env.PORT || 3000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
