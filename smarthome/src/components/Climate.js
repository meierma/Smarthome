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
    var promise = axios.get(URL,{
      params: {
        Call: 'getSensors',
      }
    });

    promise.then((response)=>{
            this.setState(()=>{
               return {
                 sensorData: response.data
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
