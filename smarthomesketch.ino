//SMARTHOME
#include <WiFiS3.h>  //library for the arduino to connect to wifi
#include <Arduino_JSON.h> // JSON parsing library

//variables for wifi
const char* ssid = ""; //SSID of your WiFi
const char* password = ""; //WiFi Password
const char* server = ""; //change to your IP address
WiFiClient client;  ///declares the arduino as a network client

// Initialize pins
const int LED1 = 3;
const int LED2 = 5;
const int LED3 = 6;
const int LED4 = 10;
const int LED5 = 11;

int led1Value = 0;
int led2Value = 0;
int led3Value = 0;
int led4Value = 0;
int led5Value = 0;

const int enablePin = 9;
const int in1Pin = 7;
const int in2Pin = 8;

// Variable states
int led1On = 0;  // Initially OFF
int led2On = 0;  // Initially OFF
int led3On = 0;  // Initially OFF
int led4On = 0;  // Initially OFF
int led5On = 0;  // Initially OFF
int motorOn = 0; // Initially OFF
int motorSpeed = 0;   // Initially 0


void setup() {
  Serial.begin(9600);

  // Connecting to WiFi
  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password); //connect to wifi

  //while connection is not established, count to 20
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print("Still trying to connect.. Attempt: ");
    Serial.println(attempts);
    attempts++;
  }

  //if counting is over, (either it has connected or failed)
  //if connected
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConnected to Wifi");
  } else {
    //if it failed to connect
    Serial.println("\nFailed to connect to WiFi");
    Serial.println("\n Please reset or troubleshoot.");
  }

  // Set pin modes for LEDs
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
  pinMode(LED4, OUTPUT);
  pinMode(LED5, OUTPUT);

  // Setup motor pins
  pinMode(enablePin, OUTPUT);
  pinMode(in1Pin, OUTPUT);
  pinMode(in2Pin, OUTPUT);

  // Initially turn off motor
  digitalWrite(enablePin, LOW);
  digitalWrite(in1Pin, LOW);
  digitalWrite(in2Pin, LOW);

  Serial.println("WELCOME TO MY SMARTFREN..!");
}

void loop() {
  // ===============================
  // Backend communication
  // ===============================
  if (client.connect(server, 80)) {
    Serial.print("Connection to server: ");
    Serial.println(server);
    Serial.println("Connection established successfully");
    Serial.println("Fetching data..");

    //connect to the php file
    client.println("GET /ArduinoStuff/SmartHomeTest/api.php HTTP/1.1"); //change this with your own directory path on htdocs
    client.print("Host: "); client.println(server);
    client.println("Connection: close");
    client.println();

    String response = "";  // response string
    unsigned long startTime = millis();

    //while there's still unread data that has already arrived at Arduino
    //OR the connection hasn't closed yet, there's a 3 sec timeout
    while ((client.connected() || client.available()) && millis() - startTime < 3000) {
      if (client.available()) {
        response += (char)client.read(); //read and append it
      }
    }
    client.stop(); //stop connection if server is done responding

    // Parse JSON (strip HTTP headers first)
    int jsonIndex = response.indexOf("{"); //index of curly brace (start of JSON)
    if (jsonIndex >= 0) { //if it exists (if server response has JSON)
      Serial.println("==Backend Responded==");
      String jsonPayload = response.substring(jsonIndex); // removing headers
      JSONVar data = JSON.parse(jsonPayload); // converts them into Arduino-readable code
      Serial.println(jsonPayload);

      //if Arduino can't read the data, it's returned as undefined
      if (JSON.typeof(data) != "undefined") { //if data isn't undefined
        // Update local variables from backend
        led1On = constrain((int)data["led1"], 0, 1);
        led2On = constrain((int)data["led2"], 0, 1);
        led3On = constrain((int)data["led3"], 0, 1);
        led4On = constrain((int)data["led4"], 0, 1);
        led5On = constrain((int)data["led5"], 0, 1);

        led1Value = constrain((int)data["led1_value"], 0, 4);
        led2Value = constrain((int)data["led2_value"], 0, 4);
        led3Value = constrain((int)data["led3_value"], 0, 4);
        led4Value = constrain((int)data["led4_value"], 0, 4);
        led5Value = constrain((int)data["led5_value"], 0, 4);

        motorOn = constrain((int)data["dcMotor"], 0, 1);
        motorSpeed = (int)data["dcMotor_speed"];

        Serial.print("LED1: "); Serial.println(led1On);
      }
    }
  } else {
    Serial.println("Connection to database failed"); //if Arduino couldn't connect, output this
  }

  // ===============================
  // Update LEDs
  // ===============================
  int brightnessTable[] = {0, 20, 90, 170, 255};

  analogWrite(LED1, led1On ? brightnessTable[led1Value] : 0);
  analogWrite(LED2, led2On ? brightnessTable[led2Value] : 0);
  analogWrite(LED3, led3On ? brightnessTable[led3Value] : 0);
  analogWrite(LED4, led4On ? brightnessTable[led4Value] : 0);
  analogWrite(LED5, led5On ? brightnessTable[led5Value] : 0);

  // ===============================
  // Update motor
  // ===============================
  if (motorOn) {
    digitalWrite(in1Pin, HIGH);
    digitalWrite(in2Pin, LOW);


    motorSpeed = constrain(motorSpeed, 0, 3);
    int scaledSpeed = map(motorSpeed, 0, 3, 0, 255);

    analogWrite(enablePin, scaledSpeed);
  } else {
    digitalWrite(in1Pin, LOW);
    digitalWrite(in2Pin, LOW);
    analogWrite(enablePin, 0);
  }

  delay(1000);
}
