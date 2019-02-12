console.log("inside main.js");
console.log("before readmore");
$('.read_more_js').readmore({
    speed: 75,
    lessLink: '<a href="#">Закрыть</a>',
    moreLink: '<a href="#">Подробнее</a>',
    embedCSS: true,
    blockCSS: 'display: block; width: 100%;',
    startOpen: false
});
console.log("after readmore");

function toggle_show(id) {
    document.getElementById(id).style.display = document.getElementById(id).style.display == 'none' ? 'flex' : 'none';
}

// function read_more(id) {
//     document.getElementById(id).style.display = document.getElementById(id).style.maxHeight == '100 px' ? '999 px' : '100 px';
// }

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "flex";
    evt.currentTarget.className += " active";
}