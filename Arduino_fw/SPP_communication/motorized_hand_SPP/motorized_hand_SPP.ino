#include <Servo.h>


//Ejemplo: "40,40,40,40,40" + "\n"
//btClient1.send("40,40,40,40,40" + "\n");


Servo servo[7];
int position[7];

void setup()
{
  //-- Attach the servos. Order for right and, counting from little finger to the thumb
  // servo[2] and servo[4] have opposite direction

  servo[4].attach(6);
  servo[3].attach(7);
  servo[2].attach(8);
  servo[1].attach(9);
  servo[0].attach(10);
  //servo[5].attach(11);    //wrist servo

  for (int i=0; i<6; i++){
    position[i]=90;
    servo[i].write(position[i]);
    } 

  Serial.begin(19200);
  
}

void loop()
{

  while (Serial.available() > 0) {

    for (int i=0; i<=4; i++)    position[i] = Serial.parseInt(); 

    // look for the newline. That's the end of your
    // sentence:
    if (Serial.read() == '\n') {

      for (int i=0; i<=4; i++){
        servo[i].write(position[i]);
      }

    }
  }
}

