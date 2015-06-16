#define T 1000
//--------------------------------------------------------------
//-- ArduSnake library: Locomotion of modular snake robots
//-----------------------------------------------------------
//-- Layer: Oscillator
//------------------------------------------------------------
//-- Example of use of the Oscillator layer
//--
//-- Example 2: Setting the oscillator parameters
//-- One servo is being oscillated using the parameters set by the user
//--------------------------------------------------------------
//-- (c) Juan Gonzalez-Gomez (Obijuan), Feb-2012
//-- GPL license
//--------------------------------------------------------------
#include <Servo.h>
Servo servo[7];

void setup()
{
  //-- Attach the oscillators to the servos
  servo[0].attach(6);
  servo[1].attach(7);
  servo[2].attach(8);
  servo[3].attach(9);
  servo[4].attach(10);
  //servo[5].attach(11);
  
}

void loop()
{
  //-- Refresh the oscillator
  for (int i=0; i<6; i++)
    if(i==2||i==4) servo[i].write(90-50);
    else servo[i].write(90+50);
    delay(1000);

    delay(1000);
  for (int i=0; i<6; i++)
    if(i==2||i==4) servo[i].write(90+50);
    else servo[i].write(90-50);

    delay(1000);    
}


