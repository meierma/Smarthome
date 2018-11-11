import React, {Component} from 'react';
import '../css/select.css';
import '../css/chart.css';
import Pie from './climate/Pie.js';
import Line from './climate/Line.js';

import axios from 'axios';

const URL = "/php/ClimateApi.php";

class Climate extends Component {
    constructor(props) {
        super(props);

        this.sensorChanged = this.sensorChanged.bind(this);

        this.state = {
            sensorData: [],
            climateDataNow: [],
            climateData: [],
            currentSensor: '1',
        }
    }

    componentDidMount() {
        this.initClimateData();
    }

    initClimateData() {
        axios.get(URL, {
            params: {
                task: 'initClimateData',
            }
        }).then((response) => {
            this.setState({
                sensorData: response.data['sensorDataArr'],
                climateDataNow: response.data['climateDataNow'],
                climateData: response.data['climateDataDay'],
            });
        }).catch((error) => {
            alert(error);
        });
    }

    sensorChanged(event) {
        console.log("sensor changed:" + event.target.value);
        this.resetClimateData(event);
    }

    resetClimateData(event) {
        if (event.target.value !== this.state.currentSensor) {
            this.currentSensor = event.target.value;
            axios.get(URL, {
                params: {
                    task: 'resetClimateData',
                    sensorId: this.currentSensor,
                }
            }).then(response => {
                this.setState({
                    currentSensor: this.currentSensor,
                    climateDataNow: response.data['climateDataNow'],
                    climateData: response.data['climateDataDay'],
                });
            }).catch((error) => {
                alert(error);
            });
        }
    }

    render() {
        const labels = this.state.climateData.map((entry) => entry.Hour);
        const humidity = this.state.climateData.map((entry) => entry.Hum);
        const temperature = this.state.climateData.map((entry) => entry.Temp);

        return (
            <div className="climate">
                <h2>Select Sensor</h2>
                <select id="sensorDropdown" onChange={this.sensorChanged} value={this.state.currentSensor}>
                    {this.state.sensorData.map(sensor =>
                        <option value={sensor.TSensor_ID}>{sensor.TSensor_Name}</option>)}
                </select>
                <div className="chart-pie flex-container">
                    <Pie climateValue={this.state.climateDataNow.Temperature}/>
                    <Pie climateValue={this.state.climateDataNow.Humidity}/>
                </div>

                <Line data={{labels: labels, data: temperature}} headline="Temperatur"/>
                <Line data={{labels: labels, data: humidity}} headline="Luftfeuchtigkeit"/>

            </div>
        );
    }
}

export default Climate;
