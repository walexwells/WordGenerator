

function FailError(){};

FailError.prototype = Object.create(Error.prototype);

Array.prototype.random = function(){
	return this[Math.floor(Math.random()*this.length)];
}

function DataStore(callback){
	var waiting =  0;
	
	function load(key){
		waiting++;
		var xhr = new XMLHttpRequest();
		xhr.open('GET','jsonData/'+key+'.json');
		xhr.addEventListener('loadend',function(){
			this[key] = JSON.parse(xhr.responseText);
			waiting--;
			if(!waiting){
				callback();
			}
		}.bind(this));
		xhr.send();
	}
		
	[
		'maleNames',
		'maleNamesDataSet',
		'femaleNames',
		'femaleNamesDataSet',
		'locationNames',
		'locationNamesDataSet',
		'lastNames',
		'lastNamesDataSet',
		'nouns',
		'nounsDataSet'
	].forEach(load.bind(this));
	
	this.getWord = function(type){
	
		var data = this[({
			'male':'maleNamesDataSet',
			'maleFull':'maleNamesDataSet',
			'female':'femaleNamesDataSet',
			'femaleFull':'femaleNamesDataSet',
			'last':'lastNamesDataSet',
			'location':'locationNamesDataSet',
			'noun':'nounsDataSet',
			'realMale':'maleNames',
			'realMaleFull':'maleNames',
			'realFemale':'femaleNames',
			'realFemaleFull':'femaleNames',
			'realLast':'lastNames',
			'realLocation':'locationNames',
			'realNoun':'nouns'
		}[type])];
		
		var word;
		
		if(Array.isArray(data)){
		
			word = data.random();
			
			if(type == "realMaleFull" || type == "realFemaleFull"){
				word += ' '+this.lastNames.random();
			}
		
		} else {
			
			word = getRandomWordFromDataSet(data);
			if(type == "maleFull" || type == "femaleFull"){
				word += ' '+getRandomWordFromDataSet(this.lastNamesDataSet);
			}
		}
		
		return word;
	};
	
	this.wordTypes = [
		'male',
		'maleFull',
		'female',
		'femaleFull',
		'last',
		'location',
		'noun',
		'realMale',
		'realMaleFull',
		'realFemale',
		'realFemaleFull',
		'realLast',
		'realLocation',
		'realNoun'
	];
};



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

function NameCard(name){
	this.visible = ko.observable(true);
	this.marked = ko.observable(false);
	this.name     = name;
}

NameCard.prototype.mark = function(){
	this.marked(!this.marked());
};
NameCard.prototype.reject = function(){
	if(!this.marked()){
		this.visible(false);
	}
};

function ViewModel(){
	
	this.words = ko.observableArray();
	
	this.next = function(){
		
		
		var words = this.words() || [];
		
		words = words.reduce(function(arr,value){
			if(value.marked()){
				arr.push(value);
			}
			return arr;
		},[]);
		
		var selectedTypes = dataStore.wordTypes.reduce(function(arr,type){
			if(this[type]()){
				arr.push(type);
			}
			return arr;
		}.bind(this),[]);
		
		if(selectedTypes.length){
			while(words.length < 30){
				var randType = selectedTypes[Math.floor(Math.random()*selectedTypes.length)];
				words.push(new NameCard(dataStore.getWord(randType)));
			}
		}
		
		this.words(words);
	}.bind(this);
	
	var dataStore = new DataStore(function(){
		
		this.next();
		
	}.bind(this));
	
	dataStore.wordTypes.forEach(function(type){
		this[type] = ko.observable(true);
	}.bind(this));
	
	

}
