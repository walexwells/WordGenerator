


'use strict';
		
function Eventful(){}

Eventful.prototype = {
	addEventListener: function(event,listener){
		if(!this._eventListeners)this._eventListeners = {};
		if(!this._eventListeners[event])this._eventListeners[event] = []
		this._eventListeners[event].push(listener);
	},

	fireEvent: function(event,obj){
		if(this._eventListeners && this._eventListeners[event]){
			this._eventListeners[event].forEach(function(listener){
				listener(obj)
			});
		}
	},

	removeListener: function(event,listener){
		if(this._eventListeners && this._eventListeners[event]){
			var i = this._eventListeners[event].indexOf(listener);
			if(i != -1)this.this._eventListeners[event].splice(i,1);
		}
	},

	bubbleEvent: function(obj,event){
		obj.addEventListener(event,function(eventObj){
			this.fireEvent(event,eventObj);
		}.bind(this));
	},

	bubbleEvents: function(obj,events){
		events.forEach(function(event){
			this.bubbleEvent(obj,event);
		}.bind(this));
	}

}


function ViewModel(){
	this.names = ko.observableArray();
	this.characterGenerator = new CharacterGenerator();
	this.characterGenerator.onReady = function(){
		for(var i = 0; i < 50; i++){
			this.names.push(new NameCard(
				this.characterGenerator.getRandom()
			));
		}
	}.bind(this);
	this.maxAge = ko.observable(100);
	this.minAge = ko.observable(1);
	this.count = ko.observable(20);
}

function NameCard(cfg){
	this.visible = ko.observable(true);
	this.marked = ko.observable(false);
	this.name     = cfg.name;
	this.gender   = cfg.gender;
	this.age      = cfg.age;
	this.birthday = cfg.birthday;
	this.hair     = cfg.hair;
	this.eyes     = cfg.eyes;
	this.height   = cfg.height;
	this.weight   = cfg.weight;
}

NameCard.prototype.mark = function(){
	this.marked(!this.marked());
};
NameCard.prototype.reject = function(){
	if(!this.marked()){
		this.visible(false);
	}
};

Array.prototype.random = function(){
	return this[Math.floor(Math.random()*this.length)];
}
Array.prototype.weightedRandom = function(){
	var r = Math.random()*100;
	for(var i = 0; i < this.length; i++){
		r -= this[i].percent;
		if(r <= 0)return this[i];
	}
	return this.random();
}
Math.randInt = function(max,min){
	return Math.floor(Math.random()*(max-min+1))+min;
}


function CharacterGenerator(){
	this._ready = false;
	this._nameGenerator = new NameGenerator();
	this._nameGenerator.addEventListener('ready',function(){
		this.onReady();
	}.bind(this));
}

CharacterGenerator.prototype.getRandom = function(){
	var gender = this._randomGender(),
		age = this._randomAge();
	
	return {
		name: this._nameGenerator.random(gender),
		gender: gender,
		age: age,
		birthday: this._randomBirthday(),
		hair: this._randomHair(gender,age),
		eyes: this._randomEyeColor(),
		height: this._randomHeight(gender),
		weight: this._randomWeight(),
	};
};
CharacterGenerator.prototype.height = {
	Male: [
		{height: "4'10", percent: 0.00},
		{height: "4'11", percent: 0.00},
		{height: "5'", percent:  0.00},
		{height: "5'1", percent: 0.07},
		{height: "5'2", percent: 0.00},
		{height: "5'3", percent: 1.15},
		{height: "5'4", percent: 2.07},
		{height: "5'5", percent: 3.73},
		{height: "5'6", percent: 5.22},
		{height: "5'7", percent: 8.45},
		{height: "5'8", percent: 14.53},
		{height: "5'9", percent: 11.40},
		{height: "5'10", percent: 14.35},
		{height: "5'11", percent: 12.45},
		{height: "6'", percent: 8.92},
		{height: "6'1", percent: 8.58},
		{height: "6'2", percent: 4.20},
		{height: "6'3", percent: 2.93},
		{height: "6'4", percent: 1.30},
		{height: "6'5", percent: 0.38},
		{height: "6'6", percent: 0.17},
		{height: "6'7", percent: 0.10}
	],
	Female: [
		{height: "4'10", percent:1.00 },
		{height: "4'11", percent:2.62 },
		{height: "5'", percent:  4.67 },
		{height: "5'1", percent: 7.07 },
		{height: "5'2", percent: 8.63 },
		{height: "5'3", percent: 12.53},
		{height: "5'4", percent: 15.07},
		{height: "5'5", percent: 13.60},
		{height: "5'6", percent: 13.30},
		{height: "5'7", percent: 9.40 },
		{height: "5'8", percent: 6.10 },
		{height: "5'9", percent: 2.62 },
		{height: "5'10", percent:2.13 },
		{height: "5'11", percent:0.88 },
		{height: "6'", percent: 0.18 },
		{height: "6'1", percent: 0.08 },
		{height: "6'2", percent: 0.03 },
		{height: "6'3", percent: 0.00 },
		{height: "6'4", percent: 0.00 },
		{height: "6'5", percent: 0.08 },
		{height: "6'6", percent: 0.00 },
		{height: "6'7", percent: 0.00 }
	]
};
CharacterGenerator.prototype._randomHeight = function(gender){
	return this.height[gender].weightedRandom().height;
}


