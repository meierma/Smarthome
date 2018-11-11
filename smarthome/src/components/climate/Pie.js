import React from 'react';
import ChartistGraph from 'react-chartist';
import ChartistFillDonut from 'chartist-plugin-fill-donut';

class Pie extends React.Component {

    render() {
        let value = parseFloat(this.props.climateValue);
        let data = {
            series: [value, 100 - value],
        };

        let options = {
            donut: true,
            donutWidth: 40,
            donutSolid: true,
            startAngle: 270,
            total: 200,
            showLabel: true,
        };

        let type = 'Pie';
        return (
            <div>
                <ChartistGraph data={data} options={options} type={type}>
                    <ChartistFillDonut/>
                </ChartistGraph>
            </div>
        );
    }
}


export default Pie;
