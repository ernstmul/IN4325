function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'final_filtered_judgements.json', true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // .open will NOT return a value but simply returns undefined in async mode so use a callback
            callback(xobj.responseText);

        }
    }
    xobj.send(null);   
}

function computeStatistics(data) {
    var labelCounts = new Map();

    for (var judgement of data) {
        var labels = judgement.labels;

        for (var label of labels) {
            if (!labelCounts.get(label)) {
                labelCounts.set(label, 0);
            }
            labelCounts.set(label, labelCounts.get(label) + 1);
        }
    }

    var res = [];
    for (var [key, value] of labelCounts.entries()) {
        res.push({
            label: key,
            count: value,
            percentage: value / data.length,
        });
    }

    var decisionOnly = res.find(element => element.label == "decisionOnly").count;
    var noMovement = res.find(element => element.label == "noMovement").count;

    res.push({
        label: "noIndication",
        count: decisionOnly + noMovement,
        percentage: (decisionOnly + noMovement) / data.length,
    })

    return res;
}

loadJSON(content => {
    var data = JSON.parse(content);

    var summaries = data.filter(element => element.isSummary == 1);
    var documents = data.filter(element => element.isSummary == 0);

    var behaviour_percentages = {
        summaries: computeStatistics(summaries),
        documents: computeStatistics(documents),
    }

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(behaviour_percentages));
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", "behaviour_statistics.json");
    dlAnchorElem.click();
});