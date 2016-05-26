var hbs = require('hbs');

hbs.registerHelper('lowercase', function(str) {
    if (str && typeof str === "string") return str.toLowerCase();
});

hbs.registerHelper('upperFirst', function(str) {
    if (str && typeof str === "string") {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});

hbs.registerHelper("moduloIf", function(index_count,mod,add,block) {
    if (parseInt(add)+ index_count != index_count) {
        index_count += parseInt(add);
    }
    if(parseInt(index_count)%(mod)=== 0){
        return block.fn(this);
    }
});

hbs.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

hbs.registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});

hbs.registerHelper('position', function(str) {
    switch (str.toLowerCase()) {

        //Majors
        case "archon":
            return "Archon";
        case "vice-archon":
            return "Vice-Archon";
        case "treasurer":
            return "Treasurer";
        case "chaplain":
            return "Chaplain";
        case "warden":
            return "Warden";
        case "secretary":
            return "Secretary";
        case "historian":
            return "Historian";

        //Minors
        case "alumni-sec":
            return "Alumni Secretary";
        case "ass-rush":
            return "Assistant Rush Chair";
        case "ifc":
            return "IFC Delegate";
        case "philanthropy":
            return "Philanthropy Chair";
        case "mal":
            return "Members at Large";
        case "sports":
            return "Sports Chair";
        case "risk":
            return "Risk Management Chair";
        case "roi":
            return "Royal Order of the Internet";
        case "rohm":
            return "Royal Order of House Management";
        case "scholarship":
            return "Scholarship Chair";
        case "social":
            return "Social Chair";
        case "stew":
            return "House Steward";
        case "vmo":
            return "Vending Machine Operator";
    }
});

module.exports = hbs;