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

loadJSON(content => {
    var blacklisted = ["yizieasyyy"];

    var data = JSON.parse(content);
    var filteredUsers = data.filter(element => blacklisted.indexOf(element.user) < 0);

    var map = new Map();

    filteredUsers.forEach(judgement => {
        var d = map.get(judgement.imageId);
        if (d) {
            d.push(judgement);
        } else {
            map.set(judgement.imageId, [judgement]);
        }
    });

    var filtered = [];

    for (var [key, value] of map.entries()) {
        if (value.length != 1) {
            filtered.push(value[Math.floor(Math.random()*value.length)]);
        } else {
            filtered.push(value[0]);
        }
    }

    console.log(filtered.length);

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filtered));
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", "final_filtered_judgements.json");
    dlAnchorElem.click();
});