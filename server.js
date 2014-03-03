var five = require("johnny-five")
    express = require("express"),
    app = express(),
    board, servo,
    port = 3000;

//configuramos nuestra app web
app.set('views', __dirname + '/views');
app.set('view engine', "jade");
app.use(express.static(__dirname + '/public'));
app.engine('jade', require('jade').__express);

//index
app.get("/", function(req, res){
    res.render("index");
});

//Cargamos nuestra tarjeta arduino
board = new five.Board();

board.on("ready", function() {
    //creamos una variable apuntando al pin 9 del arduino donde
    //estará conectado nuestro servomotor y lo centramos
    servo = new five.Servo(9);
    servo.center();
});

//Inicializamos socketio
var io = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);

io.sockets.on('connection', function(socket){
    //detectamos el evento send, con el cual se comunica el cliente
    socket.on('send', function (data) {
        //recibimos la cantidad de movimiento
        //y la adapatamos giros para el servomotor
        data.message /= 10;
        data.message = 90 + (90 * data.message);
        data.message = parseInt(data.message);

        if(data.message <= 0) {
            data.message = 0;
        } else if(data.message >= 180) {
            data.message = 180;
        }
        //movemos el servo en la magnitud indicada
        servo.move(data.message);        
    });
});