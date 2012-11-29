function init(){
	//init map
	var map = new L.Map('map',
	{
		center: [47.8934, 16.1055],
		zoom: 13,
		minZoom: 1,
		maxZoom: 18
	});
	
	//layers
	//layer-austrox
	var austrox = new L.TileLayer(
		'http://rfmtc.no-ip.org/osm/austrox/tiles/austrox/{z}/{x}/{y}.png',
		{ attribution: 'Map data © OpenStreetMap contributors - MapStyle AustroX (c) by Thomas Rupprecht' }
	).addTo(map);
	//layer-osm
	var osm = new L.TileLayer(
		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		{ attribution: 'Map data © OpenStreetMap contributors' }
	);
	
	var marker = L.marker([47.8934, 16.1055]).addTo(map);
	
	//base-layers
	var baseLayers = {
		"AustoX": austrox,
		"OpenStreetMap": osm
	};
	//overlays
	var overlays = {
		"Marker": marker
	};
	
	//layer-control
	L.control.layers(baseLayers, overlays).addTo(map);
	//geolocate-control
	L.control.locate().addTo(map);
}