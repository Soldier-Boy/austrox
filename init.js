var app_lang = 'de';

$(function(){
	var map = initMap();
	var baseLayers = getBaseLayers();
	var overlays = getOverlays();
	addLayers(map,baseLayers,overlays);	
	addControls(map,baseLayers,overlays);
	//changeLayer(overlays,name,status);
	var title = 'emergency';
	var showTags = ['fire_hydrant:type','fire_hydrant:diameter','fire_hydrant:pressure','fire_hydrant:position','fire_hydrant:count','fire_hydrant:reservoir'];
	getJson(map,overlays.Hydranten,'emergency=fire_hydrant',title,showTags);
	map.on('moveend',function(){getJson(map,overlays.Hydranten,'emergency=fire_hydrant',title,showTags)});
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
	var polygon = new L.Polygon([new L.LatLng(47.89,16.10),new L.LatLng(47.95,16.12),new L.LatLng(47.87,16.12),new L.LatLng(47.87,16.18),new L.LatLng(47.85,16.18),new L.LatLng(47.87,16.10),new L.LatLng(47.89,16.10)]);
	var marker = new L.Marker(polygon.getCenter());
	var hydranten = new L.LayerGroup();
	
	return {
		"Marker": marker,
		"Polygon": polygon,
		"Hydranten": hydranten
	};
}

function addLayers(map,baseLayers,overlays){
	map.addLayer(baseLayers.AustroX);
	
	map.addLayer(overlays.Hydranten);
	map.addLayer(overlays.Polygon);//delete
	map.addLayer(overlays.Marker);//delete
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