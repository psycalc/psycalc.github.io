const EnterKeyCode = 13;
var input = document.getElementById("search"),
  resultsContainer = document.getElementById("container-results"),
  aboutResults = document.getElementById("about-results"),
  globalData,
  nextBtn = document.getElementById("next"),
  previousBtn = document.getElementById("previous"),
  totalhits = 0,
  globalTotalhits, currentPage = 1,
  sroffset = 0,
  randomBtn = document.getElementById("random");

function resetValues() {
  currentPage = 1;
  sroffset = 0;
  aboutResults.innerHTML = "";
}

function callback(data) {
  globalData = data;
}
// /w/api.php?action=query&format=json&list=random&rnlimit=10
nextBtn.addEventListener("click", nextBtnClickHandler);

function nextBtnClickHandler(e) {
  if (totalhits - 10 > 0) {
    if (nextBtn.disabled) {
      nextBtn.disabled = false;
    }
    clearOldResults();
    sroffset += 10;
    currentPage++;
    JSONP("https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + encodeURIComponent(term) + "&utf8=&format=json&srprop=score|size|snippet&sroffset=" + sroffset + "&callback=callback");
    whenAvailable("globalData", function() {
      resultsContainer.style.display = "inline-block";
      aboutResults.innerHTML = "found " + totalhits + " results " + "current page:" + currentPage + " of " + Math.round(globalTotalhits / 10);
      if (totalhits > 10) {
        nextBtn.style.display = "inline-block";
        previousBtn.style.display = "inline-block";
      }
      for (var i = 0; i < 10; i++) {
        var result = document.createElement("div");
        result.className = "result";
        // result.innerHTML = globalData.query.search[i].snippet;
        var aTag = document.createElement("a")
        aTag.href = "https://en.wikipedia.org/wiki/" + globalData.query.search[i].title.replace(/\s/g, "_");
        aTag.innerHTML = globalData.query.search[i].title;
        result.appendChild(aTag);
        var textNode = document.createTextNode(" " + globalData.query.search[i].snippet.replace(/<.*>/g, ""));
        result.appendChild(textNode);
        resultsContainer.appendChild(result);
      }
    });
  } else {
    nextBtn.disabled = true;
  }
}
previousBtn.addEventListener("click", previousBtnClickHandler);

function previousBtnClickHandler(e) {
  if (currentPage > 1) {
    // console.log("curret page:"+currentPage+" sroffset:"+sroffset);
    sroffset -= 10;
    // console.log("curret page:"+currentPage+" sroffset:"+sroffset);
    currentPage--;
    clearOldResults();
    JSONP("https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + encodeURIComponent(term) + "&utf8=&format=json&srprop=score|size|snippet&sroffset=" + sroffset + "&callback=callback");
    whenAvailable("globalData", function() {
      resultsContainer.style.display = "inline-block";
      aboutResults.innerHTML = "results " + "current page:" + currentPage + " of " + Math.round(globalTotalhits / 10);
      if (totalhits > 10) {
        nextBtn.style.display = "inline-block";
        previousBtn.style.display = "inline-block";
      }
      for (var i = 0; i < 10; i++) {
        var result = document.createElement("div");
        result.className = "result";
        // result.innerHTML = globalData.query.search[i].snippet;
        var aTag = document.createElement("a")
        aTag.href = "https://en.wikipedia.org/wiki/" + globalData.query.search[i].title.replace(/\s/g, "_");
        aTag.innerHTML = globalData.query.search[i].title;
        result.appendChild(aTag);
        var textNode = document.createTextNode(" " + globalData.query.search[i].snippet.replace(/<.*>/g, ""));
        result.appendChild(textNode);
        resultsContainer.appendChild(result);
      }
    });
  }
}
input.addEventListener("input", inputInputHandler);

function inputInputHandler(e) {
  if (e.target.value === "") {
    clearOldResults();
    resetValues();
    aboutResults.innerHTML = "";
    next.style.display = "none";
    previous.style.display = "none";
  }
}
input.addEventListener("keyup", inputKeyupHandler);

function inputKeyupHandler(e) {
  resetValues();
  if (e.keyCode === EnterKeyCode) {
    clearOldResults();
    term = e.target.value;
    if (!term) {
      clearOldResults();
    }
    resultsContainer.style.display = "block";
    console.log("first sroffset:" + sroffset);
    JSONP("https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + encodeURIComponent(term) + "&utf8=&format=json&srprop=score|size|snippet&sroffset=" + sroffset + "&callback=callback");
    whenAvailable("globalData", function(t) {
      // do something
      // console.log(globalData.query);
      globalTotalhits = globalData.query.searchinfo.totalhits;
      totalhits = globalTotalhits;
      resultsContainer.style.display = "inline-block";
      aboutResults.innerHTML = "found " + totalhits + " results " + "current page:" + currentPage + " of " + Math.round(totalhits / 10);
      if (totalhits > 10) {
        nextBtn.style.display = "inline-block";
        previousBtn.style.display = "inline-block";
      }
      for (var i = 0; i < 10; i++) {
        var result = document.createElement("div");
        result.className = "result";
        // result.innerHTML = globalData.query.search[i].snippet;
        var aTag = document.createElement("a")
        aTag.href = "https://en.wikipedia.org/wiki/" + globalData.query.search[i].title.replace(" ", "_");
        aTag.innerHTML = globalData.query.search[i].title;
        result.appendChild(aTag);
        var textNode = document.createTextNode(" " + globalData.query.search[i].snippet.replace(/<.*>/g, ""));
        result.appendChild(textNode);
        resultsContainer.appendChild(result);
      }
      globalData = "undefined";
    });
  }
}
randomBtn.addEventListener("click", randomBtnClickHandler);

function randomBtnClickHandler () {
  clearOldResults();
  JSONP("https://en.wikipedia.org/w/api.php?action=query&format=json&list=random&meta=&callback=callback&rnnamespace=4&rnlimit=10");
  whenAvailable("globalData", function() {
    console.log(globalData);
      resultsContainer.style.display = "inline-block";
      // aboutResults.innerHTML = "found " + totalhits + " results " + "current page:" + currentPage + " of " + Math.round(globalTotalhits / 10);
      for (var i = 0; i < 10; i++) {
        var result = document.createElement("div");
        result.className = "result";
        // result.innerHTML = globalData.query.search[i].snippet;
        var aTag = document.createElement("a");
        aTag.href = "https://en.wikipedia.org/wiki/" + globalData.query.random[i].title.replace(/\s/g, "_");
        aTag.innerHTML = globalData.query.random[i].title;
        result.appendChild(aTag);
        var textNode = document.createTextNode(" " + globalData.query.random[i].title.replace(/<.*>/g, ""));
        result.appendChild(textNode);
        resultsContainer.appendChild(result);
      }
    globalData = "undefined";
    }
  );
                }

  function JSONP(url) {
    var scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.src = url;
    var appendedChild = document.head.appendChild(scriptTag);
    appendedChild.remove();
  }

  function clearOldResults() {
      aboutResults.innerHTML = "";
    while (resultsContainer.firstChild) {
      resultsContainer.removeChild(resultsContainer.firstChild);
    }
  }

  function whenAvailable(name, callback) {
    var interval = 10; // ms
    window.setTimeout(function() {
      if (typeof window[name] === "object") {
        callback(window[name]);
      } else {
        window.setTimeout(arguments.callee, interval);
      }
    }, interval);
  }