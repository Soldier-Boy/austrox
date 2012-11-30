function getjson(){
	var overpass_url = 'http://overpass.osm.rambler.ru/cgi/interpreter?data=';
	var overpass_query = overpass_url + '[out:json];node[name](' + map.getBounds().toOverpassBBoxString() + ');out%20body;';
	
	var restaurantIcon = L.icon({
		iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAAXVBMVEUAAAD///+KU1P///////////////9xQED///9fMjJ1QkL///+jbm7///////////////////+XXFz///9pOjr///94RUVfMjL///////////9kNTWdYmL///9bLS2eoyA3AAAAHnRSTlMATKY/JkhAyBLwxUqIKhE9AkSZLtk0v/IFBkHmkTPuNN4DAAAAaElEQVR4Xp3INxbDIAAE0V2RlINz3Psf0zR6DwxuPMUUHz+ydI4W9+N23olqGvFmDk/mZF/SF70vGcW4nBIaOqkb3DWhaZTGiUpopcQ1I1AiKmT6gmYWhD/o0QcP+BC/Ny+mBVoTX+0DgJ0JB2LUDeEAAAAASUVORK5CYII=',
		iconSize: new L.Point(18, 18),
		iconAnchor: new L.Point(9, 9),
		shadowSize: new L.Point(0, 0)
	});
	
	var poiInfo = function(tags){
		var r = $('<table>');
		for(key in tags){
			r.append($('<tr>').append($('<th>').text(key)).append($('<td>').text(tags[key])));
		}
		return $('<div>').append(r).html();
	}
	
	$.getJSON(
		poiUrl,
		function(data){
			$.each(
				data.elements,
				function(ign, i){
					if(i.id in ids) return;
					ids[i.id] = true;
					L.marker(
						[i.lat, i.lon],
						{
							icon: restaurantIcon,
							title: i.tags.name
						}
					).bindPopup(poiInfo(i.tags)).addTo(map);
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

var path_style = L.Path.prototype._updateStyle;
L.Path.prototype._updateStyle = function(){
	path_style.apply(this);
	for(k in this.options.svg){
		this._path.setAttribute(k, this.options.svg[k]);
	}
}

function parseOverpassJSON(overpassJSON, callbackNode, callbackWay, callbackRelation){
	var nodes = {}, ways = {};
	for(var i=0; i<overpassJSON.elements.length; i++){
		var p = overpassJSON.elements[i];
		switch(p.type){
			case 'node':
				p.coordinates = [p.lon, p.lat];
				p.geometry = {type: 'Point', coordinates: p.coordinates};
				nodes[p.id] = p;
				// p has type=node, id, lat, lon, tags={k:v}, coordinates=[lon,lat], geometry
				if(typeof callbackNode === 'function'){
					callbackNode(p);
				}
			break;
			case 'way':
				p.coordinates = p.nodes.map(function(id){
					return nodes[id].coordinates;
				});
				p.geometry = {type: 'LineString', coordinates: p.coordinates};
				ways[p.id] = p;
				// p has type=way, id, tags={k:v}, nodes=[id], coordinates=[[lon,lat]], geometry
				if(typeof callbackWay === 'function'){
					callbackWay(p);
				}
			break;
			case 'relation':
				p.members.map(function(mem){
					mem.obj = (mem.type == 'way' ? ways : nodes)[mem.ref];
				});
				// p has type=relaton, id, tags={k:v}, members=[{role, obj}]
				if(typeof callbackRelation === 'function'){
					callbackRelation(p);
				}
			break;
		}
	}
}