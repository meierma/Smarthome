import React from 'react';
import ChartistGraph from 'react-chartist';

class Line extends React.Component {

    render() {
        let simpleLineChartData = {
            labels: this.props.data.labels,
            series: [this.props.data.data]
        };

        let type = 'Line';
        let options = {
            showPoint: false,
        };

        return (
            <div>
                <h2>{this.props.headline}</h2>
                <ChartistGraph data={simpleLineChartData} options={options} type={type}/>
            </div>
        )
    }
}


export default Line;
