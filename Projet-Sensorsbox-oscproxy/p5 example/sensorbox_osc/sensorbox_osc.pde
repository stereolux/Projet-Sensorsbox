//Receiver
import oscP5.*;
import netP5.*;

OscP5 oscP5;


float receivedValue;

void setup() {
  size(400, 400);
  frameRate(25);

  receivedValue =0;

  oscP5 = new OscP5(this, 3333);
}

void draw() {
  background(receivedValue);
}


void oscEvent(OscMessage theOscMessage) {
  
  //println(theOscMessage);
  if (theOscMessage.checkAddrPattern("/53ad73ed6836680200ca245e/53ad74156836680200ca245f")==true) {  
    float firstValue = theOscMessage.get(1).floatValue();  
    receivedValue = map(firstValue,0,1000,0,255);
    //println(firstValue);
  }
}

