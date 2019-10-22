var panels = document.getElementsByClassName('movable'); //parts массив объектов

var panelWidth = 379; //в моем случае у пласти одинаковый размер
var panelHeight = 733;

var origX = [425, 942, 425, 942, 425, 934, 425, 942]; //где должны находиться панельки сидел долго подбирал
var origY = [-45, -45, 175, 175, 395, 395, 615, 615];
//в цикле задаем ширин и высоту
for (var i = 0; i < panels.length; i++) {
    panels[i].setAttribute("width", panelWidth);
    panels[i].setAttribute("height", panelHeight);
    // parts[i].setAttribute("x", Math.floor((Math.random() * 10) + 1)); //ложим прозрачную панельку где-то в случаном месте по иксу
    // parts[i].setAttribute("y", Math.floor((Math.random() * 409) + 1)); //ложим прозрачную панельку где-то в случаном месте по игрику
    panels[i].setAttribute("x", origX[i] - 300);
    panels[i].setAttribute("y", origY[i]);
    panels[i].setAttribute("onmousedown", "selectElement(evt)"); //при нажатии калвиши мышки на элемента запускаем функци selectElement
}

var elementSelect = 0;
var currentX = 0;
var currentY = 0;
var currentPosX = 0;
var currentPosY = 0;
//конгда щелкнули по по панельке запускается эту функция
function selectElement(mouseEventObject) {
    elementSelect = reorder(mouseEventObject);
    currentX = mouseEventObject.clientX; //координата по X в клиентской области
    currentY = mouseEventObject.clientY; // координата по y в клиентской области
    currentPosx = parseFloat(elementSelect.getAttribute("x"));
    currentPosy = parseFloat(elementSelect.getAttribute("y"));
    elementSelect.setAttribute("onmousemove", "moveElement(evt)");
}

function moveElement(mouseEventObject) {
    var dx = mouseEventObject.clientX - currentX;
    var dy = mouseEventObject.clientY - currentY;
    currentPosx = currentPosx + dx;
    currentPosy = currentPosy + dy;
    elementSelect.setAttribute("x", currentPosx);
    elementSelect.setAttribute("y", currentPosy);
    currentX = mouseEventObject.clientX;
    currentY = mouseEventObject.clientY;
    elementSelect.setAttribute("onmouseout", "deselectElement(evt)");
    elementSelect.setAttribute("onmouseup", "deselectElement(evt)");
    magnet();
}

function deselectElement(mouseEventObject) {
    testing();
    if (elementSelect != 0) {
        elementSelect.removeAttribute("onmousemove");
        elementSelect.removeAttribute("onmouseout");
        elementSelect.removeAttribute("onmouseup");
        elementSelect = 0;
    }
}

var environment = document.getElementById('environment');

function reorder(evt) {
    var parent = evt.target.parentNode;
    var clone = parent.cloneNode(true);
    var id = parent.getAttribute("id");
    environment.removeChild(document.getElementById(id));
    environment.appendChild(clone);
    return environment.lastChild.firstChild;
}

function magnet() {
    for (var i = 0; i < panels.length; i++) {
        if (Math.abs(currentPosx - origX[i]) < 60 && Math.abs(currentPosy - origY[i]) < 60) {
            elementSelect.setAttribute("x", origX[i]);
            elementSelect.setAttribute("y", origY[i]);
        }
    }
}

var win = document.getElementById("win");

function testing() {
    var well_located = 0;
    var fathers = document.getElementsByClassName('father');
    for (var i = 0; i < panels.length; i++) {
        var posx = parseFloat(fathers[i].firstChild.getAttribute("x"));
        var posy = parseFloat(fathers[i].firstChild.getAttribute("y"));
        ide = fathers[i].getAttribute("id");
        if (origX[ide] == posx && origY[ide] == posy) {
            well_located = well_located + 1;
        }
    }
    if (well_located == 8) {
        alert("Все рассатвленно по своим местам!");
    }
}