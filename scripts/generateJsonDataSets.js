var fs = require('fs');


function dev(){
	var words = ["Blacksville","Core","Dellslow","Everettville","Maidsville","Pentress","Pursglove","Wadestown","Wana","Ballard","Bozoo","Gap Mills","Glace","Lindside","Peterstown","Sarton","Secondcreek","Sinks Grove","Waiteville","Wolfcreek","Berkeley Springs","Great Cacapon","Birch River","Belva","Canvas","Drennen","Keslers Cross Lanes","Leivasy","Mount Lookout","Mount Nebo","Nettie","Poe","Pool","Swiss","Triadelphia","Valley Grove","Fort Seybert","Lost River","Upper Tract","Seneca Rocks","Onego","Arbovale","Cass","Dunmore","Green Bank","Marlinton","Snowshoe","Durbin","Slatyfork","Alvy","Rowlesburg","Albright","Arthurdale","Bretz","Bruceton Mills","Kingwood","Eglon","Terra Alta","Horse Shoe Run","Eleanor","Fraziers Bottom","Pliny","Poca","Robertsburg","Scott Depot","Teays","Ameagle","Artie","Montcoal","Naoma","Sundial","Beckley","Bolt","Cool Ridge","Daniels"];
	//var words = ["Everettville","Daniels"];
	var dataSet = getDataSetForWordList(words);
	
	for(var i= 0; i < 10; i++){
		console.log(getRandomWordFromDataSet(dataSet));
	}
}

function main(){
	[
		'maleNames',
		'femaleNames',
		'lastNames',
		'locationNames',
		'nouns'
	].forEach(loadData);
}


function loadData(type,processData){
	fs.readFile(__dirname+'/../jsonData/'+type+'.json', {encoding: 'utf-8'}, function (err, data) {
		if (err) throw err;

		var dataSet = getDataSetForWordList(JSON.parse(data)),
			filename = type+'DataSet.json';
		
		fs.writeFile(__dirname+'/../jsonData/'+filename, JSON.stringify(dataSet), function (err) {
			if (err) throw err;
			console.log(filename+' saved!');
		});

	});
}

function getDataSetForWordList(list){
	var dataSet = {};
	list.forEach(function(word){
		addWordToDataSet(word,dataSet);
	});
	
	dataSet.structure = countToLimit(dataSet.structure);
	dataSet.startVow = countToLimit(dataSet.startVow);
	dataSet.startCon = countToLimit(dataSet.startCon);
	
	[
		'midVow',
		'midCon',
		'endVow',
		'endCon'
	].forEach(function(type){
		Object.keys(dataSet[type]).forEach(function(chunk){
			dataSet[type][chunk] = countToLimit(dataSet[type][chunk]);
		});
	});
	
	return dataSet;
}


function addWordToDataSet(word,dataSet){
	if(word.match(/\s/)){
		return;
	}
	var chunks = word.split(/([aeiou]+)/ig).filter(function(value){return value}),
		structure = chunks.map(function(chunk){
			return chunk.match(/[aeiou]/i) ? 'v' : 'c';
		}).reduce(function(a,b){
			return a + b;
		}),
		firstChunk = chunks[0],
		lastChunk = chunks[chunks.length-1],
		secondToLastChunk = chunks[chunks.length-2];
		
	// add structure to dataSet
	increment(dataSet,'structure',structure);
	
	// add starting chunk to dataSet
	increment(dataSet,firstChunk.match(/[aeiou]/i) ? 'startVow' : 'startCon', firstChunk);
	
	// add mid chunks to dataSet
	for(var i = 1; i < chunks.length -1; i++){
		var chunk = chunks[i],
			prev = chunks[i-1],
			type = chunk[0].match(/[aeiou]/i) ? 'midVow' : 'midCon';
			
			increment(dataSet,type,prev,chunk);
	}
	
	// add ending chunk to dataSet
	increment(dataSet,lastChunk.match(/[aeiou]/i) ? 'endVow' : 'endCon', secondToLastChunk, lastChunk);
};

function increment(){
	var base = arguments[0],
		final = arguments[arguments.length-1];
	
	for(var i = 1; i < arguments.length-1; i++){
		var arg = arguments[i];
		if(!base[arg]) base[arg] = {};
		base = base[arg];
	}
	if(!base[final])base[final] = 0;
	base[final]++;
}

function countToLimit(counts){
	
	var limits = [],
		keys = Object.keys(counts),
		total = keys.reduce(function(prev,cur){
			return prev + counts[cur];
		},0),
		limit = 0;
	
	keys.forEach(function(key){
		limit += counts[key] / total;
		limits.push([key,limit]);
	});
	return limits;
}

function getRandomWordFromDataSet(dataSet){
	for(var i = 0; i < 10; i++){
		try {
			var structure = getRandomFromLimitList(dataSet.structure).split(''),
				startType = structure.shift() == 'v' ? 'startVow' : 'startCon',
				prevChunk = getRandomFromLimitList(dataSet[startType])
				word = prevChunk;
				
			while(structure.length > 1){
				var midType = structure.shift() == 'v' ? 'midVow' : 'midCon';
				prevChunk = getRandomFromLimitList(dataSet[midType][prevChunk]);
				word += prevChunk;
			}
			
			var endType = structure.shift() == 'v' ? 'endVow' : 'endCon';
			word += getRandomFromLimitList(dataSet[endType][prevChunk]);
			
			return word;
		} catch(err){
			if(!(err instanceof FailError))
				throw err;
		}
	}
}

function getRandomFromLimitList(list){
	if(!list){
		throw new FailError();
	}
	var rand = Math.random();
	for( var i = 0; i < list.length; i++){
		if(list[i][1] > rand){
			return list[i][0];
		}
	}
}


function FailError(){};

FailError.prototype = Object.create(Error.prototype);


main();
