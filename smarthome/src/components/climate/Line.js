import React from 'react';
import ChartistGraph from 'react-chartist';

class Line extends React.Component {

    render() {
        let simpleLineChartData = {
            labels: this.props.data.labels,
            series: [this.props.data.data]
        };

        let type = 'Line';

        return (
            <div>
                <h2>{this.props.headline}</h2>
                <ChartistGraph data={simpleLineChartData} type={type}/>
            </div>
        )
    }
}


export default Line;
