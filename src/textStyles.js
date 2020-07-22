var sketch = require('sketch')
var Document = require('sketch/dom').Document
var document = Document.getSelectedDocument()

//NewsKit Constants
const DEFAULT_FONT_SIZE = 16
const gridSize = 4

//Function to pad numbers into token form. eg: 1 becomes 010
var tokenFormat = function (number) {
    return new Array(+3 + 1 - (number * 10 + '').length).join('0') + number * 10;
}


//Sketch Scripts don't support Set(), we can fix this with a plugin and polyfills though...
Array.prototype.contains = function (v) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function () {
    var arr = [];
    for (var i = 0; i < this.length; i++) {
        if (!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr;
}

//Get Object Key by value, to map each style to primitives
Object.prototype.getKeyByValue = function (value) {
    for (var prop in this) {
        if (this.hasOwnProperty(prop)) {
            if (this[prop] === value)
                return prop;
        }
    }
}



//From @airbnb/react-sketch
//Sketch gives a float for fontWeight, 
const FONT_WEIGHTS = {
    ultralight: -0.8,
    '100': -0.8,
    thin: -0.6,
    '200': -0.6,
    light: -0.4,
    '300': -0.4,
    normal: 0,
    regular: 0,
    '400': 0,
    semibold: 0.23,
    demibold: 0.23,
    '500': 0.23,
    '600': 0.3,
    bold: 0.4,
    '700': 0.4,
    extrabold: 0.56,
    ultrabold: 0.56,
    heavy: 0.56,
    '800': 0.56,
    black: 0.62,
    '900': 0.62,
};
//Extract out only CSS numbers
const FONT_WEIGHTS_NUMBER = {
    '-0.8': '100',
    '-0.6': '200',
    '-0.4': '300',
    '0': '400',
    '0.23': '500',
    '0.3': '600',
    '0.4': '700',
    '0.56': '800',
    '0.62': '900'
}
//Map CSS font-weight to a NewsKit token
const fontWeightTokens = {
    'fontWeight010': '100',
    'fontWeight020': '200',
    'fontWeight030': '300',
    'fontWeight040': '400',
    'fontWeight050': '500',
    'fontWeight060': '600',
    'fontWeight070': '700',
    'fontWeight080': '800',
    'fontWeight090': '900',
}

//from @airbnb/react-sketch
//Return booleans of font-style and font-stretch
const isItalicFont = (font) => {
    const traits = font.fontDescriptor().objectForKey(NSFontTraitsAttribute);
    const symbolicTraits = traits[NSFontSymbolicTrait].unsignedIntValue();
    return (symbolicTraits & NSFontItalicTrait) !== 0;
};
const isCondensedFont = (font) => {
    const traits = font.fontDescriptor().objectForKey(NSFontTraitsAttribute);
    const symbolicTraits = traits[NSFontSymbolicTrait].unsignedIntValue();
    return (symbolicTraits & NSFontCondensedTrait) !== 0;
};
const weightOfFont = (font) => {
    const traits = font.fontDescriptor().objectForKey(NSFontTraitsAttribute);
    const weight = traits[NSFontWeightTrait].doubleValue();
    if (weight === 0.0) {
        const weights = Object.keys(FONT_WEIGHTS);
        const fontName = String(font.fontName()).toLowerCase();
        const matchingWeight = weights.find((w) => fontName.endsWith(w));
        if (matchingWeight) {
            return FONT_WEIGHTS[matchingWeight];
        }
    }
    return weight;
};

function getSharedStyles(type) {
    var myStyles = []
    if (sketch.version.sketch < 52) {
        var styles = (type == 0) ? MSDocument.currentDocument().documentData().layerStyles().objects() : MSDocument.currentDocument().documentData().layerTextStyles().objects();
    } else {
        var styles = (type == 0) ? MSDocument.currentDocument().documentData().allLayerStyles() : MSDocument.currentDocument().documentData().allTextStyles();
    }

    var sortByName = NSSortDescriptor.sortDescriptorWithKey_ascending("name", 1);
    styles = styles.sortedArrayUsingDescriptors([sortByName]);
    styles.forEach(style => {
        myStyles.push(style)
    })
    return myStyles;
}


var textStyles = getSharedStyles(1)
textStyles = textStyles.filter(style => style.name().includes('inkBase') && document.getSharedTextStyleWithID(style.objectID()).style.alignment == 'left')

var fontSizes = {}
var fontSizesArr = []
var lineHeights = {}
var lineHeightsArr = []
var weightArr = []
var fontFamilies = []
var fontLetterSpacing = []

//Establish all the primitive values

textStyles.forEach(style => {

    //Sketch has values in different places
    let textStyle = document.getSharedTextStyleWithID(style.objectID()).style
    let font = style.value().primitiveTextStyle().attributes()[NSFont]

    //Font Family
    if (fontFamilies.indexOf(font.familyName()) < 0) {
        fontFamilies.push(font.familyName())
    }

    //Font Size
    fontSizePx = textStyle.fontSize
    fontSizesArr.push(fontSizePx / DEFAULT_FONT_SIZE)


    lineHeight = textStyle.lineHeight //Actual LineHeight(px) test against this to get a rem value


    var adjLineHeight = 0
    var outputRem = 0

    const inc = 1 / 24 // Catch eighths and sixths

    for (var rem = 1; rem <= 4; rem += inc) {

        let estLineHeight = rem * fontSizePx

        //from: ncu-newskit/src/utils/font-sizing.ts 
        var adjLineHeight = (Math.round((estLineHeight * fontSizePx) / gridSize) * gridSize) / fontSizePx;

        if (adjLineHeight == lineHeight) {
            outputRem = Number(rem.toFixed(4))

            //If the lineHeight (rem) matches up to the value after rounding to gridSize 
            lineHeightsArr.push(outputRem)
            break;
        }
        if (rem == 4) {
            console.error("Couldn't find a line height (probably not a multiple of gridSize)",
                fontSizePx,
                lineHeight)
        }
    }


    w = FONT_WEIGHTS_NUMBER[`${weightOfFont(font)}`]

    //Font Letter Spacing (Kerning)
    let kerning = textStyle.kerning || 0 //By deault in sketch this is null
        if (fontLetterSpacing.indexOf(kerning) < 0) {
        fontLetterSpacing.push(kerning)
        }
  
    



    //let str = `family: ${f.familyName()} weight: ${FONT_WEIGHTS_NUMBER[w]} condensed:${isCondensedFont(f)} italic: ${isItalicFont(f)}`
})



fontSizesArr = fontSizesArr.unique().sort()
lineHeightsArr = lineHeightsArr.unique().sort()

var textPrimitives = {
    fontFamily: {},
    fontSize: {},
    lineHeight: {},
    fontWeight: fontWeightTokens,
    fontLetterSpacing: {}
}

fontSizesArr.forEach((value, index) => {
    tokenName = 'fontSize' + tokenFormat(index + 1)
    textPrimitives['fontSize'][tokenName] = value
})

lineHeightsArr.forEach((value, index) => {
    tokenName = 'lineHeight' + tokenFormat(index + 1)
    textPrimitives['lineHeight'][tokenName] = value
})

fontFamilies.forEach((value, index) => {
    tokenName = 'fontFamily' + tokenFormat(index + 1)
    textPrimitives['fontFamily'][tokenName] = value
})

fontLetterSpacing.forEach((value,index) => {
    tokenName = 'fontLetterSpacing' + tokenFormat(index+1)
    textPrimitives['fontLetterSpacing'][tokenName] = value
})

//console.log(textPrimitives)

var textStylesOutput = {}

textStyles.forEach(style => {

    //output object
    o = {}
    //Remove the ink name from the token name
    let n = style.name().split('/')[1]
    o.name = n


    //Sketch has values in different places
    let textStyle = document.getSharedTextStyleWithID(style.objectID()).style
    let font = style.value().primitiveTextStyle().attributes()[NSFont]
    var adjLineHeight = 0
    var outputRem = 0
    var fontSizePx = textStyle.fontSize
    var lineHeightPx = textStyle.lineHeight
    const inc = 1 / 24 // Catch eighths and sixths
    
    Object.entries(textPrimitives.lineHeight).forEach(lineHeight => {
    estLineHeight = lineHeight[1]
    
        //from: ncu-newskit/src/utils/font-sizing.ts 
    var adjLineHeightPx = (Math.round((estLineHeight * fontSizePx) / gridSize) * gridSize);
  if(adjLineHeightPx == lineHeightPx){o.lineHeight = lineHeight[0]}

    })

    o.fontFamily = textPrimitives.fontFamily.getKeyByValue(font.familyName())
    o.typeName = font.typeName()
    o.fontSize = textPrimitives.fontSize.getKeyByValue(textStyle.fontSize / DEFAULT_FONT_SIZE)
    
    o.fontStretch = isCondensedFont(font) ? 'condensed' : 'normal'
    o.fontStyle = isItalicFont(font) ? 'italic' : 'normal'
    o.textDecorationLine = textStyle.textUnderline ? 'underline' : 'none'
    let kerning = textStyle.kerning || 0
    o.fontLetterSpacing = textPrimitives.fontLetterSpacing.getKeyByValue(kerning)

    textStylesOutput[n] = o

})
