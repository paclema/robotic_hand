const int delay_between_measaures = 1;
void setup(){
  Serial.begin(19200); //this baud is compatible with BT
}
void loop()
{ 
  Serial.print("HAND:");Serial.print(analogRead(A0));
  Serial.print(","); Serial.print(analogRead(A1));
  Serial.print(","); Serial.print(analogRead(A2));
  Serial.print(","); Serial.print(analogRead(A3));
  Serial.print(","); Serial.print(analogRead(A4));
  Serial.print(";"); Serial.println();
  delay(delay_between_measaures);
  
  /*
  values seems to be like that:
  450-500 - straight
  600 - a little bit
  800 - full
  */
}