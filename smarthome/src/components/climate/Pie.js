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

        let fillOptions = {
            items: [{
                content: '<i class="fa fa-tachometer"></i>',
                position: 'bottom',
                offsetY : 10,
                offsetX: -2
            }]
        };

        let type = 'Pie';
        return (
            <div>
                <ChartistGraph data={data} options={options} type={type}>
                    <ChartistFillDonut options={fillOptions}/>
                </ChartistGraph>
            </div>
        );
    }
}


export default Pie;
