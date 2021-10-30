function darkmodeFunc() {
    var element = document.body;
    element.classList.toggle("dark-mode");
    var elements = document.getElementsByClassName('h5');
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.color = 'black';
    }
}