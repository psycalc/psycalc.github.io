if (typeof console != "undefined")
  if (typeof console.log != 'undefined')
    console.olog = console.log;
  else
    console.olog = function() {};
var textarea = document.getElementsByTagName("textarea");
textarea[0].value = "for (var i=0;i<100;i++) {\n\tconsole.log(i);\n}";
var button = document.getElementsByTagName("button");
button[0].addEventListener("click", function() {
  (new Function(textarea[0].value))();

  console.log = function(message) {
    console.olog(message);
    textarea[1].value +=+ message + "\n";
  };
  console.error = console.debug = console.info = console.log
});
button[1].addEventListener("click", function () {
   textarea[1].value = "";
});