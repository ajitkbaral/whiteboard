var colors = ['black', 'gray', 'white', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
var socketColor = colors[0], activeColor=colors[0];

var swatches = document.getElementsByClassName('swatch');

for(var i=0, n=colors.length; i<n; i++) {
    var swatch = document.createElement('div');
    swatch.className = 'swatch';
    swatch.style.backgroundColor = colors[i];
    swatch.addEventListener('click', setSwatch);

    if(i==0) {
        swatch.classList.add('active');
    }
    
    document.getElementById('colors').appendChild(swatch);
}

function setColor(color) {

    setContextStyleColor(color);
    activeColor = color;
    
    //Inactive the swatch from class="swatch active" to class="swatch"
    var active = document.getElementsByClassName('active')[0];
    if(active) {
        active.className = 'swatch';
    }
}

function setSwatch(e) {
    //identify swatch
    var swatch = e.target;

    //set color
    setColor(swatch.style.backgroundColor);
    

    //give active class
    swatch.classList.add('active');

    //socket color
    socketColor = swatch.style.backgroundColor;

}
