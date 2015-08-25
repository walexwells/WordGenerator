



function NextChunkSet(){
	var s = new Map();

	function splitWordIntoChunks(name){
		var chunks = name.split(/([aeiou])+/)
		if(!chunks[0].length){
			chunks.shift()
		}
		if(!chunks[chunks.length -1].length){
			chunks.pop()
		}
		return ["start"].concat(chunks).concat("end");
	}

	s.addPair = function(c1,c2){
		if(!s.has(c1)){
			s.set(c1,[])
		}
		s.get(c1).push(c2);
	}	

	s.addWord = function(word){
		var chunks = splitWordIntoChunks(word)
		for(var i = 0; i < chunks.length -1; i++){
			s.addPair(chunks[i],chunks[i+1])
		}
	}

	s.generateRandomChunk = function(pre){
		var chunks = s.get(pre);
		return chunks[Math.floor(Math.random()*chunks.length)];
	}

	return s
}

function RandomWordGenerator(wordList){
	var chunkSet = NextChunkSet(),
		lengths = []
	for(var i = 0; i < wordList.length; i++){
		chunkSet.addWord(wordList[i]);
		lengths.push(wordList[i].length);
	}

	return {
		next: function(){
			var wordLength = lengths[Math.floor(Math.random()*lengths.length)]
			do{
				var wordChunks = ['start'];
				while(wordChunks[wordChunks.length-1] != 'end'){
					wordChunks.push(chunkSet.generateRandomChunk(wordChunks[wordChunks.length-1]))
				}
				wordChunks.pop()
				wordChunks.shift()
				var word = wordChunks.join("");
			} while( word.length != wordLength);
			return word;
		}
	}
}


var maleNameGenerator = new RandomWordGenerator(maleNames);
var femaleNameGenerator = new RandomWordGenerator(female_names);
var lastNameGenerator = new RandomWordGenerator(last_names);

var nameCount = 250;
var genMaleNames = [];
var genFemaleNames = [];
for(var i = 0; i < nameCount; i++){
	genMaleNames.push(maleNameGenerator.next()+" "+lastNameGenerator.next());
	genFemaleNames.push(femaleNameGenerator.next()+" "+lastNameGenerator.next());
}
