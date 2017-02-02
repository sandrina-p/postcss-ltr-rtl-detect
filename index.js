// require
const postcss = require('postcss');

// validations
const properties = [
    'padding',
    'padding-left',
    'padding-right',
    'margin',
    'margin-left',
    'margin-right',
    'text-align',
    'float',
    'left',
    'right',
];
const unitsPx = new RegExp('.+px');
const unitsRem = new RegExp('.+rem');
const unitsEm = new RegExp('.+em');

const optionsDefault = {
    unitsDetect: false,
    propsMsg: 'Use a @mixin to support LTR vs RTL.',
    unitsMsg: 'Consider using a variable.',
};

let postcssResult = '';

module.exports = postcss.plugin('postcss-ltr-rtl-detect', function (options) {
    return function (css, result) {
        postcssResult = result;

        const newOptions = Object.assign({}, optionsDefault, options);

        css.eachDecl(function (decl) {
            if (decl.value) {
                detectDecl(decl, newOptions);
            }
        });
    };
});

function detectDecl(decl, rule) {
    const prop = decl.prop;
    const value = decl.value;

    if (properties.indexOf(prop) > -1) {
        switch (prop) {
        case 'text-align' && value !== 'center':
        case 'padding' && value.split(' ').length > 3:
        case 'padding-left':
        case 'padding-right':
        case 'margin':
        case 'margin-left':
        case 'margin-right':
        case 'float':
        case 'left':
        case 'right':
            warnIt(rule.propsMsg, decl, prop, value);
            break;
        default:
            break;
        }
    }

    if (rule.searchUnits && decl.parent.selector !== ':root'
        && (value.search(unitsPx) !== -1
        || value.search(unitsRem) !== -1
        || value.search(unitsEm) !== -1)) {
        warnIt(rule.unitsMsg, decl, prop, value);
    }
}

function warnIt(msg = '', decl, prop, value) {
    const message = `%s found on line %l. ${msg}`;
    const from = postcssResult.opts.from || '[source file not specified]';

    postcssResult.warn(
        message
            .replace('%s', `${prop}: ${value};`)
            .replace('%l', decl.source.start.line)
            .replace('%f', from)
    );
}