CharacterGenerator.prototype.weight = [
	"Thin",
	"Thin",
	"Average",
	"Average",
	"Average",
	"Large"
];
CharacterGenerator.prototype._randomWeight = function(){
	return this.weight.random();
}
CharacterGenerator.prototype.eyeColor = [
		"Amber",
		"Blue",
		"Brown",
		"Gray",
		"Green",
		"Hazel",
		"Dark Brown"
	];
CharacterGenerator.prototype._randomEyeColor = function(){
	return this.eyeColor.random();
}


CharacterGenerator.prototype.hair = {
	"condition": {
		"Male": [
			"Bald",
			"Balding",
			"Thin",
			"",
			"Full"
		],
		"Female": [
			"Thin",
			"",
			"Full"
		],
	},
	"color": [
		"Black",
		"Brown",
		"Blond",
		"Auburn",
		"Chestnut",
		"Red"
	],
	"aged": [
		"Graying",
		"White",
		""
	]
};
CharacterGenerator.prototype._randomHair = function(gender,age){
	var condition = this.hair.condition[gender].random(),
		color = this.hair.color.random(),
		isAged = (age + Math.random()*25) > 50,
		aged = this.hair.aged.random();
	return condition + ' ' + (isAged ? aged :'') + ' ' + color;
}

CharacterGenerator.prototype.genders = ["Male","Female"];
CharacterGenerator.prototype._randomGender = function(){
	return this.genders.random();
}

CharacterGenerator.prototype.months = [
	{name:"January",days:31},
	{name:"February",days:29},
	{name:"March",days:31},
	{name:"April",days:30},
	{name:"May",days:31},
	{name:"June",days:30},
	{name:"July",days:31},
	{name:"August",days:31},
	{name:"September",days:30},
	{name:"October",days:31},
	{name:"November",days:30},
	{name:"December",days:31},
];
CharacterGenerator.prototype._randomBirthday = function(){
	var month = this.months.random(),
		day = Math.floor(Math.random()*month.days)+ 1;
	return month.name + ' ' + day;
}
CharacterGenerator.prototype._randomAge = function(){
	var max = 70,
		min = 15;
	return Math.floor(Math.random()*(max - min)) + min + 1;
}

Function.prototype.inheritFrom = function(parent){
	var oldPro = this.prototype;
	this.prototype = Object.create(parent.prototype || parent);
	this.members(oldPro);
}
Function.prototype.members = function(members){
	this.prototype.merge(members);
}
Object.prototype.merge = function(source){
	for(var prop in source)if(source.hasOwnProperty(prop)){
		this[prop] = source[prop]
	}
};

