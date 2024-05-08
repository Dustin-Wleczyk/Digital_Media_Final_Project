#include <Arduino.h>

/*
 * This include defines the actual pin number for pins like IR_RECEIVE_PIN, IR_SEND_PIN for many different boards and architectures
 */
#include "PinDefinitionsAndMore.h"
#include <IRremote.hpp>
#define IR_RECEIVE_PIN 5

//#define DECODE_DENON        // Includes Sharp
//#define DECODE_JVC
//#define DECODE_KASEIKYO
//#define DECODE_PANASONIC    // alias for DECODE_KASEIKYO
//#define DECODE_LG
#define DECODE_NEC          // Includes Apple and Onkyo. To enable all protocols , just comment/disable this line.
//#define DECODE_SAMSUNG
//#define DECODE_SONY
//#define DECODE_RC5
//#define DECODE_RC6

//#define DECODE_BOSEWAVE
//#define DECODE_LEGO_PF
//#define DECODE_MAGIQUEST
//#define DECODE_WHYNTER
//#define DECODE_FAST

//#define DECODE_DISTANCE_WIDTH // Universal decoder for pulse distance width protocols
//#define DECODE_HASH         // special decoder for all protocols

//#define DECODE_BEO          // This protocol must always be enabled manually, i.e. it is NOT enabled if no protocol is defined. It prevents decoding of SONY!

//#define DEBUG               // Activate this for lots of lovely debug output from the decoders.

//#define RAW_BUFFER_LENGTH  180  // Default is 112 if DECODE_MAGIQUEST is enabled, otherwise 100.


const int recv_pin = 5; 
const int buzzerPin = 2; 
const int ledPinX = 11; 
const int ledPinC = 8; 

IRrecv irrecv(recv_pin);
decode_results results;

void setup() {
    Serial.begin(9600);
    IrReceiver.begin(IR_RECEIVE_PIN, ENABLE_LED_FEEDBACK); // Start the receiver
    pinMode(buzzerPin, OUTPUT);
    pinMode(ledPinX, OUTPUT); 
    pinMode(ledPinC, OUTPUT); 
}

void loop() {

    if (IrReceiver.decode()) {
        if (IrReceiver.decodedIRData.command == 0x16) {
            Serial.println("0");
            IrReceiver.resume();
        } else if (IrReceiver.decodedIRData.command == 0xC) {
            Serial.println("1");
            IrReceiver.resume();
        } else if (IrReceiver.decodedIRData.command == 0x18) {
            Serial.println("2");
            IrReceiver.resume();
        } else if (IrReceiver.decodedIRData.command == 0x5E) {
            Serial.println("3");
            IrReceiver.resume();
        } else if (IrReceiver.decodedIRData.command == 0x8) {
            Serial.println("4");
            IrReceiver.resume();
        } else if (IrReceiver.decodedIRData.command == 0x1C) {
            Serial.println("5");
            IrReceiver.resume();
        } else if (IrReceiver.decodedIRData.command == 0x5A) {
            Serial.println("6");
            IrReceiver.resume();
        } else if (IrReceiver.decodedIRData.command == 0x42) {
            Serial.println("7");
            IrReceiver.resume();
        } else if (IrReceiver.decodedIRData.command == 0x52) {
            Serial.println("8");
            IrReceiver.resume();
        } else if (IrReceiver.decodedIRData.command == 0x4A) {
            Serial.println("9");
            IrReceiver.resume();
        } else {
            IrReceiver.resume();

        }
    }

    if (Serial.available() > 0) {
        char serverCmd = Serial.read();

        switch(serverCmd) {
            case 'X':
                digitalWrite(ledPinX, HIGH); 
                tone(buzzerPin, 400, 500); 
                delay(500); 
                digitalWrite(ledPinX, LOW); 
                break;
            case 'C':
                digitalWrite(ledPinC, HIGH); 
                delay(500); 
                digitalWrite(ledPinC, LOW); 
                break;
            case 'R': // Reset command
                resetArduino(); // Call a function to reset the Arduino
                break;
            default:
                // Optionally handle unexpected characters
                // Serial.print("Received unexpected command: ");
                // Serial.println(serverCmd);
                break;
        }
    }
    delay(500);
}

void resetArduino() {
  Serial.flush();
  irrecv.enableIRIn();
}
