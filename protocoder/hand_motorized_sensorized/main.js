/* hand_controller

Read from arduino by bluetooth diferent sensors and plot it on phone. Then connect to another arduino by bluetooth to send data processend on protocoder app

by Pablo Clemente (aka paclema)
check it at: https://github.com/paclema/robotic_hand

    
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
var actuator_data = [];

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
        
        txt.text("Raw sensors: " + "\t" + data + "\n");
        
        //Read data values form sensors and stores on sensor_raw array:
        // Example of raw data: HAND:758,567,744,844,753;
        
        data=data.split(";");                           //we don't need the final ";" of the protocol
        var data_part1 = data[0].split(":");            //We take HAND:758,567,744,844,753
                                                        //Now data_part1[0] = HAND  and data_part1[1] = 758,567,744,844,753
        
        if( data_part1[0] == "HAND"){
            var data_part2 = data_part1[1].split(",");  //Now data_part2 is data_part1[1] splitted
            for(var i=0;i<data_part2.length;i++) sensor_raw[i] = data_part2[i];
            
            //console.log(data_part2.length);
            //console.log(data_part2[4]);            
            //console.log(sensor_raw);
        }
        
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
var txt4 = ui.addText(10, 1550, ui.screenWidth, 50);

//*****************************************************************************************   Functions:

function Update_raw_sensors_data(){
    
    var cnt = 0;
    
    // ParseInt raw data and copy to draw variables for processing plot:
    for(cnt=0; cnt<sensor_raw.length; cnt++){
        sensor_raw[cnt] = parseInt(sensor_raw[cnt]);
        sensor_plot[cnt] = sensor_raw[cnt];
    } 
    

    // Map raw data to min/max actuator ends and fix to integer data:
    for(cnt=0; cnt<sensor_raw.length; cnt++){
        if(actuator_dir[cnt])         sensor_raw[cnt] = map( sensor_raw[cnt], sensor_raw_min[cnt], sensor_raw_max[cnt], actuator_min[cnt], actuator_max[cnt]);      //Normal actuator direcction
        else if(!actuator_dir[cnt])   sensor_raw[cnt] = map( sensor_raw[cnt], sensor_raw_max[cnt], sensor_raw_min[cnt], actuator_max[cnt], actuator_min[cnt]);      //Reversed actuator direction
        
        sensor_raw[cnt] = sensor_raw[cnt].toFixed(0);
        
    } 
    
    
    // Map plot data to min/max plot ends and fix to integer data:
    for(cnt=0; cnt<sensor_raw.length; cnt++){
        sensor_plot[cnt] = map( sensor_plot[cnt], sensor_raw_min[cnt], sensor_raw_max[cnt], plot_min, plot_max);
        sensor_plot[cnt] = sensor_plot[cnt].toFixed(0);
        
    }
    
    // Copy sensor_plot data to sensor_plot_draw data because of misbehaviour on processing plot:
    for(cnt=0; cnt<sensor_raw.length; cnt++)  sensor_plot_draw[cnt] = sensor_plot[cnt];

    

    // Send processed data to actuators:
    actuator_data.length = 0;               //To empty actuator_data
    actuator_data.push("HAND:");
    for(cnt=0; cnt<sensor_raw.length; cnt++){
        actuator_data.push(sensor_raw[cnt]);
        if(cnt != 4) actuator_data.push(",");
    }
    actuator_data.push(";");

    if(btClient1) btClient1.send(actuator_data + "\n" );

    // DEBUG text:
    txt2.text("Actuators: " + "\t" + sensor_raw + "\n");
    txt3.text("actuator_data: " + "\t" + actuator_data + "\n");   
    txt4.text("sensor_plot: "+ "\t" + sensor_plot + "\n");
  
    
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

//*****************************************************************************************   Sliders:

    //  ******** ------------ TODO --------------------