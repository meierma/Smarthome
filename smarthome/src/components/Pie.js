import React from 'react';
import ChartistGraph from 'react-chartist';
import ChartistFillDonut from 'chartist-plugin-fill-donut';

class Pie extends React.Component {

  render() {
    var value = parseFloat(this.props.climateValue);
    var data = {
      series: [value,100-value],
    };

    var options = {
      donut: true,
      donutWidth: 40,
      donutSolid: true,
      startAngle: 270,
      total: 200,
      showLabel: true,
      fillClass: 'ct-fill-donut',
      label : {
        html: '<div class="ct-fill-donut-label"></div>',
      },
      items : [{
        class : '',
        id: '',
        content : 'fillText',
        position: 'center', //bottom, top, left, right
        offsetY: 0, //top, bottom in px
        offsetX: 0 //left, right in px
      }],
    };

    var type = 'Pie';
    return (
      <div>
        <ChartistGraph data={data} options={options} type={type} >
          <ChartistFillDonut/>
        </ChartistGraph>
      </div>
    );
  }
}


export default Pie;
