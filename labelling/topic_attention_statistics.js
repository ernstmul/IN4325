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

function noIndication(labels) {
    if (labels.indexOf("noMovement") > -1) {
        return true;
    }
    if (labels.indexOf("decisionOnly") > -1) {
        var attentionIndication = ["horizontal", "vertical", "highlighting", "scrolling", "random"]
        for (var label of attentionIndication) {
            if (labels.indexOf(label) > -1) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function computeStatistics(data) {
    var topicCounts = new Map();

    for (var judgement of data) {
        if (!topicCounts.get(judgement.topic)) {
            topicCounts.set(judgement.topic, {
                noIndication: 0,
                total: 0
            });
        }
        var noIndicationVal = (noIndication(judgement.labels) ? 1 : 0);
        count = topicCounts.get(judgement.topic);
        topicCounts.set(judgement.topic, {
            noIndication: count.noIndication + noIndicationVal,
            total: count.total + 1
        })
    }
    
    var res = [];
    var total = 0;
    var noIndicationTotal =  0;
    for (var [key, value] of topicCounts.entries()) {
        res.push({
            topic: key,
            noIndication: value.noIndication,
            total: value.total,
            percentage: value.noIndication / value.total,
        });
        total = total + value.total;
        noIndicationTotal = noIndicationTotal + value.noIndication;
    }

    var average = 0;
    var topicCount = res.length;
    for (var count of res) {
        average = average + count.percentage;
    }

    res.push({
        topic: "Average",
        percentage: average / topicCount
    });

    res.push({
        topic: "EntireSet",
        noIndication: noIndicationTotal,
        total: total,
        percentage: noIndicationTotal / total,
    });

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
    dlAnchorElem.setAttribute("download", "attention_statistics.json");
    dlAnchorElem.click();
});