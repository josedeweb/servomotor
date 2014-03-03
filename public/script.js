window.onload = function() {    
    var socket = io.connect(window.location.href);    
    var x = 0;  

    if (window.DeviceMotionEvent != undefined) {
        //se detecta la cantidad de movimiento y se almacena en x
        window.ondevicemotion = function(e) {
            x = e.acceleration.x;
        }
        setInterval(function(){
            //emitimos al servidor la cantidad de movimiento detectada.
            socket.emit('send', { message: x });
        }, 25);
    } 
}
