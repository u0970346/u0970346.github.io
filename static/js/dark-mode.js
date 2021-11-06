function darkmodeFunc() {
    var element = document.body;
    element.classList.toggle("dark-mode");

    var elements = document.getElementsByClassName('mb-0');
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.color = 'black';
    }
    
    var icon = document.getElementById("icon");
    if(document.body.classList.contains("dark-mode")){
        icon.src = "/static/images/sun.png";
    }
    else{
        icon.src = "/static/images/moon.png";
    }
}