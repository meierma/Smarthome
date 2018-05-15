import React, { Component } from 'react';
import '../css/select.css';
import '../css/chart.css';
import Pie from './Pie.js';
import Line from './Line.js';

import axios from 'axios'

const URL = "http://192.168.0.152/php/TemperatureNew.php"

class Climate extends Component {
  constructor(){
    super();

    this.sensorChanged = this.sensorChanged.bind(this);

    this.state = {
      sensorData: [],
      climateDataNow: [],
      climateData: [],
      chosenSensorId: 1,
    }
  }

  componentDidMount() {
    axios.get(URL,{
      params: {
        Call: 'initClimateData',
      }
    }).then((response)=>{
      this.setState({
        sensorData: response.data['sensorDataArr'],
        climateDataNow: response.data['climateDataNow'],
        climateData: response.data['climateDataDay'],
      });
    }).catch((error) =>{
      alert(error)
    });
  }

  sensorChanged(event){
    axios.get(URL,{
      params: {
        Call: 'reinitClimateData',
        sensorId: this.state.chosenSensorId,
      }
    }).then((response)=>{
      this.setState({
        climateDataNow: response.data['climateDataNow'],
        climateData: response.data['climateDataDay'],
      });
    }).catch((error) =>{
      alert(error)
    });
  }

  render() {
    const labels = this.state.climateData.map((entry) => entry.Hour);
    const humidity = this.state.climateData.map((entry) => entry.Hum);
    const temperature = this.state.climateData.map((entry) => entry.Temp);

    return (
      <div className="climate">
        <h2>Select Sensor</h2>
        <select id="sensorDropdown" onChange={this.sensorChanged} value={this.state.chosenSensorId}>
           {this.state.sensorData.map(sensor =>
             <option key={sensor.TSensor_Name} value={sensor.TSensor_ID}>
               {sensor.TSensor_Name}
             </option>)}
        </select>
        <div className="chart-pie flex-container">
          <Pie climateValue={this.state.climateDataNow.Temperature}/>
          <Pie climateValue={this.state.climateDataNow.Humidity}/>
        </div>

        <Line data={{labels:labels,data:temperature}} headline="Temperatur"/>
      <Line data={{labels:labels,data:humidity}} headline="Luftfeuchtigkeit"/>

      </div>
    );
  }
}

export default Climate;
