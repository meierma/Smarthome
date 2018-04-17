import React from 'react';
import ChartistGraph from 'react-chartist';

class Line extends React.Component {
  render() {

    var simpleLineChartData = {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      series: [
        [12, 9, 7, 8, 5],
        [2, 1, 3.5, 7, 3],
        [1, 3, 4, 5, 6]
      ]
    };

    var type = 'Line';

    return (
      <div>
        <ChartistGraph data={simpleLineChartData} type={type} />
      </div>
    )
  }
}


export default Line;
