var searchHistory = [];

$('#search-button').on('click', function (event) {
    event.preventDefault();
    var apiKey = '&appid=d2608201a87a1ca4c802d02be8697936';
    var seletedCity = $('#search-input').val();
    var queryURL = 'https://api.openweathermap.org/data/2.5/forecast?&q=' +
        seletedCity +
        apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        addSearchHistory(seletedCity);
    });

});

function addSearchHistory(city){
    var savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory!==null){
        searchHistory = savedHistory.split(',');
    }
    searchHistory.push(city);
    localStorage.setItem('searchHistory',searchHistory);
    displayHistory();
}

function displayHistory(){
    alert('in here');
    $('#history').clear();
    var savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory!==null){
        searchHistory = savedHistory.split(',');
        for (i in searchHistory){
            var btnHistory = $('<button>');
            btnHistory.text(searchHistory[i]);
            $('#history').prepend(btnHistory);
        }
    }

}
    
    
