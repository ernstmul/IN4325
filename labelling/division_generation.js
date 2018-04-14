var start = 1;
var last = 897;

var refineOverlap = 100;
var labelOverlap = 200;

var documentIDs = [];
var refineOverlapIDs = [];
var labelOverlapIDs = [];
var remcoIDs = [];
var ernstIDs = [];


for (var i = start; i <= last; i++) {
    documentIDs.push(i);
}

for (var i = 0; i < refineOverlap; i++) {
	var index = Math.floor(Math.random()*documentIDs.length);
    refineOverlapIDs.push(documentIDs[index]);
    documentIDs.splice(index, 1);
}

for (var i = 0; i < labelOverlap; i++) {
	var index = Math.floor(Math.random()*documentIDs.length);
    labelOverlapIDs.push(documentIDs[index]);
    documentIDs.splice(index, 1);
}

var assignRemco = true;

while (documentIDs.length > 0) {
	var index = Math.floor(Math.random() * documentIDs.length);
    var docID = documentIDs[index];
    documentIDs.splice(index, 1);
    if (assignRemco) {
  	    remcoIDs.push(docID);
        assignRemco = false;
    } else {
  	    ernstIDs.push(docID);
        assignRemco = true;
    }
}

var result = {
	refineOverlapIDs : refineOverlapIDs,
    labelOverlapIDs : labelOverlapIDs,
    remcoIDs : remcoIDs,
	ernstIDs : ernstIDs
}

console.log(JSON.stringify(result));