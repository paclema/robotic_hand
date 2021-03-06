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
#include <Oscillator.h>

#define T 1000

//-- Declare an oscillator
Oscillator osc[7];

#define DF 0  //-- 40

void setup()
{
  //-- Attach the oscillators to the servos
  osc[0].attach(6);
  osc[1].attach(7);
  osc[2].attach(8);
  osc[3].attach(9);
  osc[4].attach(10);
  osc[5].attach(11);
  
  //-------- Set the oscillator parameters
  //-- Set the offset. The servo will oscillate around this point
  //-- Units: Degrees. Default value: 0
  osc[0].SetO(20);
  //osc[0].SetA(40);
  osc[0].SetA(40);
  osc[0].SetT(T);
  osc[0].SetPh(DEG2RAD(0));
  
  //-- Finger 1
  osc[1].SetO(-15);
  //osc[1].SetA(60);
  osc[1].SetA(60);
  osc[1].SetT(T);
  osc[1].SetPh(DEG2RAD(0 + DF * 1));
  
  //-- Finger 2
  osc[2].SetO(-5);
  //osc[2].SetA(50);
  osc[2].SetA(50);
  osc[2].SetT(T);
  osc[2].SetPh(DEG2RAD(180 + DF * 2));
  
  //-- Finger 3
  osc[3].SetO(-15);
  //osc[3].SetA(60);
  osc[3].SetA(60);
  osc[3].SetT(T);
  osc[3].SetPh(DEG2RAD(0 + DF * 3));
  
  //-- Finger 4
  osc[4].SetO(0);
  //osc[4].SetA(60);
  osc[4].SetA(60);
  osc[4].SetT(T);
  osc[4].SetPh(DEG2RAD(180 + DF * 4));

  //-- Wrist
  osc[5].SetO(-20);
  //osc[5].SetA(40);
  osc[5].SetA(0);
  osc[5].SetT(T);
  osc[5].SetPh(DEG2RAD(180 + DF * 5));
  
}
int i=0;
void loop()
{
  while(i<14000){
  //-- Refresh the oscillator
  for (int i=0; i<6; i++)
    osc[i].refresh();
    i++;
  }
  i=0;
  delay(2000);
}


