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
    // panels[i].setAttribute("x", origX[i] - 300); раставляем панельку со сдвигом вправо на 300 px
    panels[i].setAttribute("x", origX[i]);
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

function reorder(mouseEventObject) {
    var parent = mouseEventObject.target.parentNode;
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
        // alert("Все рассатвленно по своим местам!");
        var lineWidth = "12";
        var line1color = colourNameToHex("black");
        var line2color = colourNameToHex("yellow");
        var line3color = colourNameToHex("black");
        var line4color = colourNameToHex("yellow");
        var newLine1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        newLine1.setAttribute('id', 'line1');
        newLine1.setAttribute('x1', '795');
        newLine1.setAttribute('y1', '400');
        newLine1.setAttribute('x2', '912');
        newLine1.setAttribute('y2', '920');
        newLine1.setAttribute('stroke-width', lineWidth);
        newLine1.setAttribute("stroke", line1color);
        // var triangle = getElementById("triangle");
        // triangle.setAttribute("fill", line1color);
        newLine1.setAttribute('marker-end', "url(#triangle)");
        newLine1.setAttribute('marker-start', "url(#triangle2)");
        panels[0].parentNode.appendChild(newLine1);

        var newLine2 = document.createElementNS('http://www.w3.org/2000/svg', 'line'); //первая стрелка процессионая
        newLine2.setAttribute('id', 'line2');
        newLine2.setAttribute('x1', '820');
        newLine2.setAttribute('y1', '500');
        newLine2.setAttribute('x2', '942');
        newLine2.setAttribute('y2', '765');
        newLine2.setAttribute('stroke-width', lineWidth);
        newLine2.setAttribute("stroke", line2color);
        newLine2.setAttribute('marker-end', "url(#triangle)");
        newLine2.setAttribute('marker-start', "url(#triangle2)");
        panels[0].parentNode.appendChild(newLine2);

        var newLine3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        newLine3.setAttribute('id', 'line3');
        newLine3.setAttribute('x1', '935');
        newLine3.setAttribute('y1', '400');
        newLine3.setAttribute('x2', '830');
        newLine3.setAttribute('y2', '920');
        newLine3.setAttribute('stroke-width', lineWidth);
        newLine3.setAttribute("stroke", line3color);
        newLine3.setAttribute('marker-end', "url(#triangle)");
        newLine3.setAttribute('marker-start', "url(#triangle2)");
        panels[0].parentNode.appendChild(newLine3);

        var newLine4 = document.createElementNS('http://www.w3.org/2000/svg', 'line'); //вторая стрелка процессионая
        newLine4.setAttribute('id', 'line4');
        newLine4.setAttribute('x1', '935');
        newLine4.setAttribute('y1', '500');
        newLine4.setAttribute('x2', '830');
        newLine4.setAttribute('y2', '765');
        newLine4.setAttribute('stroke-width', lineWidth);
        newLine4.setAttribute("stroke", line4color);
        newLine4.setAttribute('marker-end', "url(#triangle)");
        newLine4.setAttribute('marker-start', "url(#triangle2)");
        panels[0].parentNode.appendChild(newLine4);
    }

    function colourNameToHex(colour) {
        var colours = {
            "aliceblue": "#f0f8ff",
            "antiquewhite": "#faebd7",
            "aqua": "#00ffff",
            "aquamarine": "#7fffd4",
            "azure": "#f0ffff",
            "beige": "#f5f5dc",
            "bisque": "#ffe4c4",
            "black": "#000000",
            "blanchedalmond": "#ffebcd",
            "blue": "#0000ff",
            "blueviolet": "#8a2be2",
            "brown": "#a52a2a",
            "burlywood": "#deb887",
            "cadetblue": "#5f9ea0",
            "chartreuse": "#7fff00",
            "chocolate": "#d2691e",
            "coral": "#ff7f50",
            "cornflowerblue": "#6495ed",
            "cornsilk": "#fff8dc",
            "crimson": "#dc143c",
            "cyan": "#00ffff",
            "darkblue": "#00008b",
            "darkcyan": "#008b8b",
            "darkgoldenrod": "#b8860b",
            "darkgray": "#a9a9a9",
            "darkgreen": "#006400",
            "darkkhaki": "#bdb76b",
            "darkmagenta": "#8b008b",
            "darkolivegreen": "#556b2f",
            "darkorange": "#ff8c00",
            "darkorchid": "#9932cc",
            "darkred": "#8b0000",
            "darksalmon": "#e9967a",
            "darkseagreen": "#8fbc8f",
            "darkslateblue": "#483d8b",
            "darkslategray": "#2f4f4f",
            "darkturquoise": "#00ced1",
            "darkviolet": "#9400d3",
            "deeppink": "#ff1493",
            "deepskyblue": "#00bfff",
            "dimgray": "#696969",
            "dodgerblue": "#1e90ff",
            "firebrick": "#b22222",
            "floralwhite": "#fffaf0",
            "forestgreen": "#228b22",
            "fuchsia": "#ff00ff",
            "gainsboro": "#dcdcdc",
            "ghostwhite": "#f8f8ff",
            "gold": "#ffd700",
            "goldenrod": "#daa520",
            "gray": "#808080",
            "green": "#008000",
            "greenyellow": "#adff2f",
            "honeydew": "#f0fff0",
            "hotpink": "#ff69b4",
            "indianred ": "#cd5c5c",
            "indigo": "#4b0082",
            "ivory": "#fffff0",
            "khaki": "#f0e68c",
            "lavender": "#e6e6fa",
            "lavenderblush": "#fff0f5",
            "lawngreen": "#7cfc00",
            "lemonchiffon": "#fffacd",
            "lightblue": "#add8e6",
            "lightcoral": "#f08080",
            "lightcyan": "#e0ffff",
            "lightgoldenrodyellow": "#fafad2",
            "lightgrey": "#d3d3d3",
            "lightgreen": "#90ee90",
            "lightpink": "#ffb6c1",
            "lightsalmon": "#ffa07a",
            "lightseagreen": "#20b2aa",
            "lightskyblue": "#87cefa",
            "lightslategray": "#778899",
            "lightsteelblue": "#b0c4de",
            "lightyellow": "#ffffe0",
            "lime": "#00ff00",
            "limegreen": "#32cd32",
            "linen": "#faf0e6",
            "magenta": "#ff00ff",
            "maroon": "#800000",
            "mediumaquamarine": "#66cdaa",
            "mediumblue": "#0000cd",
            "mediumorchid": "#ba55d3",
            "mediumpurple": "#9370d8",
            "mediumseagreen": "#3cb371",
            "mediumslateblue": "#7b68ee",
            "mediumspringgreen": "#00fa9a",
            "mediumturquoise": "#48d1cc",
            "mediumvioletred": "#c71585",
            "midnightblue": "#191970",
            "mintcream": "#f5fffa",
            "mistyrose": "#ffe4e1",
            "moccasin": "#ffe4b5",
            "navajowhite": "#ffdead",
            "navy": "#000080",
            "oldlace": "#fdf5e6",
            "olive": "#808000",
            "olivedrab": "#6b8e23",
            "orange": "#ffa500",
            "orangered": "#ff4500",
            "orchid": "#da70d6",
            "palegoldenrod": "#eee8aa",
            "palegreen": "#98fb98",
            "paleturquoise": "#afeeee",
            "palevioletred": "#d87093",
            "papayawhip": "#ffefd5",
            "peachpuff": "#ffdab9",
            "peru": "#cd853f",
            "pink": "#ffc0cb",
            "plum": "#dda0dd",
            "powderblue": "#b0e0e6",
            "purple": "#800080",
            "rebeccapurple": "#663399",
            "red": "#ff0000",
            "rosybrown": "#bc8f8f",
            "royalblue": "#4169e1",
            "saddlebrown": "#8b4513",
            "salmon": "#fa8072",
            "sandybrown": "#f4a460",
            "seagreen": "#2e8b57",
            "seashell": "#fff5ee",
            "sienna": "#a0522d",
            "silver": "#c0c0c0",
            "skyblue": "#87ceeb",
            "slateblue": "#6a5acd",
            "slategray": "#708090",
            "snow": "#fffafa",
            "springgreen": "#00ff7f",
            "steelblue": "#4682b4",
            "tan": "#d2b48c",
            "teal": "#008080",
            "thistle": "#d8bfd8",
            "tomato": "#ff6347",
            "turquoise": "#40e0d0",
            "violet": "#ee82ee",
            "wheat": "#f5deb3",
            "white": "#ffffff",
            "whitesmoke": "#f5f5f5",
            "yellow": "#ffff00",
            "yellowgreen": "#9acd32"
        };

        if (typeof colours[colour.toLowerCase()] != 'undefined')
            return colours[colour.toLowerCase()];

        return false;
    }

}