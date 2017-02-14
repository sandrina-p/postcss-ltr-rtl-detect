// require
const postcss = require('postcss');

// validations
const properties = [
    'padding',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'border',
    'border-top',
    'border-right',
    'border-bottom',
    'border-left',
    'float',
    'left',
    'right',
    'text-align',
];
const unitsPx = new RegExp('.+px');
const unitsRem = new RegExp('.+rem');
const unitsEm = new RegExp('.+em');

const defaultProps = {
    unitsPxDetect: false,
    unitsRemDetect: false,
    unitsEmDetect: false,
    importantDetect: false,
    propsMsg: 'Use a @mixin to support LTR vs RTL.',
    unitsMsg: 'Consider using a variable.',
    importantMsg: 'Consider reviewing your code and remove !important rule.',
};

let postcssResult = '';

module.exports = postcss.plugin('postcss-ltr-rtl-detect', function (options) {
    return function (css, result) {
        postcssResult = result;

        const newOptions = Object.assign({}, defaultProps, options);

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
        warnIt(rule.propsMsg, decl, prop, value);
    }

    if (decl.parent.name !== 'font-face' && decl.parent.selector !== ':root') {
        if (rule.unitsPxDetect && value.search(unitsPx) !== -1) {
            warnIt(rule.unitsMsg, decl, prop, value);
        }

        if (rule.unitsRemDetect && value.search(unitsRem) !== -1) {
            warnIt(rule.unitsMsg, decl, prop, value);
        }

        if (rule.unitsEmDetect && value.search(unitsEm) !== -1) {
            warnIt(rule.unitsMsg, decl, prop, value);
        }

        if (decl.important && rule.importantDetect) {
            warnIt(rule.importantMsg, decl, prop, value);
        }
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