function NameGenerator(){
	this.loadData();
}
NameGenerator.inheritFrom(Eventful);
NameGenerator.members({
	xhr: function(url,callback){
		var request = new XMLHttpRequest();
		request.open('GET',url);
		request.addEventListener('load',function(){
			callback(request);
		});
		request.send();
	},
	loadData: function(){
		this.xhr("data/names_male.txt",function(maleRequest){
			this.xhr("data/names_female.txt",function(femaleRequest){
				this.xhr("data/names_last.txt",function(lastRequest){
					this.maleList = new NameList(maleRequest.responseText);
					this.femaleList = new NameList(femaleRequest.responseText);
					this.lastList = new NameList(lastRequest.responseText);
					this.maleMixer = new NameMixer(this.maleList);
					this.femaleMixer = new NameMixer(this.femaleList);
					this.lastMixer = new NameMixer(this.lastList);
					this.fireEvent('ready');
				}.bind(this));
			}.bind(this));
		}.bind(this));
	},
	getCouple: function(){
		return {
			man: this.getMan(),
			woman: this.getWoman()
		};
	},
	getMan: function(){
		return {
			first: this.maleMixer.getName(),
			last: this.lastMixer.getName()
		}
	},
	getWoman: function(){
		return {
			first: this.femaleMixer.getName(),
			last: this.lastMixer.getName()
		}
	},
	getFamily: function(){
		return {
			husband: this.maleMixer.getName(),
			wife: this.femaleMixer.getName(),
			children: this.getChildren(),
			last: this.lastMixer.getName()
		}
	},
	getChildren: function(){
		var c = [];
		while(Math.random() > .25 && c.length < 12){
			c.push(this.getFirstName());
		}
		return c;
	},
	getFirstName: function(){
		if(Math.random() < .5){
			return this.maleMixer.getName();
		} else {
			return this.femaleMixer.getName();
		}
	},
	random: function(gender){
		if(gender == "Male"){
			return this.maleMixer.getName() + ' ' + this.lastMixer.getName();
		} else {
			return this.femaleMixer.getName() + ' ' + this.lastMixer.getName();
		}
	}

});

function NameList(file){
	var _this = [];
	var lines = file.split('\n');
	lines.forEach(function(line){
		var row = line.split(/\s+/);
		_this.push({
			name: row[0][0] + row[0].substr(1).toLowerCase(),
			percent: +row[1],
			cumPercent: +row[2],
			rank: +row[3]
		});
	});
	_this.merge(NameList.prototype);
	return _this;
}
NameList.members({
	getTotallyRandom: function(){
		return this[Math.floor(this.length * Math.random())].name;
	},
	getWeightedRandomName: function(){
		for(var i = 0; i < 100; i++){
			var val = Math.random()*10;
			for(var j = 0, name = this[j]; j < this.length; name = this[++j]){
				val -= name.percent;
				if(val <= 0){
					return name.name;
				}
			}
		}
		return null;
	},
	getRandom: function(){
		var methods = [
			this.getTotallyRandom.bind(this)
			//this.getWeightedRandomName.bind(this)
		];
		return methods[Math.floor(Math.random()*methods.length)]();
	}
});

function NameGeneratorViewModel(ng){
	this.family = [];
	this.men = [];
	this.women = [];
	this.couples = [];
	for(var i = 0; i < 100; i++){
		if(i < 25)this.family.push(ng.getFamily());
		this.men.push(ng.getMan());
		this.women.push(ng.getWoman());
		this.couples.push(ng.getCouple());
	}
	
}


function NameMixer(names){
	var splitter = /([aeiou]+)/ig;
	this.chunks = {};
	for(var i = 0; i < names.length; i++){
		var name = names[i].name;
		var nameChunks = name.split(splitter);
		
		if(nameChunks.length > 1){ // get rid of names without vowels or single vowel names
			
			// first chunk in name
			this.addChunk(['_',nameChunks[0],nameChunks[1]]);
			nameChunks.shift();
					
			// the rest of the chunks
			while(nameChunks.length){
			
				var chunk = [nameChunks[0],nameChunks[1],nameChunks[2]];
				nameChunks.shift();
				nameChunks.shift();
				this.addChunk(chunk);
			}
		}
	}
	
}

NameMixer.prototype = {
	addChunk: function(chunk){
		var key = chunk[0].toLowerCase();
		if(!this.chunks[key]){
			this.chunks[key] = [];
		}
		this.chunks[key].push([chunk[1],chunk[2]]);
	},
	
	getName: function(){
		var chunk = this.chunks['_'].random();
		var name = chunk[0] + chunk[1];
		var key = chunk[1].toLowerCase();
		
		for(var i = 0; i < 3; i++){
			var chunk = this.chunks[key].random();
			name += chunk[0];
			if(!chunk[1]){
				break;
			}
			name += chunk[1];
			key = chunk[1].toLowerCase();
		}
		
		if(name.length < 2){
			return this.getName();
		}
		
		return name;
	}
};
