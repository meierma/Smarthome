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
      showArea: true,
    };

    let thresholdOptions = {
      thresholds: [65, 60, 50, 45],
      maskPadding: 10,
      prefix: 'ct-threshold-',
      classNames: {
        aboveThreshold: 'above',
        prefixThreshold: 'area-',
        belowThreshold: 'below'
      },
      maskNames: {
        aboveThreshold: 'mask-above',
        prefixThreshold: 'mask-area-',
        belowThreshold: 'mask-below'
      }
    };

    let listener = {
      draw: e => this.drawListener(e, thresholdOptions),
      created: e => this.createdListener(e, thresholdOptions)
    }

    let graph;
    if (this.props.showThresholds) {
      graph = <ChartistGraph data={simpleLineChartData} options={options} type={type} listener={listener} />;
    }
    else {
      graph = <ChartistGraph data={simpleLineChartData} options={options} type={type} />;
    }

    return (
      <div>
        <h2>{this.props.headline}</h2>
        {graph}
      </div>
    )
  };

  drawListener(data, options) {
    if (data.type === 'point') {
      // For points we can just use the data value and compare against the threshold in order to determine
      // the appropriate class

      if (data.value.y >= options.thresholds[0]) {
        data.element.addClass(options.prefix + options.classNames.aboveThreshold);
      } else if (data.value.y < options.thresholds[options.thresholds.length - 1]) {
        data.element.addClass(options.prefix + options.classNames.belowThreshold);
        // Multiple thresholds
      } else {
        for (var i = 1; i <= options.thresholds.length - 1; ++i) {
          // if value is larger that threshold we are done
          if (data.value.y >= options.thresholds[i]) {
            data.element.addClass(options.prefix + options.classNames.prefixThreshold + (i - 1));
            break;
          }
        }
      }
    } else if (data.type === 'line' || data.type === 'bar' || data.type === 'area') {
      // Cloning the original line path, mask it with the upper mask rect above the threshold and add the
      // class for above threshold
      data.element
        .parent()
        .elem(data.element._node.cloneNode(true))
        .attr({
          mask: 'url(#' + options.prefix + options.maskNames.aboveThreshold + ')'
        })
        .addClass(options.prefix + options.classNames.aboveThreshold);

      // Add class for other thresholds
      for (var j = 1; j <= options.thresholds.length - 1; ++j) {
        data.element
          .parent()
          .elem(data.element._node.cloneNode(true))
          .attr({
            mask: 'url(#' + options.prefix + options.maskNames.prefixThreshold + (j - 1) + ')'
          })
          .addClass(options.prefix + options.classNames.prefixThreshold + (j - 1));
      }

      // Use the original line path, mask it with the lower mask rect below the threshold and add the class
      // for blow threshold
      data.element
        .attr({
          mask: 'url(#' + options.prefix + options.maskNames.belowThreshold + ')'
        })
        .addClass(options.prefix + options.classNames.belowThreshold);
    }
  }

  createdListener(data, options) {
    // Select the defs element within the chart or create a new one
    var defs = data.svg.querySelector('defs') || data.svg.elem('defs');
    // Project the threshold value on the chart Y axis
    var thresholds = options.thresholds;
    // Convert threshold values to projected values
    function projectedThreshold(threshold) {
      return data.chartRect.height() - data.axisY.projectValue(threshold) + data.chartRect.y2;
    }

    var width = data.svg.width();
    var height = data.svg.height();

    var aboveThresholdValue = projectedThreshold(thresholds[0]);
    var belowThresholdValue = projectedThreshold(thresholds[thresholds.length - 1]);

    // Create mask for upper part above threshold
    defs
      .elem('mask', {
        x: 0,
        y: -1 * options.maskPadding,
        width: width,
        height: height + options.maskPadding,
        id: options.prefix + options.maskNames.aboveThreshold
      })
      .elem('rect', {
        x: 0,
        y: -1 * options.maskPadding,
        width: width,
        height: aboveThresholdValue + options.maskPadding > 0 ? aboveThresholdValue + options.maskPadding : 0,
        fill: 'white'
      });

    // Create mask for lower part below threshold
    defs
      .elem('mask', {
        x: 0,
        y: -1 * options.maskPadding,
        width: width,
        height: height + options.maskPadding,
        id: options.prefix + options.maskNames.belowThreshold
      })
      .elem('rect', {
        x: 0,
        y: belowThresholdValue,
        width: width,
        height: height - belowThresholdValue + options.maskPadding > 0 ? height - belowThresholdValue + options.maskPadding : 0,
        fill: 'white'
      });

    // Add all other thresholds
    for (var i = 1; i <= thresholds.length - 1; ++i) {
      var currThreshold = projectedThreshold(thresholds[i]);
      var prevThreshold = projectedThreshold(thresholds[i - 1]);

      defs
        .elem('mask', {
          x: 0,
          y: 0,
          width: width,
          height: height,
          id: options.prefix + options.maskNames.prefixThreshold + (i - 1)
        })
        .elem('rect', {
          x: 0,
          y: prevThreshold,
          width: width,
          height: currThreshold - prevThreshold > 0 ? currThreshold - prevThreshold : 0,
          fill: 'white'
        });
    }

    return defs;
  }
}


export default Line;
