// ! means declare & run last lines of declaration ....}();
!function buildList() {
  var channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404","RiotGamesRu"];
  var i;
  for (i = 0; i < channels.length; i++) {
    $.ajax({
      url: "https://api.twitch.tv/kraken/streams/" + channels[i],
      jsonp: "callback",
      dataType: "jsonp",
      success: ajaxSuccess,
    });

    function ajaxSuccess(response) {
      var list = document.getElementById("list"),
      listItem = document.createElement("li"),
      anchor = document.createElement("a"),
      userImg = document.createElement("img");
      // alert(response.stream)
      if (!!response.stream) {
        console.log(response.stream);
        userImg.src = response.stream.channel.logo;
        console.log(userImg.src);
        anchor.href = "https://www.twitch.tv/" + response._links.channel.replace(/^https:\/\/.*\//g, "");
        anchor.target = "_blank";
        anchor.appendChild(userImg);
        listItem.appendChild(anchor);
        var textNodeText = response._links.channel.replace(/^https:\/\/.*\//g, "") + "\u2014 " + response.stream.game + " \u2014 " + response.stream.channel.status;
        var textNode = document.createTextNode(" " + textNodeText);
        listItem.appendChild(textNode);
        listItem.className = "online";
        list.appendChild(listItem);
      } else if (!!response.error) {
        listItem.innerHTML = response.message.split(" ")[1].replace(/\'/g, "") + "channel is unavailable";
        listItem.className = "offline";
        list.appendChild(listItem);
      } else {
        listItem.innerHTML = response._links.channel.replace(/^https:\/\/.*\//g, "") + " \u2014 offline";
        listItem.className = "offline";
        list.appendChild(listItem);
      }
    }
  }
}();
$("#offline").click(function() {
  var list = document.getElementById("list");
  if ($("#offline").prop("checked")) {
    $("li").each(function() {
      if ($(this)[0].style.display == "none") {
        $(this)[0].style.display = "inline-flex";
      }
    });
  } else {
    //what to do if unchecked
    $("li").each(function(index) {
      var linner = $(this).text();
      if ((/offline|unavailable/g).test(linner)) {
        $(this)[0].style.display = "none";
      }
    });
  }
});

$("#online").click(function() {
  var list = document.getElementById("list");
  if ($("#online").prop("checked")) {
    $("li").each(function() {
      var linner = $(this).text();
      if ($(this)[0].style.display == "none" && (/^(?!.*(offline|unavailable))/g).test(linner)) {
        $(this)[0].style.display = "inline";
      }
    });
  } else {
    //what to do if unchecked
    $("li").each(function(index) {
      var linner = $(this).text();
      if ((/^(?!.*(offline|unavailable))/g).test(linner)) {
        $(this).css("display", "none");
      }
    });
  }
});