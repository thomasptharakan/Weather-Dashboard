var searchHistory = [];

//Capture Search Button Click
$('#search-button').on('click', function (event) {
    event.preventDefault();
    var seletedCity = $('#search-input').val();
    if (seletedCity !== '') {
        getWeather(seletedCity);
        addSearchHistory(seletedCity);
    }

});

//Capture Saved History Click
$('#history').on('click', function (event) {
    var btnPressed = $(event.target);
    getWeather(btnPressed.text());

});


//API call to get Weather
function getWeather(searchCity) {
    var apiKey = '&appid=d2608201a87a1ca4c802d02be8697936';
    var queryURL = 'https://api.openweathermap.org/data/2.5/forecast?&q=' +
        searchCity +
        apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var weatherSearchResult = {};
        weatherSearchResult.city = response.city.name;
        //Set to first date in list
        var currDate = moment(response.list[0].dt_txt).format('yyyy-MM-DD HH:mm:ss');
        weatherSearchResult.weather = [];


        //Fucntion to Add elements to weatherSearchResult Object
        function addWeatherDay(weatherDate, temp, wind, humidity, icon) {
            var weatherDay = {};
            weatherDay.date = moment(weatherDate).format('DD/MM/YYYY');
            weatherDay.temp = (temp - 273.15).toFixed(2);
            weatherDay.wind = wind;
            weatherDay.humidity = humidity;
            weatherDay.icon = (`http://openweathermap.org/img/wn/${icon}.png`);
            weatherSearchResult.weather.push(weatherDay)
        }

        //Get 6 Weather readings
        for (j = 0; j < 6; j++) {
            //Get the data to check against - Start from first date in list
            var checkDate = moment(currDate).add(j, 'day').format('yyyy-MM-DD');
            //Get morning readings except for current day
            
            //Check against each element in list
            for (i in response.list) {
                //Check for a match in the list item date vs the checkdate
                
                
                if (moment(response.list[i].dt_txt).format('DD/MM/YYYY') === moment(checkDate).format('DD/MM/YYYY')) {
                    
                    //Add the Weather data to the object
                    console.log(moment(response.list[i].dt_txt).format('DD/MM/YYYY') + ' ' + moment(checkDate).format('DD/MM/YYYY') + ' ' );
                    addWeatherDay(
                        checkDate,
                        response.list[i].main.temp,
                        response.list[i].wind.speed,
                        response.list[i].main.humidity,
                        response.list[i].weather[0].icon
                    )
                    //Break out on first match 
                    break;
                }
            }
        }

        // Add JumboTron and Cards

        for (i in weatherSearchResult.weather) {
            //Add jumbotron for the first element
            if (i == 0) {
                
                //Adding Jumbotron
                $('#today').empty();
                $('#forecast').empty();
                var jmbtrn = $('<div>');
                jmbtrn.attr('class', 'jumbotron');
                jmbtrn.attr('style', 'border: 1px solid black; padding:10px;');

                //Add City,Date
                var pEl = $('<h1>');
                pEl.attr('class', 'display-6');
                pEl.text(`${weatherSearchResult.city} (${weatherSearchResult.weather[i].date})`);
                
                //Add image
                var imgWeather = $('<img>');
                imgWeather.attr('src',weatherSearchResult.weather[i].icon);
                pEl.append(imgWeather);
                jmbtrn.append(pEl);

                //Add Temperature details

                pEl = $('<p>');
                pEl.attr('class', 'card-text');
                pEl.text(`Temp: ${weatherSearchResult.weather[i].temp} °C`);
                jmbtrn.append(pEl);

                pEl = $('<p>');
                pEl.attr('class', 'card-text');
                pEl.text(`Wind: ${weatherSearchResult.weather[i].wind} KPH`);
                jmbtrn.append(pEl);

                pEl = $('<p>');
                pEl.attr('class', 'card-text');
                pEl.text(`Humidty: ${weatherSearchResult.weather[i].humidity}%`);
                jmbtrn.append(pEl);

                $('#today').append(jmbtrn);
            }else{
                //Adding forecast Cards
                //Add forecast Text

                //Add forecast date
                var cardEl = $('<div>');
                cardEl.attr('class','card d-inline-block');
                cardEl.attr('style','width: 12rem; background-color:#2F365A; color: white; margin: 5px');
                var cardDiv = $('<div>');
                cardDiv.attr('class','card-body');

                var pEl = $('<h5>');
                pEl.attr('class', 'card-title');
                pEl.text(`(${weatherSearchResult.weather[i].date})`); //Add icon
                cardDiv.append(pEl);
                //Add image
                var imgWeather = $('<img>');
                imgWeather.attr('src',weatherSearchResult.weather[i].icon);
                pEl.append(imgWeather);
                cardDiv.append(pEl);

                pEl = $('<p>');
                pEl.attr('class', 'card-text');
                pEl.text(`Temp: ${weatherSearchResult.weather[i].temp} °C`);
                cardDiv.append(pEl);

                pEl = $('<p>');
                pEl.attr('class', 'card-text');
                pEl.text(`Wind: ${weatherSearchResult.weather[i].wind} KPH`);
                cardDiv.append(pEl);

                pEl = $('<p>');
                pEl.attr('class', 'card-text');
                pEl.text(`Humidity: ${weatherSearchResult.weather[i].humidity}%`);
                cardDiv.append(pEl);

                cardEl.append(cardDiv);

                $('#forecast').append(cardEl);



            }

        }

        console.log(weatherSearchResult);
    });

}

//Add search history to local storage array
function addSearchHistory(city) {
    var savedHistory = localStorage.getItem('searchHistory');
    //Check for save history
    if (savedHistory !== null) {
        searchHistory = savedHistory.split(',');
    }
    //Check if City already exists in list
    if (!(searchHistory.includes(city))) {
        //Add the city to the history
        searchHistory.push(city);
        //Save to local storage
        localStorage.setItem('searchHistory', searchHistory);
        //Render the saved history again
        displayHistory();
    }
}

//Display Search History as Buttons
function displayHistory() {
    //Clear history div
    $('#history').empty();
    //Get savedHistory from local Storage
    var savedHistory = localStorage.getItem('searchHistory');
    //Check if SavedHistory exists
    if (savedHistory !== null) {
        //Convert string to array
        searchHistory = savedHistory.split(',');
        //Add each element as a button
        for (i in searchHistory) {
            var btnHistory = $('<button>');
            btnHistory.text(searchHistory[i]);
            btnHistory.attr('style', 'margin:2px; border-radius:5px;background-color:grey');
            $('#history').prepend(btnHistory);
        }
    }

}

//Invoke history from localstorage
displayHistory();