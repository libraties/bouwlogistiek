var React = require('react');
var L = require('leaflet');
var d3 = require('d3');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      tileUrl: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      subdomains: 'abcd'
    };
  },

  render: function() {
    return (
      <div id='map'>
      </div>
    );
  },

  componentDidMount: function() {
    this.map = L.map('map', {
      subdomains: this.state.subdomains,
      attribution: this.state.attribution
    });

    L.tileLayer(this.state.tileUrl).addTo(this.map);
    this.projectsLayer = L.geoJson(null, {
      onEachFeature: function (feature, layer) {
        layer.on({
          click: function() {
            this.props.setProject(feature, layer);
          }.bind(this)
        });
      }.bind(this)
    }).addTo(this.map);

    this.routesLayer = L.geoJson(null, {
      stroke: false,
      noClip: true
    }).addTo(this.map);

    this.map.setView([52.3728, 4.9002], 13);
    this.map.zoomControl.setPosition('topright');

    d3.json('data/projects.json', function(geojson) {
      this.projectsLayer.addData(geojson);
    }.bind(this));
  },

  animate: function(routes) {
    this.routesLayer.clearLayers();
    this.routesLayer.addData(routes);

    var path = d3.selectAll('#map .leaflet-zoom-animated path[stroke="none"]');

    path
      .attr("stroke-dasharray", function(d) {
        var totalLength = d3.select(this).node().getTotalLength();
        return totalLength + " " + totalLength;
      })
      .attr("stroke-dashoffset", function(d) {
        return d3.select(this).node().getTotalLength();
      })
      .attr('stroke', '#f4e60e')
      .attr('stroke-opacity', .8)
      .attr('stroke-width', 6)
      .transition()
        .duration(2000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);

  }

});
