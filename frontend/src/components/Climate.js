import React, {Component} from 'react';
import '../css/select.css';
import '../css/chart.css';
import Line from './climate/Line.js';

import axios from 'axios';

const URL = "/php/ClimateApiNEW.php";

class Climate extends Component {
    constructor(props) {
        super(props);

        this.sensorChanged = this.sensorChanged.bind(this);

        this.state = {
            sensorData: [],
            climateDataNow: [],
            climateData: [],
            currentSensor: "Wohnzimmer",
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
        const humidity = this.state.climateData.map((entry) => entry.Humidity);
        const temperature = this.state.climateData.map((entry) => entry.Temperature);
        const rows = this.state.climateDataNow.map((entry) =>
            <tr>
                <td>{entry.SensorName}</td><td>{entry.Temperature}</td><td>{entry.Humidity}</td>
            </tr>
        );

        return (
            <div className="climate">

                <table className="climateTable">
                    <tr>
                        <th>Sensor</th><th>Temperature</th><th>Humidity</th>
                    </tr>
                    {rows}
                </table>
                {/*<div className="chart-pie flex-container">*/}
                {/*<Pie climateValue={this.state.climateDataNow.Temperature}/>*/}
                {/*<Pie climateValue={this.state.climateDataNow.Humidity}/>*/}
                {/*</div>*/}
                <h2>Select Sensor</h2>
                <select id="sensorDropdown" onChange={this.sensorChanged} value={this.state.currentSensor}>
                    {this.state.sensorData.map(sensor =>
                        <option value={sensor.SensorName}>{sensor.SensorName}</option>)}
                </select>
                <Line data={{labels: labels, data: temperature}} headline="Temperatur"/>
                <Line data={{labels: labels, data: humidity}} headline="Luftfeuchtigkeit"/>

            </div>
        );
    }
}

export default Climate;
