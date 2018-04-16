function loadJSON(callback) {
    
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', 'filtered_judgements.json', true);
        xobj.onreadystatechange = function() {
            if (xobj.readyState == 4 && xobj.status == "200") {
                // .open will NOT return a value but simply returns undefined in async mode so use a callback
                callback(xobj.responseText);
    
            }
        }
        xobj.send(null);   
    }

loadJSON((content) => {

    var data = JSON.parse(content);
    var map = new Map();
    data.forEach(judgement => {
        var noMovementOnly = 0;
        if (judgement.labels.length == 1 && judgement.labels.indexOf("noMovement") > -1) {
            noMovementOnly = 1;
        }

        if (map.get(judgement.user)) {
            var d = map.get(judgement.user);
            d.count = d.count + 1;
            d.noMovement = d.noMovement + noMovementOnly;
        } else {
            var d = {
                count: 1,
                noMovement: noMovementOnly
            }
            map.set(judgement.user, d);
        }
    });
    var total = 0;
    for (var [key, value] of map.entries()) {
        console.log(key + ' = ' + value.count + " - " + value.noMovement);
        total = total + value.count;
    }
    console.log(total);
});