function detectAdblock(adblockDetected) {
    //console.warn('adblock detected: ' + adblockDetected);
    if(adblockDetected) {
        $.ajax({
            method: 'POST',
            url: '/article/matching_url',
            data: {
                url: window.location.href
            },
            success: function(data) {
                if(data) {
                    console.log('Redirect url: ', data);
                    window.location.href = data;
                }
            }
        });
    }
}
(function(w, d, callback) {
    if (isOldBrowser()) {
        return
    }
    var SCRIPT_REGEXP = /\/\/an\.yandex\.ru\/(system|resource|page|meta)\//;
    var MARKUP_TPL = '<yatag class="yap-reset"><yatag class="yap-layout yap-layout_type_vertical"><yatag class="yap-layout__logo">Яндекс.Директ</yatag><yatag class="yap-layout__wrapper"><table class="yap-layout__items"><tr><td class="yap-layout__item yap-layout__item_nth_1"><yatag class="yap-layout__outer"><yatag class="yap-layout__inner"><yatag class="yap-layout__content"><yatag class="yap-layout__title"><a class="yap-title-block__text" href="//an.yandex.ru/count/{LINK}">{TITLE}</a></yatag><yatag class="yap-layout__body">{BODY}</yatag></yatag></yatag></yatag></td></tr></table></yatag></yatag></yatag>';
    var MARKUP_TEST_TIMEOUT = 50;
    var loadStatus;
    var markupStatus;
    var container;
    var nativeCreateElement = d.createElement;
    var nativeWrite = d.write;
    w.adbOnerror = onError;
    w.adbOnload = onLoad;
    d.createElement = function() {
        var node = nativeCreateElement.apply(this, arguments);
        if (node.nodeName === "SCRIPT") {
            node.addEventListener("error", onError);
            node.addEventListener("load", onLoad)
        }
        return node
    };
    d.write = function(str) {
        var scriptStr = "<script ";
        if (str.indexOf(scriptStr) === 0 && SCRIPT_REGEXP.test(str)) {
            var len = scriptStr.length;
            str = str.slice(0, len) + 'onload="adbOnload.call(this)" onerror="adbOnerror.call(this)" ' + str.slice(len)
        }
        nativeWrite.apply(this, arguments)
    };
    document.addEventListener("DOMContentLoaded", initMarkupTest);

    function reportLoad(status) {
        if (loadStatus === undefined) {
            loadStatus = status;
            reportIfReady();
            clearListeners()
        }
    }

    function reportMarkup(status) {
        if (markupStatus === undefined) {
            markupStatus = status;
            reportIfReady();
            clearMarkup()
        }
    }

    function reportIfReady() {
        if (markupStatus !== undefined && loadStatus !== undefined) {
            callback(markupStatus || loadStatus)
        }
    }

    function onError(src) {
        if (SCRIPT_REGEXP.test(this.src)) {
            reportLoad(true)
        }
    }

    function onLoad(src) {
        if (SCRIPT_REGEXP.test(this.src) && /\/(page|meta)\//.test(this.src)) {
            reportLoad(false)
        }
    }

    function clearListeners() {
        removeEventListeners();
        delete w.adbOnerror;
        delete w.adbOnload;
        d.createElement = nativeCreateElement;
        d.write = nativeWrite
    }

    function removeEventListeners() {
        var scripts = document.getElementsByTagName("script");
        for (var i = 0, len = scripts.length; i < len; i++) {
            scripts[i].removeEventListener("load", onLoad);
            scripts[i].removeEventListener("error", onError)
        }
    }

    function getDummy(forLink) {
        var ALPHABET = "абвгдежзиклмнопрстуфхцчшщъыьэюя";
        var ENG_ALPHABET = "abcdefghijklmnopqrstuvwxyz";
        var LINK_LEN = 100;
        var MIN_WORDS = 3;
        var MAX_WORDS = 7;
        var MIN_LEN = 2;
        var MAX_LEN = 10;
        var alphabet = forLink ? ENG_ALPHABET : ALPHABET;
        var wordsCount = forLink ? 1 : Math.floor(Math.random() * (MAX_WORDS - MIN_WORDS) + MIN_WORDS);
        var words = [];
        for (var i = 0; i < wordsCount; i++) {
            var curWord = "";
            var curLength = forLink ? LINK_LEN : Math.floor(Math.random() * (MAX_LEN - MIN_LEN) + MIN_LEN);
            for (var ii = 0; ii < curLength; ii++) {
                curWord += alphabet[Math.floor(Math.random() * alphabet.length)]
            }
            words.push(curWord)
        }
        return words.join(" ")
    }

    function initMarkupTest() {
        var html = MARKUP_TPL.replace("{TITLE}", getDummy()).replace("{BODY}", getDummy()).replace("{LINK}", getDummy(true));
        document.createElement("YATAG");
        container = document.createElement("div");
        container.style = "position:absolute; left:-100px; top:-100px; width:100px; height:100px;";
        container.innerHTML = html;
        document.body.appendChild(container);
        setTimeout(function() {
            testMarkup(container)
        }, MARKUP_TEST_TIMEOUT)
    }

    function testMarkup(container) {
        try {
            var link = container.getElementsByClassName("yap-title-block__text");
            var body = container.getElementsByClassName("yap-layout__body");
            if (!link.length || !body.length) {
                reportMarkup(true);
                return
            }
            var linkSize = link[0].getBoundingClientRect();
            var bodySize = body[0].getBoundingClientRect();
            if (linkSize.width * linkSize.height <= 1 || bodySize.width * bodySize.height <= 1) {
                reportMarkup(true);
                return
            }
            reportMarkup(false)
        } catch (err) {
            reportMarkup(false)
        }
    }

    function clearMarkup() {
        container.parentNode.removeChild(container)
    }

    function isOldBrowser() {
        try {
            document.documentElement.getBoundingClientRect().width;
            return false
        } catch (err) {
            return true
        }
    }
})(window, document, detectAdblock);
