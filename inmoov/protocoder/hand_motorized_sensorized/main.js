/* hand_controller

Read from arduino by bluetooth diferent sensors and plot it on phone

    
*/

ui.backgroundColor(100, 100, 170);
var txt = ui.addText(10, 1400, ui.screenWidth, 50);
var txt2 = ui.addText(10, 1450, ui.screenWidth, 50);

//var servo_values;
var a,b,c,d,e;
var a_draw,b_draw,c_draw,d_draw,e_draw;
// *******************************************************************    Bluetooth conections:
ui.addButton("Scan bluetooth", 680, 150).onClick(function() {
    network.bluetooth.scanNetworks(function(n, m, s) { 
        console.log("hola", n, m, s);
        txt.append(n + " " + m + " " + s + "\n");
    });
});

var btClient1;
ui.addButton("Connect Hand", 290, 0).onClick(function() {

    btClient1=network.bluetooth.connectSerial('98:D3:31:B2:DC:26', function(status) {
        console.log("connected btClient1 " + status);

        if (status) media.playSound("Hand_connected.wav");               //media.textToSpeech("Mano conectada"); 
        //if (!status) media.playSound("Hand_disconnected.wav");           //media.textToSpeech("Mano desconectada"); 
        
    });
    
    /*
    btClient1 = network.bluetooth.connectSerial(function(status) {
        console.log("connected btClient1 " + status);
        
        if (status) media.playSound("Hand_connected.wav");               //media.textToSpeech("Mano conectada"); 
        if (!status) media.playSound("Hand_disconnected.wav");           //media.textToSpeech("Mano desconectada"); 
    });
    */
    
    btClient1.onNewData(function(data) {
        txt.text(data + "\n");
    });
});

ui.addButton("Disconnect", 10, 0).onClick(function() {
    if(btClient1) btClient1.disconnect();
    if(btClient2) btClient2.disconnect();
});

var input = ui.addInput("message", 10, 150, 400, 150);
var send = ui.addButton("Send", 410, 150).onClick(function() {
    btClient1.send(input.getText() + "\n");
});


var btClient2;
ui.addButton("Connect FlexiGlove", 620, 0).onClick(function() {
    //if you want to use the Bluetooth Address, use 
    //network.bluetooth.connectSerial(macAddess, function(status) {});
    
    /*
    btClient2 = network.bluetooth.connectSerial(function(status) {
        console.log("connected btClient2 " + status);
    });*/
    
    
    btClient2=network.bluetooth.connectSerial('98:D3:31:30:1A:8C', function(status) {
        console.log("connected btClient2 " + status);
        if (status) media.playSound("Sensors_connected.wav");               //media.textToSpeech("Sensores conectados"); 
        //if (!status) media.playSound("Sensors_disconnected.wav");           //media.textToSpeech("Sensores desconectados"); 
    });

    
    btClient2.onNewData(function(data) {
        
        txt.text("Raw sensors: " + data + "\n");
        
       var tabla = data.split(" ");

        a=parseInt(tabla[1]);
        b=parseInt(tabla[3]);
        c=parseInt(tabla[5]);
        d=parseInt(tabla[7]);
        e=parseInt(tabla[9]);
        
        
        var separator = ",";
        
         //console.log( "Not map:" + a + separator + b + separator + c + separator + d + separator + e + "\t" );
        
        
            a=map(a,500,900,160,0);
            b=map(b,500,900,40,140);
            c=map(c,500,900,140,20);
            d=map(d,500,900,20,140);
            e=map(e,500,900,40,180);
       
            a=a.toFixed(0);
            b=b.toFixed(0);
            c=c.toFixed(0);
            d=d.toFixed(0);
            e=e.toFixed(0);
            
            a_draw=map(a,140,40,40,140);
            b_draw=b;
            c_draw=map(c,140,40,40,140);
            d_draw=d;
            e_draw=e;            
        
        txt2.text("Actuators: " + a + separator + b + separator + c + separator + d + separator + e + "\n");
        //console.log(a + separator + b + separator + c + separator + d + separator + e + "\n" );
        if(btClient1) btClient1.send(a + separator + b + separator + c + separator + d + separator + e + "\n" );
        
        
        
    });
});

// *************************************************************************   buttons:

var send_OPEN = ui.addButton("OPEN", 10, 300).onClick(function() {
    //btClient1.send("ALL 50" + "\n");
    btClient1.send("140,40,140,40,40" + "\n");
    
});
var send_CLOSED = ui.addButton("CLOSED", 310, 300).onClick(function() {
    //btClient1.send("ALL -50" + "\n");
    btClient1.send("40,140,40,140,140" + "\n");
});
var send_thumbUp = ui.addButton("send_thumbUp", 610, 300).onClick(function() {
    btClient1.send("40,140,40,140,140" + "\n" +  "E 140" + "\n");
});



//*************************************************************************  Processing:

ui.allowScroll(true);
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
    
    p.fill(2*a_draw,0,255-2*a_draw);
    p.rect(0,   p.height, 200, -a_draw*6);
    p.fill(2*b_draw,0,255-2*b_draw);
    p.rect(220, p.height, 200, -b_draw*6);
    p.fill(2*c_draw,0,255-2*c_draw);
    p.rect(440, p.height, 200, -c_draw*6);
    p.fill(2*d_draw,0,255-2*d_draw);
    p.rect(660, p.height, 200, -d_draw*6);
    p.fill(2*e_draw,0,255-2*e_draw);
    p.rect(880, p.height, 200, -e_draw*6);
});


//**************************************************************************** Functions:

 function  map( sensor_val,  in_min,  in_max,  out_min,  out_max){
       // in_min start of range
       // in_max end of range
       // sensor_val the starting number between the range
         var percentage = (sensor_val-in_min)/(in_max-in_min);
         var out = (out_max-out_min)*percentage+out_min;
       // out_min start of new range
       // out_max end of new range
       
        return out;
    }
