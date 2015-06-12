/* hand_controller

Read from arduino by bluetooth diferent sensors and plot it on dashboard

    
*/

ui.backgroundColor(100, 100, 170);
var txt = ui.addText(10, 1450, ui.screenWidth, 200);


//var servo_values;
var a,b,c,d,e;

ui.addButton("Scan bluetooth", 10, 0).onClick(function() {
    network.bluetooth.scanNetworks(function(n, m, s) { 
        console.log("hola", n, m, s);
        txt.append(n + " " + m + " " + s + "\n");
    });
});

var btClient1;
ui.addButton("Connect to bluetooth", 380, 0).onClick(function() {
    //if you want to use the Bluetooth Address, use 
    //network.bluetooth.connectSerial(macAddess, function(status) {});
    btClient1 = network.bluetooth.connectSerial(function(status) {
        console.log("connected btClient1 " + status);
    });
    
    btClient1.onNewData(function(data) {
        txt.text(data + "\n");
    });
});

ui.addButton("Disconnect", 680, 150).onClick(function() {
    btClient1.disconnect();
    btClient2.disconnect();
});

var input = ui.addInput("message", 10, 150, 400, 150);
var send = ui.addButton("Send", 410, 150).onClick(function() {
    btClient1.send(input.getText() + "\n");
});
var send_OPEN = ui.addButton("OPEN", 10, 300).onClick(function() {
    btClient1.send("ALL 50" + "\n");
});
var send_CLOSED = ui.addButton("CLOSED", 310, 300).onClick(function() {
    btClient1.send("ALL -50" + "\n");
});
var send_thumbUp = ui.addButton("send_thumbUp", 610, 300).onClick(function() {
    btClient1.send("ALL -50" + "\n" +  "E 140" + "\n");
});


var btClient2;
ui.addButton("Connect to bluetooth", 380, 450).onClick(function() {
    //if you want to use the Bluetooth Address, use 
    //network.bluetooth.connectSerial(macAddess, function(status) {});
    btClient2 = network.bluetooth.connectSerial(function(status) {
        console.log("connected btClient2 " + status);
    });
    
    btClient2.onNewData(function(data) {
        
        txt.text(data + "\n");
        //console.log(data + "\n");
        
       var tabla = data.split(" ");
       
       /*
       for(i=1;i<=9;i=i*2){
        servo_values[i] = parseInt(tabla[i]);
       }
       */
       
        a=parseInt(tabla[1]);
        b=parseInt(tabla[3]);
        c=parseInt(tabla[5]);
        d=parseInt(tabla[7]);
        e=parseInt(tabla[9]);
        
        var separator = ",";
        
            a=convertSensor2servo(a,500,700,140,40);
            b=convertSensor2servo(b,500,900,40,40);
            c=convertSensor2servo(c,500,900,140,40);
            d=convertSensor2servo(d,500,900,40,140);
            e=convertSensor2servo(e,500,90,40,140);
        
        console.log(a + separator + b + separator + c + separator + d + separator + e + "\n" );
        btClient1.send(a + separator + b + separator + c + separator + d + separator + e + "\n" );
        
        
        
    });
});


ui.allowScroll(false);
var processing = ui.addProcessing(10, 600, ui.screenWidth-20, 800, "P3D");
var c; 

processing.setup(function(p) {
    p.background(1); 
    p.frameRate(25);
    c = 100;
});

processing.draw(function(p) { 
    
    p.fill(0, 20);
    p.rect(0, 0, p.width, p.height);
    p.noStroke();
    p.fill(255);
    /*
    size = a / 500;
    for(var i = 20; i < p.width - 20; i+=10 ) {
        p.ellipse(i, p.height / 2 - 100+ b + x * p.sin(count + i), size, size);
    }
    count += 0.1;
    */
    
    p.rect(0, p.height, 200, -a);
    p.rect(220, p.height, 200, -b);
    p.rect(440, p.height, 200, -c);
    p.rect(660, p.height, 200, -d);
    p.rect(880, p.height, 200, -e);
});


function map( x,  in_min,  in_max,  out_min,  out_max){
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}


function convertSensor2servo( sensor_val,  in_min,  in_max,  out_min,  out_max){
		var x= sensor_val;
//		int in_min = 450;
//		int in_max = 900;
//		int out_min = 10;
//		int out_max = 170;
		
		var out = (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
		if(out < out_min) return out_min; 
		if(out > out_max) return out_max;
		return out;
	}
