import React from 'react';
import ChartistGraph from 'react-chartist';

class Line extends React.Component {

  render() {



    var simpleLineChartData = {
      labels: this.props.data.labels,
      series: [this.props.data.data]
    };

    var type = 'Line';

    return (
      <div>
        <h2>{this.props.headline}</h2>
        <ChartistGraph data={simpleLineChartData} type={type} />
      </div>
    )
  }
}


export default Line;
