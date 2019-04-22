// console.log("inside main.js");
// console.log("before readmore");
$('.read_more_js').readmore({
    speed: 75,
    lessLink: '<a href="#">Закрыть</a>',
    moreLink: '<a href="#">Подробнее</a>',
    embedCSS: true,
    blockCSS: 'display: block; width: 100%;',
    startOpen: false
});
// console.log("after readmore");

function toggle_show(id) {
    document.getElementById(id).style.display = document.getElementById(id).style.display == 'none' ? 'flex' : 'none';
}

// function read_more(id) {
//     document.getElementById(id).style.display = document.getElementById(id).style.maxHeight == '100 px' ? '999 px' : '100 px';
// }

function openTab(evt, tabName, contentClassName = "tabcontent", tablinkClass = "tablinks") {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName(contentClassName);
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName(tablinkClass);
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "flex";
    $.ajax({
        type: "GET",
        url: "parts/" + tabName + ".html",
        success: function(result) {
            $('#' + tabName).html(result);
        }
    });
    evt.currentTarget.className += " active";
}
//pseudo SPA
var LANGUAGE;

$.redrawLanguage = function(lang) {
    $.ajax({
        url: 'lang/' + lang + '.json', //тянем файл с языком
        dataType: 'json',
        success: function(response) {
            LANGUAGE = response; //записываем в глобальную переменную, а вдруг пригодиться
            $('body').find("[lng]").each(function() //ищем все элементы с атрибутом
                {
                    var lng = LANGUAGE[$(this).attr('lng')]; //берем нужное значение по атрибуту lng
                    var tag = $(this)[0].tagName.toLowerCase();
                    switch (tag) //узнаем название тега
                    {
                        case "input":
                            $(this).val(lng);
                            break;
                        default:
                            $(this).html(lng);
                            break;
                    }
                });
        }
    });
}

$.getLanguage = function(key) {
    if (typeof(LANGUAGE[key]) != 'undefined') //если есть переменная
    {
        return LANGUAGE[key]; //возвращаем значение
    }
    return key; //если нет, тогда ключ
}

// console.log("before redrawLanguage");
$.redrawLanguage("rus");
// console.log("after redrawLanguage");