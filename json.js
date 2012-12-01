function getJson(map,hydranten){
	var ids = {};
	
	//var overpass_url = 'http://overpass.osm.rambler.ru/cgi/interpreter?data=';
	var overpass_url = 'http://overpass-api.de/api/interpreter?data=';
	var overpass_query = overpass_url + '[out:json];node(' + map.getBounds().toOverpassBBoxString() + ')["emergency"="fire_hydrant"];out;';
	
	var restaurantIcon = new L.icon({
		iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAAXVBMVEUAAAD///+KU1P///////////////9xQED///9fMjJ1QkL///+jbm7///////////////////+XXFz///9pOjr///94RUVfMjL///////////9kNTWdYmL///9bLS2eoyA3AAAAHnRSTlMATKY/JkhAyBLwxUqIKhE9AkSZLtk0v/IFBkHmkTPuNN4DAAAAaElEQVR4Xp3INxbDIAAE0V2RlINz3Psf0zR6DwxuPMUUHz+ydI4W9+N23olqGvFmDk/mZF/SF70vGcW4nBIaOqkb3DWhaZTGiUpopcQ1I1AiKmT6gmYWhD/o0QcP+BC/Ny+mBVoTX+0DgJ0JB2LUDeEAAAAASUVORK5CYII=',
		iconSize: new L.Point(18,18),
		iconAnchor: new L.Point(9,9)
	});
	
	var poiInfo = function(tags){
		var r = $('<table>');
		for(key in tags){
			r.append($('<tr>').append($('<th>').text(key).css('text-align','left')).append($('<td>').text(tags[key])));
		}
		return $('<div>').append(r).html();
	}
	
	$.getJSON(
		overpass_query,
		function(data){
			$.each(
				data.elements,
				function(ign, i){
					if(i.id in ids) return;
					ids[i.id] = true;
					hydranten.addLayer(
						new L.marker(
							[i.lat, i.lon],
							{
								icon: restaurantIcon,
								title: i.tags.name
							}
						).bindPopup(poiInfo(i.tags))
					);
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