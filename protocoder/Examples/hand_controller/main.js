/* sensorized_hand

Read from arduino by bluetooth diferent sensors and plot it on dashboard

    
*/
ui.backgroundColor(100, 100, 170);

var txt = ui.addText(10, 450, ui.screenWidth, -1);

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


/*
var btClient2;
ui.addButton("Connect to bluetooth", 380, 450).onClick(function() {
    //if you want to use the Bluetooth Address, use 
    //network.bluetooth.connectSerial(macAddess, function(status) {});
    btClient2 = network.bluetooth.connectSerial(function(status) {
        console.log("connected btClient2 " + status);
    });
    
    btClient2.onNewData(function(data) {
        txt.text(data + "\n");
        btClient1.send(data + "\n");
        
    });
});*/