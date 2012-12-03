function getJson(map,featureLayer,featureType,title,showTags){
	if(map.getZoom() < 12){
		return;
	}
	
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
							new L.Marker(
								new L.LatLng(i.lat,i.lon),
								{
									icon: featureIcon,
									title: i.tags.name
								}
							).bindPopup(getPopupContent(i.id,i.tags,title,showTags))
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

L.Polygon.prototype.getCenter = function(){
	var pts = this._latlngs;
	
	var twicearea = 0;
	var x = 0;
	var y = 0;
	var nPts = pts.length;
	var p1;
	var p2;
	var f;
	
	for(var i=0, j=nPts-1;i<nPts;j=i++) {
		p1=pts[i];
		p2=pts[j];
		twicearea+=p1.lat*p2.lng;
		twicearea-=p1.lng*p2.lat;
		
		f=p1.lat*p2.lng-p2.lat*p1.lng;
		
		x+=(p1.lat+p2.lat)*f;
		y+=(p1.lng+p2.lng)*f;
	}
	f=twicearea*3;
	return {lat: x/f,lng: y/f};
}

function getFeatureIcon(iconType,size){
	return new L.Icon({
		iconUrl: 'icons/' + iconType + '.png',
		iconSize: new L.Point(size,size),
		iconAnchor: new L.Point(size/2,size/2)
	});
}

function getPopupContent(id,tags,title,showTags){
	var headline = '';
	for(var key in tags){
		if(key == title){
			headline = $('<h2>').text(translate(app_lang,tags[key])).append(' - ').append($('<small>')).append($('<a>').attr({href: 'http://www.openstreetmap.org/browse/node/'+ id, target: '_blank'}).text('Browse'));
			break;
		}
	}
	var table = $('<table>');//.attr('border','1').css('border-collapse','collapse');
	for(var key in tags){
		for(var i=0;i<showTags.length;i++){
			if(showTags[i] == key){
				table.append($('<tr>').append($('<th>').text(translate(app_lang,key)).css('text-align','left')).append($('<td>').text(translate(app_lang,tags[key])).css('padding-left','8px')));
			}
		}
	}
	return $('<div>').append(headline).append(table).html();
}