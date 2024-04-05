$(document).ready(function () {
    var lastTweetId = null; // Zmienna przechowująca ID ostatniego pobranego tweeta

    // Sample tweets for testing
    var sampleTweets = [
        {
            user: { screen_name: "example_user1" },
            text: "This is a sample tweet about a police chase.",
            created_at: "Mon Apr 04 2024 12:00:00 GMT+0200 (Central European Summer Time)"
        },
        {
            user: { screen_name: "example_user2" },
            text: "Another tweet mentioning pursuit in Los Angeles.",
            created_at: "Mon Apr 04 2024 12:05:00 GMT+0200 (Central European Summer Time)"
        },
        // Add more sample tweets as needed
    ];

    // Funkcja do pobierania nowych tweetów w czasie rzeczywistym przy użyciu SSE
    var eventSource = new EventSource('/twitter-stream');
    eventSource.onmessage = function(event) {
        var tweet = JSON.parse(event.data);
        if (tweetContainsKeywords(tweet)) {
            displayTweet(tweet);
            playNotificationSound();
        }
    };

    // Funkcja do pobierania pierwszych 10 tweetów po załadowaniu strony
    fetchInitialTweets();

    // Funkcja do pobierania nowych tweetów przy scrollowaniu (infinite scroll)
    $(window).scroll(function() {
        if ($(window).scrollTop() == $(document).height() - $(window).height()) {
            fetchNewTweets();
        }
    });

    function fetchInitialTweets() {
        // W tym miejscu będziemy używać sampleTweets do symulowania początkowego pobierania tweetów
        checkAndDisplayTweets(sampleTweets);
    }

    function fetchNewTweets() {
        // Ta funkcja zostanie zaimplementowana, aby pobrać nowe tweety z serwera Twittera
    }

    function checkAndDisplayTweets(tweets) {
        var container = $("#tweets-container");

        tweets.forEach(function (tweet) {
            var tweetElement = $("<div class='tweet'></div>");
            var author = $("<p class='author'></p>");
            var avatar = $("<img class='avatar'>").attr("src", tweet.user.avatar || "https://cdn2.iconfinder.com/data/icons/lineheads-professions-color-sketch/128/avatar_profession_people-08-512.png");
            author.append(avatar, "@" + tweet.user.screen_name);
            var text = $("<p class='text'></p>").text(tweet.text);
            var date = $("<p class='date'></p>").text(tweet.created_at);
            
            // Sprawdź, czy tweet zawiera słowa kluczowe
            if (tweetContainsKeywords(tweet)) {
                var tweetLink = $("<a class='tweet-link' target='_blank'></a>").attr("href", "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str).text("Link do tweetu");
                tweetElement.append(author, text, date, tweetLink);
                container.prepend(tweetElement); // Dodaj nowy tweet na początek listy
                playNotificationSound();
            }
        });
    }

    function tweetContainsKeywords(tweet) {
        var keywords = ["pościg", "police chase", "pursuit"];
        var lowercaseText = tweet.text.toLowerCase();
        return keywords.some(function (keyword) {
            return lowercaseText.includes(keyword);
        });
    }

    function playNotificationSound() {
        var audio = new Audio('alert.mp3');
        audio.volume = 0.2; // Ustaw głośność na 20%
        audio.play();
    }
});
