/* sensorized_hand

Read from arduino by bluetooth diferent sensors and plot it on dashboard

*/

ui.backgroundColor(100, 100, 170);


var txt = ui.addText(10, 1450, ui.screenWidth, 200);

//add plot 

 var plot = dashboard.addPlot("Dedo a", 600, 100, 200, 100, 0, 10);

//int  a,b,c,d,e;
/*
String part1;
String part2;
*/
var a,b,c,d,e;

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
       
        a=parseInt(tabla[1]);
        b=parseInt(tabla[3]);
        c=parseInt(tabla[5]);
        d=parseInt(tabla[7]);
        e=parseInt(tabla[9]);
        var separator = ",";
        console.log(a + separator + b + separator + c + separator + d + separator + e + "\n" );
        
        
        plot.update(a);
       
        
    });
});


ui.allowScroll(false);
var processing = ui.addProcessing(10, 600, ui.screenWidth-20, 800, "P3D");

var x = 100; 
var size;
var c; 
var count = 0.0;

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