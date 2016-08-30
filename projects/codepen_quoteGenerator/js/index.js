/*curl --get --include 'https://yusufnb-quotes-v1.p.mashape.com/widget/~einstein.json' \
  -H 'X-Mashape-Key: jm4sHmffU0mshbUWGEESydXcPMS8p1y9ndVjsnJoH87wwJDtmU' \
  -H 'Accept: application/json'*/
buttonNextQuoteClickEventHandler();
$("#quote-button").on("click", buttonNextQuoteClickEventHandler)

function buttonNextQuoteClickEventHandler(e) {
  $.ajax({
    url: 'https://andruxnet-random-famous-quotes.p.mashape.com/?cat=movies', // указываем URL и
    dataType: "json", // тип загружаемых данных
    headers: {
      "X-Mashape-Key": "jm4sHmffU0mshbUWGEESydXcPMS8p1y9ndVjsnJoH87wwJDtmU",
      "Accept": "application/json"
    },
    success: function(data, textStatus) { // вешаем свой обработчик на функцию success
      // }
      //console.log(data);
      $("#quote-paragraph").text(data.quote);
      // $("#w3s").attr("href", "http://www.w3schools.com/jquery");
      $("#quote-author").text('"' + data.author + '"');
      console.log(data);
    }
  });
}
jQuery("#twitter-button").on("click",buttonMakeATweetHandler);
function buttonMakeATweetHandler(e) {
  //encodeURIComponent(str);
  //https://api.twitter.com/1.1/statuses/update.json?status=
  //
  var statusStr = jQuery("#quote-paragraph").text();
  var Film = jQuery("#quote-author").text();
  var twtLink = 'http://twitter.com/home?status=' +encodeURIComponent(statusStr+" "+Film);
 window.open(twtLink,'_blank');
}