import React, { Component } from 'react';
import '../css/select.css';
import '../css/chart.css';
import Pie from './Pie.js';
import Line from './Line.js';

import axios from 'axios'

const URL = "http://192.168.0.152/php/Temperature.php"

class Climate extends Component {
  constructor(){
    super();
    this.state = {
      sensorData: [],
    }
  }

  componentDidMount() {
    var promiseGetSensors = axios.get(URL,{
      params: {
        Call: 'getSensors',
      }
    });

    var sensorData;
    promiseGetSensors.then((response)=>{
          sensorData = response.data;
        }).catch((error) =>{
        alert(error)
      });

      var promiseHistoryTemp = axios.get(URL,{
        params: {
          Call: 'getHistoryTempHum',
          range: 'now',
          TSensor_ID: sensorData[0].TSensor_ID
        }
      });

      promiseHistoryTemp.then((response)=>{
              this.setState(()=>{
                 return {
                   sensorData: sensorData,
                   climateData: response.data
                 }
              })
          }).catch((error) =>{
          alert(error)
        });
  }

  render() {
    return (
      <div className="climate">
          <label htmlFor="sensorDropdown">Select Sensor</label>
          <select id="sensorDropdown">
            {this.state.sensorData.map(sensor => <option key={sensor.TSensor_Name}>{sensor.TSensor_Name}</option>)}
          </select>
        <div className="chart-pie flex-container">
          <Pie/>
          <Pie/>
        </div>

        <Line/>

      </div>
    );
  }
}

export default Climate;
