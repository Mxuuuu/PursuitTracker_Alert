const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());

// Ustaw prawidłowy token dostępu
const twitterBearerToken = 'AAAAAAAAAAAAAAAAAAAAAAAIyjtAEAAAAAk4dc7u2fP2864chuEX0M6B1xqEQ%3D5XymhAEbF56VGy3YPRAy1e9TXjGoIXG2gmbU6LfDBc576fr5lE';

// Identyfikatory użytkowników Twittera do monitorowania
const twitterUserIds = ['MXUUUU_', '987654321']; // Zastąp rzeczywistymi ID użytkowników

// Słowa kluczowe do wyszukiwania w tweetach
const keywords = ['pościg', 'police chase', 'pursuit'];

// Pobierz tweety dla określonych użytkowników
const fetchTweets = async () => {
  const tweets = [];
  for (const userId of twitterUserIds) {
    try {
      const response = await axios.get(`https://api.twitter.com/2/users/${userId}/tweets`, {
        params: {
          expansions: 'author_id',
          'user.fields': 'username,name,profile_image_url',
          'tweet.fields': 'created_at,text'
        },
        headers: {
          Authorization: `Bearer ${twitterBearerToken}`
        }
      });
      tweets.push(...response.data.data);
    } catch (error) {
      console.error('Error fetching tweets:', error.message);
    }
  }
  return tweets;
};

// Filtruj tweety zawierające słowa kluczowe
const filterTweetsByKeywords = (tweets) => {
  return tweets.filter(tweet => {
    const lowercaseText = tweet.text.toLowerCase();
    return keywords.some(keyword => lowercaseText.includes(keyword));
  });
};

// Monitoruj tweety i wysyłaj odpowiedzi HTTP
const monitorTweets = async (req, res) => {
  try {
    const tweets = await fetchTweets();
    const filteredTweets = filterTweetsByKeywords(tweets);
    res.json(filteredTweets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dodaj obsługę ścieżki do pobierania tweetów z Twittera
app.get('/tweets', monitorTweets);

// Obsługa statycznych plików (np. plików CSS, JavaScript, obrazów)
app.use(express.static('public'));

// Obsługa ścieżki głównej, która zwraca plik index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/PoliceChaseTracker_AI/index.html');
});

// Nasłuchiwanie na określonym porcie
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
