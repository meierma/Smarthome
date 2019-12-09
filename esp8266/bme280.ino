#include <Wire.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

HTTPClient sender;
Adafruit_BME280 bme; // I2C

unsigned long deepSleepTime = 600; // in seconds

String sensorName = "Wohnzimmer";
const char* ssid     = "SSID";    
const char* password = "PASSWORD";
String url = "http://raspberrypi3b/php/ClimateApiNEW.php?task=addClimateData";

void setup() {
    Serial.begin(9600);    
    if (!bme.begin(0x76)) {
        Serial.println("Could not find a valid BME280 sensor, check wiring, address, sensor ID!");
        while (1);
    }
  connectWiFi();

  String backendUrl = url+"&SensorName="+sensorName+"&Temperature="+bme.readTemperature()+"&Humidity="+bme.readHumidity();
  Serial.println(backendUrl);
  sender.begin(backendUrl);
  sender.GET();

  ESP.deepSleep(deepSleepTime * 1000000);
}

void connectWiFi(){
  WiFi.begin(ssid, password);

  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() { 
}
