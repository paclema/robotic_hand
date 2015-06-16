/* hand_controller

Read from arduino by bluetooth diferent sensors and plot it on phone. Then connect to another arduino by bluetooth to send data processend on protocoder app

by Pablo Clemente (aka paclema)

    
*/

// UI setup:

ui.backgroundColor(100, 100, 170);
ui.screenMode("portrait");
ui.screenMode("immersive");
ui.allowScroll(true);

// Main variables:

var sensor_raw = [];
var sensor_plot = [];
var sensor_plot_draw = [];


var sensor_raw_min = [ 500, 500, 500, 500, 500];
var sensor_raw_max = [ 900, 900, 900, 900, 900];

var actuator_min = [ 160, 40, 140, 20, 40];
var actuator_max = [ 0, 140, 20, 140, 180];
var actuator_dir = [ 0, 1, 0, 1, 1];

//*****************************************************************************************   Bluetooth conections:
 

//HAND:

var btClient1;
ui.addCheckbox("Hand Connected", 630, 0, 500, 100, false).onChange(function(val) { 
    console.log("Connect Hand" + val);

    if(val){
        btClient1=network.bluetooth.connectSerial('98:D3:31:B2:DC:26', function(status) {
            console.log("connected btClient1 " + status);
    
            if (status) media.playSound("Hand_connected.wav");               //media.textToSpeech("Mano conectada");
            
        });
    }
    
    if(!val){
        if(btClient1){
            btClient1.disconnect();
            media.playSound("Hand_disconnected.wav"); 
        } 
    }
    
    btClient1.onNewData(function(data) {
        txt.text(data + "\n");
    });
});

//FLEXIGLOVE:

var btClient2;
var btClient2_data;
ui.addCheckbox("Flexiglobe connected", 630, 70, 500, 100, false).onChange(function(val) { 
    console.log("Connect FlexiGlove" + val);
    
    if(val){
        btClient2=network.bluetooth.connectSerial('98:D3:31:30:1A:8C', function(status) {
            console.log("connected btClient2 " + status);
            
            if (status) media.playSound("Sensors_connected.wav");               //media.textToSpeech("Sensores conectados");
        });
        
    }
    
    if(!val){
        if(btClient2){
            btClient2.disconnect();
            media.playSound("Sensors_disconnected.wav"); 
        } 
    }
    
    btClient2.onNewData(function(data) {
        
        txt.text("Raw sensors: " + data + "\n");
        
        var tabla = data.split(" ");
        for(var i=0;i<=4;i++) sensor_raw[i] = tabla[2*i+1];
        Update_raw_sensors_data();
        
    });
});


//*****************************************************************************************   Buttons:

var input = ui.addInput("command", 0, 10, 360, 150);
var send = ui.addButton("Send", 370, 10).onClick(function() {
    btClient1.send(input.getText() + "\n");
});


var send_OPEN = ui.addButton("OPEN", 0, 300).onClick(function() {
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



//*****************************************************************************************   Plot Processing:
var processing_heigth = 800;
var processing = ui.addProcessing(10, 600, ui.screenWidth-20, processing_heigth, "P3D");

var plot_min = 0;
var plot_max = processing_heigth-100;

processing.setup(function(p) {
    p.background(1); 
    p.frameRate(25);
});

processing.draw(function(p) { 
    
    p.fill(0, 20);
    p.rect(0, 0, p.width, p.height);
    p.noStroke();
    p.fill(255);

    
    for(var j=0;j<5;j++){
        p.fill(2*sensor_plot_draw[j],0,255-2*sensor_plot_draw[j]);
        p.rect(0+j*220,   p.height, 200, -sensor_plot_draw[j]);
        
    }
        
});

//*****************************************************************************************   Texts:

var txt = ui.addText(10, 1400, ui.screenWidth, 50);
var txt2 = ui.addText(10, 1450, ui.screenWidth, 50);
var txt3 = ui.addText(10, 1500, ui.screenWidth, 50);

//*****************************************************************************************   Functions:

function Update_raw_sensors_data(){
    
        // ParseInt raw data and copy to draw variables for processing plot:
        for(var i=0; i<=4;i++){
            sensor_raw[i] = parseInt(sensor_raw[i]);
            sensor_plot[i] = sensor_raw[i];
        } 
        

        // Map raw data to min/max actuator ends and fix to integer data:
        for(var j=0; j<=4;j++){
            if(actuator_dir[j])         sensor_raw[j] = map( sensor_raw[j], sensor_raw_min[j], sensor_raw_max[j], actuator_min[j], actuator_max[j]);      //Normal actuator direcction
            else if(!actuator_dir[j])   sensor_raw[j] = map( sensor_raw[j], sensor_raw_max[j], sensor_raw_min[j], actuator_max[j], actuator_min[j]);      //Reversed actuator direction
            
            sensor_raw[j] = sensor_raw[j].toFixed(0);
            
        } 
        

       // Map plot data to min/max plot ends and fix to integer data:
        for(var l=0;l<=4;l++){
            sensor_plot[l] = map( sensor_plot[l], sensor_raw_min[l], sensor_raw_max[l], plot_min, plot_max);
            sensor_plot[l] = sensor_plot[l].toFixed(0);
            
        }
        
        // Copy sensor_plot data to sensor_plot_draw data because of misbehaviour on processing plot:
        for(var m=0; m<=4;m++)  sensor_plot_draw[m] = sensor_plot[m];

        
        // DEBUG:
        var separator = ",";
        txt2.text("Actuators: " + sensor_raw + "\n");
        txt3.text("sensor_plot: " + sensor_plot + "\n");
        
        // Send processed data to actuators:
        if(btClient1) btClient1.send(a + separator + b + separator + c + separator + d + separator + e + "\n" );
        
        
}

function update_sensors_ends(){
    
    
    //  ******** ------------ TODO --------------------
}

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

