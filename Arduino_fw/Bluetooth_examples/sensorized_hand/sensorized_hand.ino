const int delay_between_measaures = 1;
void setup(){
  Serial.begin(19200); //this baud is compatible with BT
}
void loop()
{ 
  Serial.print("A "); Serial.print(analogRead(A0));
  Serial.print(" B "); Serial.print(analogRead(A1));
  Serial.print(" C "); Serial.print(analogRead(A2));
  Serial.print(" D "); Serial.print(analogRead(A3));
  Serial.print(" E "); Serial.print(analogRead(A4));
  Serial.println(); //empty line to see measures differences
  delay(delay_between_measaures);

  /*
  values seems to be like that:
  450-500 - straight
  600 - a little bit
  800 - full
  */
}