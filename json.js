function getJson(map,featureLayer,featureType,title,showTags){
	var nodes = {};
	var ways = {};
	var relations = {};
	
	//featureLayer.clearLayers();
	
	if(map.getZoom() < 8){
		return;
	}
	
	var overpass_url = 'http://overpass.osm.rambler.ru/cgi/interpreter?data=';
	//var overpass_url = 'http://overpass-api.de/api/interpreter?data=';
	//var overpass_query = overpass_url + '[out:json];node(' + map.getBounds().toOverpassBBoxString() + ')[' + featureType + '];out;';
	//var overpass_query = overpass_url + '[out:json];(way(BBOX)TAGS;way(BBOX)TAGS;>;);out qt;'.replace(/(BBOX)/g, map.getBounds().toOverpassBBoxString()).replace(/TAGS/g, '[leisure=pitch][sport=soccer]');
	var overpass_query = overpass_url + '[out:json];(relationTAGS;relationTAGS;way(r);relationTAGS;>;);out qt;'.replace(/TAGS/g, '[type=multipolygon][admin_level=8][name="Gemeinde Hernstein"]');
	
	var featureIcon = getFeatureIcon('amenity=fire_station',16);
	
	$.getJSON(
		overpass_query,
		function(data, textStatus){
			alert(textStatus);
			$.each(
				data.elements,
				function(index,obj){
					switch(obj.type){
						case 'node':
							nodes[obj.id] = obj;
						break;
						case 'way':
							ways[obj.id] = obj;
						break;
						case 'relation':
							relations[obj.id] = obj;
						break;
						default:
							alert('ERROR');
					}
				}
			);
			getGeo(featureLayer,nodes,ways,relations);
		}
	);
	
	/*for(node in nodes){
		featureLayer.addLayer(
			new L.Marker(
				new L.LatLng(obj.lat,obj.lon),
				{
					icon: featureIcon,
					title: obj.tags.name
				}
			).bindPopup(getPopupContent(obj.id,obj.tags,title,showTags))
		);
	}*/
}

/*for(var wayId in ways){
			var way_nodes = [];
			for(var i=0;i<ways[wayId].nodes.length;i++){
				var nodeId = ways[wayId].nodes[i];
				way_nodes[i] = new L.LatLng(nodes[nodeId].lat,nodes[nodeId].lon);
			}
			//featureLayer.addLayer(new L.Polygon(way_nodes));
			featureLayer.addLayer(new L.Marker(new L.Polygon(way_nodes).getCenter()).bindPopup('Sportplatz'));
		}*/

function getGeo(featureLayer,nodes,ways,relations){
	var j = 0;
	for(var relId in relations){
		var rel_ways = relations[relId].members;
		var rel_nodes = [];
		var i = 0;
		var last_nodeId;
		var last_way_nodeId;
		for(var way in rel_ways){
			if(rel_ways[way].role == 'outer'){
				var wayId = rel_ways[way].ref;
				if(last_way_nodeId != ways[wayId].nodes[0] && i > 0){
					var way_nodes = ways[wayId].nodes.reverse();
				}else{
					var way_nodes = ways[wayId].nodes;
				}
				for(var node in way_nodes){
					var nodeId = way_nodes[node];
					var new_node = new L.LatLng(nodes[nodeId].lat,nodes[nodeId].lon);
					if(nodeId != last_nodeId){
						rel_nodes[i] = new_node;
						i++;
					}
					last_nodeId = nodeId;
				}
				last_way_nodeId = last_nodeId;
			}
		}
		var poly = new L.Polygon(rel_nodes).bindPopup(relations[relId].tags.name);
		featureLayer.addLayer(poly);
		featureLayer.addLayer(new L.Marker(poly.getCenter()).bindPopup(relations[relId].tags.name));
		j = j+i;
	}
	alert(j);
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