
var fs = require('fs');

function loadData(input,output,processData){
	fs.readFile(__dirname+'/../rawData/'+input+'.txt', {encoding: 'utf-8'}, function (err, data) {
		if (err) throw err;

		var list = processData(data),
			filename = output+'.json';
		
		fs.writeFile(__dirname+'/../jsonData/'+filename, JSON.stringify(list), function (err) {
			if (err) throw err;
			console.log(filename+' saved!');
		});

	});
}

loadData('US/US','locationNames',function(data){
	return Object.keys(data.split(/\n/).map(function(line){
		return line.split(/\t/)[2];
	}).reduce(function(prev,current){
		if(current != undefined){
			prev[current] = true;
		}
		return prev;
	},{}));
});

function loadCensusData(type){
	loadData('names_'+type,type+"Names",function(data){
		return data.split(/\n/).map(function(line){
			var name = line.split(/\s+/)[0];
			return name[0] + name.slice(1).toLowerCase();
		})
	});
}
loadCensusData('male');
loadCensusData('female');
loadCensusData('last');

loadData('nounlist','nouns',function(data){
	return data.split(/\n/);
});
