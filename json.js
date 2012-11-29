function getjson(){
	var overpass_url = 'http://overpass.osm.rambler.ru/cgi/interpreter?data=';
	var overpass_query = overpass_url + '[out:json];node[name](' + map.getBounds().toOverpassBBoxString() + ');out%20body;';
	
	var poiInfo = function(tags){
		var r = $('<table>');
		for (key in tags)
		r.append($('<tr>').append($('<th>').text(key)).append($('<td>').text(tags[key])));
		return $('<div>').append(r).html();
	}
	
	$.getJSON(poiUrl, function(data){
		$.each(data.elements, function(ign, i){
		if (i.id in ids) return;
		ids[i.id] = true;
		L.marker([i.lat, i.lon], {
		icon: restaurantIcon,
		title: i.tags.name
		}).bindPopup(poiInfo(i.tags)).addTo(map);
		});
	});
}

L.LatLngBounds.prototype.toOverpassBBoxString = function(){
	var sw = this._southWest;
	var ne = this._northEast;
	return [sw.lat, sw.lng, ne.lat, ne.lng].join(',');
}