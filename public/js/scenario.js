var scenarioSetContent = function (scenario, id, content) {
    for (var i = 0; i < scenario.length; i++) {
        if (scenario[i].id == id) {
            scenario[i] = content;
        }
    }
}

var scenarioGetSize = function (scenario) {
    return scenario.length;
}

var scenarioGetId = function (scenario, index) {
    return scenario[index].id;
}

var scenarioDeleteNode = function (scenario, id) {
    for (var i = 0; i < scenario.length; i++) {
        if (scenario[i].id == id) {
            scenario.splice(i, 1);
            break;
        }
    }
}
