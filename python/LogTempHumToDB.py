#!/usr/bin/python
# -*- coding: utf-8 -*-

# This Code ist written by Lukas A.
# Youtube Channel ITTV

import sys
import os
import json
import urllib2
import time
import socket
import Adafruit_DHT
from datetime import datetime

sensor = Adafruit_DHT.DHT22

# -----------------Conf--------------------------------------

BaseURL = 'http://192.168.0.152/php/ClimateApi.php'
APIKey = '1234567890QAYWSX'  # DO NOT ENTER HASH !


# -----------------------------------------------------------

def sendtoDB(SensorID, TempHum):
    try:

        # send Tempdata to API

        Webdata = urllib2.urlopen(BaseURL
                                  + '?task=addTempHumData&TSensor_ID='
                                  + str(SensorID) + '&Temperature='
                                  + str(TempHum[1]) + '&Humidity='
                                  + str(TempHum[0]), timeout=15).read()
    except urllib2.HTTPError, err:

    # Error handling urllib2

        if err.code == 404:
            Webdata = 'Page not found!'
        elif err.code == 403:
            Webdata = 'Access denied!'
        elif err.code == 110:
            Webdata = 'Connection timed out'
        else:
            Webdata = ('Something happened! Error code', err.code)
    except urllib2.URLError, err:
        Webdata = ('Some error happened:', err.reason)
    except socket.timeout, e:
        raise MyException('There was an error: %r' % e)

    # If request answers "ok" everything is written into Database

    if Webdata == 'OK':
        print 'Done.'
        return True
    else:
        print Webdata
        return False


# requst all sensors for this device from API

def getRegisteredTSensors():
    try:
        Devices = urllib2.urlopen(BaseURL + '?task=getRegTSensors',
                                  timeout=15).read()
        print Devices

    except urllib2.HTTPError, err:
        if err.code == 404:
            print 'Page not found!'
            Devices = None
        elif err.code == 403:
            print 'Access denied!'
            Devices = None
        else:
            print 'Something happened! Error code', err.code
            Devices = None
    except urllib2.URLError, err:
        print 'Something went wrong: ', err.reason
        Devices = None

    try:
        # parse json answer from API
        if Devices != None:
            SensorData = json.loads(Devices)
        else:
            print 'Devices are None'
    except ValueError, e:
        Devices = None

    # Check if data is valis

    if Devices != None or Devices == 'null' or Devices == '':

       # SensorData = json.loads(DeviceID)

        return SensorData
    else:
        return 'Error'


def readDHTSensor(GPIO):

    # reading DHT22 sensor using GPIO number vom MysQL/API

    DHTVal = Adafruit_DHT.read_retry(sensor, GPIO)
    time.sleep(3)
    DHTVal = Adafruit_DHT.read_retry(sensor, GPIO)
    return DHTVal


# reading DS18B20 Sensors using Path from DB/API. Normaly GPIO 4 will be used for this-

def readDSSensors(Path):
    try:

        # Read W1 file

        file = open('/sys/bus/w1/devices/' + Path + '/w1_slave')
        try:

        # more error handling

            filecontent = file.read()
        finally:
            file.close()
    except IOError:
        filecontent = None
    DSTemp = [0, 0]
    if filecontent != None:

        # Check if file does not exist or is not filled correctly. (Sensor is not connected correctly)

        if filecontent.split('\n')[1].split(' ')[0:8] != [
            '00',
            '00',
            '00',
            '00',
            '00',
            '00',
            '00',
            '00',
            ]:
            Data = filecontent.split('\n')[1].split(' ')[9]

            # Calculating Temp Value

            DSTemp[1] = float(Data[2:]) / 1000

            # set Humidity to -1, because DS18B20 sensor can only messure Temperature

            DSTemp[0] = -1
            return DSTemp
        else:
            return [None, None]
    else:
        return [None, None]


# Reading temperature and humidity data from webserver (JSON format). Testet with ESP8266 with connected DHT22 sensor

def readWebSensors(url):
    try:

            # Requst data from webserver (ESP8266) using link from API/DB

        Webdata = urllib2.urlopen(url, timeout=15).read()
    except urllib2.HTTPError, err:

            # mutch more error handling

        if err.code == 404:
            print 'Page not found!'
            Webdata = None
        elif err.code == 403:
            print 'Access denied!'
            Webdata = None
        elif err.code == 110:
            print 'Connection timed out'
            Webdata = None
        else:
            print 'Something happened! Error code', err.code
            Webdata = None
    except urllib2.URLError, err:
        print 'Some other error happened:', err.reason
        Webdata = None
    except socket.timeout, e:
        Webdata = None
        raise MyException('There was an error: %r' % e)
    if Webdata != None:
        try:

                # encode json - It should look like this: [{"Temperature":23.3,"Humidity":51.2}]

            Webdata = json.loads(Webdata)
        except ValueError, e:

                # Json error handling

            Webdata = None
    if Webdata != None:
        SensorData = [0, 0]
        for element in Webdata:

                # finding Temperature and Humidity values in json - please change this, if you're using a json array with more the one "Temerature" and "Humidity" value

            SensorData[0] = element['Humidity']
            SensorData[1] = element['Temperature']
        return SensorData
    else:
        return [None, None]


# Formating console output an verify temperature and humidity data

def getTempHum(SensorElement):

    # Is a retry needed ?

    valid = False

    # How many retrys

    trys = 1

    # Creating list for sensordata

    TempHum = [0, 0]
    while valid == False:

        # Read DHT Sensor

        if SensorElement['Sensor'] == 'DHT22':
            print 'Read DHT Sensor: ' + str(SensorElement['TSensor_Name'])
            TempHum = readDHTSensor(SensorElement['GPIO'])
        elif SensorElement['Sensor'] == 'DS18B20':

        # Read DS18B20 sensor

            print 'Read DS18B20: ' + str(SensorElement['TSensor_Name'])
            TempHum = readDSSensors(SensorElement['SPath'])
        elif element['Sensor'] == 'Web':

        # Read Web Json Sensor

            print 'Read Web Sensor: ' + str(SensorElement['TSensor_Name'])
            TempHum = readWebSensors(SensorElement['SPath'])
        else:

            # Handle unknown sensors / wrong DB entrys

            print 'UNKNOWN sensor ! Please remove'

        # verify temperature and humidity values (Output is sometimes not correct, mostly to high)

        if TempHum[1] > 80 or TempHum[0] > 100 or TempHum[0] == None:
            valid = False
            print 'Values not valid'
        else:
            valid = True

        # retry handling if the sensor not available or the values are not correct

        if TempHum[0] == None and TempHum[1] == None and trys == 1:
            print 'Sensor not readable'
            print str(trys) + ' retry'
            valid = False
            trys = trys - 1
        elif TempHum[0] == None and TempHum[1] == None and trys == 0:

        # ignoriing sensor after retrys

            print 'Sensor not readable, will be ignored'
            return None
        else:
            if valid == True:
                return TempHum
            else:
                return None


# Programm Start

if __name__ == '__main__':
    try:
        Sensors = getRegisteredTSensors()

        # Check sensors availability

        if Sensors != 'Error' and Sensors != None:

            # reading sensors from requested data

            for element in Sensors:
                SensorData = getTempHum(element)
                if SensorData != None:
                    sendtoDB(element['TSensor_ID'], SensorData)
        else:
            print 'No Sensors'
            sys.exit(0)
    except (KeyboardInterrupt, SystemExit):

        # quit python script

        print 'Killed'
        sys.exit(0)
