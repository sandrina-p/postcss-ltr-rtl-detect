const postcss = require('postcss');

// properties that directly influence LTR RTL
const propertiesBasic = [
    'padding-right',
    'padding-left',
    'margin-right',
    'margin-left',
    'border-right',
    'border-left',
    'float',
    'left',
    'right',
];

// properties shorthand that might influence LTR RTL
const propertiesShortHand = [
    'padding',
    'margin',
];

// properties alignment that might influence LTR RTL
const propertiesAlign = [
    'text-align',
];

// properties that do not influence LTR RTL
const propertiesAgressive = [
    'padding-top',
    'padding-bottom',
    'margin-top',
    'margin-bottom',
    'border-top',
    'border-bottom',
    'top',
    'bottom',
    'border',
];

// regexp to find units on values
const unitsPx = new RegExp('.+px');
const unitsRem = new RegExp('.+rem');
const unitsEm = new RegExp('.+em');


// default props
const defaultProps = {
    agressive: true,
    agressiveMsg: 'Use a @mixin to keep consistence on code.',
    propsMsg: 'Use a @mixin to support LTR vs RTL.',
    importantDetect: false,
    importantMsg: 'Consider reviewing your code and remove !important rule.',
    unitsPxDetect: false,
    unitsRemDetect: false,
    unitsEmDetect: false,
    unitsMsg: 'Consider using a variable.',
};

let postcssResult = '';


function detectDecl(decl, rule) {
    const prop = decl.prop;
    const value = decl.value;

    /* detect property that has px, rem or em */
    if (decl.parent.name !== 'font-face' && decl.parent.selector !== ':root') {
        if (rule.unitsPxDetect && value.search(unitsPx) !== -1) {
            warnIt(rule.unitsMsg, decl, prop, value);
        } else if (rule.unitsRemDetect && value.search(unitsRem) !== -1) {
            warnIt(rule.unitsMsg, decl, prop, value);
        } else if (rule.unitsEmDetect && value.search(unitsEm) !== -1) {
            warnIt(rule.unitsMsg, decl, prop, value);
        } else if (decl.important && rule.importantDetect) {
            warnIt(rule.importantMsg, decl, prop, value);
        }
    }


    /* detect propertiesBasic */
    if (propertiesBasic.indexOf(prop) > -1) {
        warnIt(rule.propsMsg, decl, prop, value);
        return false;
    }


    /* detect properties that don't change on ltr-rtl */
    if (rule.agressive && propertiesAgressive.indexOf(prop) > -1) {
        warnIt(rule.agressiveMsg, decl, prop, value);
        return false;
    }


    /* detect properties that don't change on ltr-rtl */
    if (propertiesShortHand.indexOf(prop) > -1) {
        switch (value.split(' ').length) {
        case 4:
            warnIt(rule.propsMsg, decl, prop, value);
            break;
        case 1:
        case 2:
        case 3:
        default: {
            if (rule.agressive) {
                warnIt(rule.agressiveMsg, decl, prop, value);
            }
            break;
        }
        }
        return false;
    }


    /* detect property that is about alignments */
    if (propertiesAlign.indexOf(prop) > -1) {
        if (value === 'center') {
            if (rule.agressive) {
                warnIt(rule.agressiveMsg, decl, prop, value);
            }
        } else {
            warnIt(rule.propsMsg, decl, prop, value);
        }
        return false;
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


module.exports = postcss.plugin('postcss-ltr-rtl-detect', (options) => {
    return function (css, result) {
        postcssResult = result;

        const newOptions = Object.assign({}, defaultProps, options);

        css.walkDecls((decl) => {
            if (decl.value) {
                detectDecl(decl, newOptions);
            }
        });
    };
});
