var map, ids = {};

function init(){
	//init map
	map = new L.Map('map',
	{
		minZoom: 10,
		maxZoom: 18,
		maxBounds: [[47.84,15.87],[47.98,16.28]]
	}).fitBounds(
		[[47.87,16.0],[47.96,16.16]]
	).locate({
		setView: true,
		maxZoom: 17
	});
	
	//layers
	//layer-austrox
	var austrox = new L.TileLayer(
		//'http://rfmtc.no-ip.org/osm/austrox/tiles/austrox/{z}/{x}/{y}.png',
		'http://192.168.0.100/osm/austrox/tiles/austrox/{z}/{x}/{y}.png',
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
	L.control.scale().addTo(map);
	
	getjson();
	map.on('moveend', getjson);
}