#!/usr/bin/python

import sys
import json
import urllib2
import Adafruit_DHT
import time

sensor = Adafruit_DHT.DHT22

BaseURL = 'http://192.168.0.152/php/ClimateApi.php'


def insert_climate_data_into_db(sensor_id, climate_data):
    response = send_request_to(BaseURL + '?task=addTempHumData&TSensor_ID=' + str(sensor_id)
                               + '&Temperature=' + str(climate_data[1]) + '&Humidity=' + str(climate_data[0]))
    if response == 'OK':
        return True
    else:
        return False


def get_registered_climate_sensors_from_db():
    climate_sensors_response = send_request_to(BaseURL + '?task=getRegTSensors')

    try:
        # parse json answer from API
        if climate_sensors_response is not None:
            climate_sensors = json.loads(climate_sensors_response)
        else:
            print 'climate_sensors_response are None'
    except ValueError, e:
        climate_sensors_response = None

    # Check if data is valid

    if climate_sensors_response is not None or climate_sensors_response == 'null' or climate_sensors_response == '':

        return climate_sensors
    else:
        return 'Error'


def send_request_to(url):
    try:
        response = urllib2.urlopen(url).read()

    except urllib2.HTTPError, err:
        if err.code == 404:
            print 'Page not found!'
            response = None
        elif err.code == 403:
            print 'Access denied!'
            response = None
        else:
            print 'Something happened! Error code', err.code
            response = None
    except urllib2.URLError, err:
        print 'Something went wrong: ', err.reason
        response = None
    return response


def read_climate_data_from_dht_sensor(GPIO):
    dht_climate_data = Adafruit_DHT.read_retry(sensor, GPIO)
    time.sleep(3)
    dht_climate_data = Adafruit_DHT.read_retry(sensor, GPIO)
    return dht_climate_data


def get_climate_data_from_db(SensorElement):
    valid = False
    trys = 1
    TEMPERATURE = 0
    HUMIDITY = 1

    climate_data = [0, 0]
    while not valid:

        # Read DHT Sensor

        if SensorElement['Sensor'] == 'DHT22':
            print 'Read DHT Sensor: ' + str(SensorElement['TSensor_Name'])
            climate_data = read_climate_data_from_dht_sensor(SensorElement['GPIO'])
        else:

            # Handle unknown sensors / wrong DB entrys

            print 'UNKNOWN sensor ! Please remove'

        # verify temperature and humidity values (Output is sometimes not correct, mostly to high)

        if climate_data[HUMIDITY] > 80 or climate_data[TEMPERATURE] > 100 or climate_data[TEMPERATURE] is None:
            valid = False
            print 'Values not valid'
        else:
            valid = True

        # retry handling if the sensor not available or the values are not correct

        if climate_data[TEMPERATURE] is None and climate_data[HUMIDITY] is None and trys == 1:
            print 'Sensor not readable'
            print str(trys) + ' retry'
            valid = False
            trys = trys - 1
        elif climate_data[TEMPERATURE] is None and climate_data[HUMIDITY] is None and trys == 0:

            print 'Sensor not readable, will be ignored'
            return None
        else:
            if valid:
                return climate_data
            else:
                return None


if __name__ == '__main__':
    try:
        Sensors = get_registered_climate_sensors_from_db()

        # Check sensors availability

        if Sensors != 'Error' and Sensors is not None:

            # reading sensors from requested data

            for element in Sensors:
                SensorData = get_climate_data_from_db(element)
                if SensorData is not None:
                    insert_climate_data_into_db(element['TSensor_ID'], SensorData)
        else:
            print 'No Sensors'
            sys.exit(0)
    except (KeyboardInterrupt, SystemExit):

        # quit python script

        print 'Killed'
        sys.exit(0)
