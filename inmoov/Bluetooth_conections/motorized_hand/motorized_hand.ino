#include <Servo.h>


Servo servo[7];
int position[7];
String command;

void setup()
{
  //-- Attach the servos. Order for right and, counting from little finger to the thumb
  // servo[2] and servo[4] have opposite direction

  servo[0].attach(6);
  servo[1].attach(7);
  servo[2].attach(8);
  servo[3].attach(9);
  servo[4].attach(10);
  //servo[5].attach(11);    //wrist servo

  for (int i=0; i<6; i++){
    position[i]=90;
    servo[i].write(position[i]);
    } 

  Serial.begin(19200);
  
}

void loop()
{

    if(Serial.available())
    {
        char c = Serial.read();

        if(c == '\n')
        {
          parseCommand(command);
          command = "";
        }
        else
        {
           command += c;
        }
    }
}

void parseCommand(String com)
{
  String part1;
  String part2;

/*-- Example of commmands:

    A 97
    B 168

    Letters from A to G
    Values from 0 to 180

*/

  part1 = com.substring(0,com.indexOf(" "));
  part2 = com.substring(com.indexOf(" ")+1);

  if(part1.equalsIgnoreCase("A"))
  {
    int value = part2.toInt();
    servo[0].write(value);

  }
  else if(part1.equalsIgnoreCase("B"))
  {

    int value = part2.toInt();
    servo[1].write(value);

  }
  else if(part1.equalsIgnoreCase("C"))
  {

    int value = part2.toInt();
    servo[2].write(value);

  }
  else if(part1.equalsIgnoreCase("D"))
  {

    int value = part2.toInt();
    servo[3].write(value);

  }
  else if(part1.equalsIgnoreCase("E"))
  {

    int value = part2.toInt();
    servo[4].write(value);

  }
  else if(part1.equalsIgnoreCase("ALL"))
  {
    int value = part2.toInt();

    for (int i=0; i<6; i++){
      if(i==2||i==4) servo[i].write(90 + value);
      else servo[i].write(90 - value);
    }
/*
    for (int i=0; i<6; i++){
      if(i==2||i==4) servo[i].write(90+50);
      else servo[i].write(90-50);
    } */

  }
  else
  {
    Serial.println("Command not recognized");

  }  
}