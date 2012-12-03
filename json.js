function getJson(map,featureLayer,featureType){
	//var overpass_url = 'http://overpass.osm.rambler.ru/cgi/interpreter?data=';
	var overpass_url = 'http://overpass-api.de/api/interpreter?data=';
	var overpass_query = overpass_url + '[out:json];node(' + map.getBounds().toOverpassBBoxString() + ')[' + featureType + '];out;';
	
	var featureIcon = getFeatureIcon('amenity=fire_station',16);
	
	var ids = {};
	featureLayer.clearLayers();
	
	$.getJSON(
		overpass_query,
		function(data){
			$.each(
				data.elements,
				function(ign, i){
					if(i.id in ids){
						return;
					}else{
						ids[i.id] = true;
						featureLayer.addLayer(
							new L.marker(
								new L.LatLng(i.lat,i.lon),
								{
									icon: featureIcon,
									title: i.tags.name
								}
							).bindPopup(getPopupContent(i.tags,'amenity'))
						);
					}
				}
			);
		}
	);
}
	
L.LatLngBounds.prototype.toOverpassBBoxString = function(){
	var sw = this._southWest;
	var ne = this._northEast;
	return [sw.lat, sw.lng, ne.lat, ne.lng].join(',');
}

function getFeatureIcon(iconType,size){
	return new L.icon({
		iconUrl: 'icons/' + iconType + '.png',
		iconSize: new L.Point(size,size),
		iconAnchor: new L.Point(size/2,size/2)
	});
}

function getPopupContent(tags,hideTag){
	var title = '';
	if(tags.name){
		title = $('<h2>').text(tags.name);
	}
	var table = $('<table>');
	for(var key in tags){
		if(key != 'name' && key != hideTag){
			table.append($('<tr>').append($('<th>').text(translate(app_lang,key)).css('text-align','left')).append($('<td>').text(translate(app_lang,tags[key]))));
		}
	}
	return $('<div>').append(title).append(table).html();
}

function translate(lang,value){
	switch(value){
		case 'fire_hydrant:type':
			return 'Hydranten-Type:';
			break;
		case 'pillar':
			return 'Überflur';
			break;
		case 'emergency':
			return 'Notfall:';
			break;
		case 'fire_hydrant':
			return 'Hydrant';
			break;
		default:
			return value;
			break;
	}
}