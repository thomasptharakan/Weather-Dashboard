var searchHistory = [];

//Capture Search Button Click
$('#search-button').on('click', function (event) {
    event.preventDefault();
    var seletedCity = $('#search-input').val();
    getWeather(seletedCity);
    addSearchHistory(seletedCity);
});

//Capture Saved History Click
$('#history').on('click', function (event) {
    alert('btpressed');
    var btnPressed = $(event.target);
    getWeather(btnPressed.text());

});


//API call to get Weather
function getWeather(searchCity){
    var apiKey = '&appid=d2608201a87a1ca4c802d02be8697936';
    var queryURL = 'https://api.openweathermap.org/data/2.5/forecast?&q=' +
        searchCity +
        apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
    });

}

//Add search history to local storage array
function addSearchHistory(city){
    var savedHistory = localStorage.getItem('searchHistory');
    //Check for save history
    if (savedHistory!==null){
        searchHistory = savedHistory.split(',');
    }
    //Check if City already exists in list
    if (!(searchHistory.includes(city))){
        //Add the city to the history
        searchHistory.push(city);
        //Save to local storage
        localStorage.setItem('searchHistory',searchHistory);
        //Render the saved history again
        displayHistory();
    }
}

//Display Search History as Buttons
function displayHistory(){
    //Clear history div
    $('#history').empty();
    //Get savedHistory from local Storage
    var savedHistory = localStorage.getItem('searchHistory');
    //Check if SavedHistory exists
    if (savedHistory!==null){
        //Convert string to array
        searchHistory = savedHistory.split(',');
        //Add each element as a button
        for (i in searchHistory){
            var btnHistory = $('<button>');
            btnHistory.text(searchHistory[i]);
            $('#history').prepend(btnHistory);
        }
    }

}
    
//Invoke history from localstorage
displayHistory();