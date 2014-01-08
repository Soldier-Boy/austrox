var app_lang = 'de';

var map,baseLayers,overlays;

$(function(){
	map = initMap();
	baseLayers = getBaseLayers();
	//var overlays = getOverlays();
	addLayers();
	addControls();
});

function initMap(){
	var maxB = new L.LatLngBounds(new L.LatLng(47.84,15.87),new L.LatLng(47.98,16.28));
	var fitB = new L.LatLngBounds(new L.LatLng(47.87,16.00),new L.LatLng(47.96,16.16));
	
	return new L.Map('map',
	{
		minZoom: 10,
		maxZoom: 18,
		maxBounds: maxB
	}).fitBounds(
		fitB
	).locate({
		watch: true,
		setView: true,
		maxZoom: 17
	});
}

function getBaseLayers(){
	var austrox = new L.TileLayer(
		'http://rfmtc.no-ip.org/osm/austrox/tiles/{z}/{x}/{y}.png',
		{ attribution: 'Map data © OpenStreetMap contributors - MapStyle AustroX (c) by Thomas Rupprecht' }
	);
	
	var osm = new L.TileLayer(
		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		{ attribution: 'Map data © OpenStreetMap contributors' }
	);
	
	return {
		"AustroX": austrox,
		"OpenStreetMap": osm
	};
}

/*function getOverlays(){

	return {

	};
}*/

function addLayers(){
	map.addLayer(baseLayers.AustroX);
    //map.addLayer(baseLayers.OpenStreetMap);

    //map.addLayer(overlays.xxx);
}

function addControls(){
	map.addControl(new L.Control.Scale());
	map.addControl(new L.Control.Layers(baseLayers,overlays));
}