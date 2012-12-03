var app_lang = 'de';

$(function(){
	var map = initMap();
	var baseLayers = getBaseLayers();
	var overlays = getOverlays();
	addLayers(map,baseLayers,overlays);	
	addControls(map,baseLayers,overlays);
	//changeLayer(overlays,name,status);
	
	getJson(map,overlays.Hydranten,'amenity=fire_station');
	map.on('moveend',function(){getJson(map,overlays.Hydranten,'amenity=fire_station')});
});

function initMap(){
	var maxB = new L.LatLngBounds(new L.LatLng(47.84,15.87),new L.LatLng(47.98,16.28));
	var fitB = new L.LatLngBounds(new L.LatLng(47.87,16.00),new L.LatLng(47.96,16.16));
	
	return new L.Map('map',
	{
		minZoom: 10,
		maxZoom: 18,
		//maxBounds: maxB
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
		//'http://rfmtc.no-ip.org/osm/austrox/tiles/austrox/{z}/{x}/{y}.png',
		'http://192.168.0.100/osm/austrox/tiles/austrox/{z}/{x}/{y}.png',
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

function getOverlays(){
	var marker = new L.marker(new L.LatLng(47.8934,16.1055));
	var hydranten = new L.layerGroup();
	
	return {
		"Marker": marker,
		"Hydranten": hydranten
	};
}

function addLayers(map,baseLayers,overlays){
	map.addLayer(baseLayers.AustroX);
	
	map.addLayer(overlays.Hydranten);
}

function addControls(map,baseLayers,overlays){	
	map.addControl(new L.Control.Scale());
	map.addControl(new L.Control.Layers(baseLayers,overlays));
}

/*function changeLayer(overlays,name,status){
	if(status == true){
		overlays.addLayer(name);
	}else{
		overlays.removeLayer(name);
	}
}*/