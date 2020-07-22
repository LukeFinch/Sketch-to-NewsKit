var sketch = require('sketch')
var Document = require('sketch/dom').Document
var document = Document.getSelectedDocument()


var Text = require('sketch/dom').Text
var Group = require('sketch/dom').Group


const fs = require('@skpm/fs');
const path = require('@skpm/path');
const home = require("os").homedir();
const exportPath = `${home}/SketchJSON/`


var texts = []
var paints = []
var shadows = []
var blurs = []
var output = {}


var lib = {}
lib.CGSizeToObj = function(size){
  return {
      width : size.width,
      height: size.height
  }
};

lib.CGRectToObj = function(rect){
  var origin = rect.origin;
  var size   = rect.size;
  return {
      x : origin.x,
      y : origin.y,
      width: size.width,
      height: size.height
  };
};


function parseGradient(gradient) {

  let angle = angleBetween(gradient.from(), gradient.to())
  let type
  switch (gradient.gradientType()){
  case 0:
  type = "linear-gradient"
  break;
  case 1:
  type = "radial-gradient"
  break;
  case 2:
  type = "angular-gradient"
  break;
  }
  
  let stops = gradient.stops()
  let str = []
  stops.forEach(stop => {
              str.push(` ${MSColorToRGBA(stop.color())} ${(stop.position().toFixed(4)*100)}%`)
          })

  let output = `${type}(${angle}deg,${str.join(',')})`

  return output
}

function MSColorToRGBA(c){
return `rgba(${Math.round(c.red() * 255)}, ${Math.round(c.green() * 255)}, ${Math.round(c.blue() * 255)}, ${c.alpha()})`
}

function angleBetween(p1,p2){
let angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
return Math.round(angleDeg)
}


export default function () {
  /*
  Sketch's document.getTextStyles() doesn't return all the info, and returns an MSArray
  
  Types:
  0 layerStyles
  1 textStyles
  
  Returns a JavaScript Array of styles
  */
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


  /* Get the primitive colors that form all the foundations */
  var colorPalette = {}
  var colorStyles = getSharedStyles(0).filter(style => style.name().includes('ExtendedPalette') || style.name().includes('Overlays') && !style.name().includes('border'))

  colorStyles.forEach(style => {
  var value
  var name = style.name().split('/')[style.name().split('/').length -1]
  let fills = style.style().fills()
      if(!fills.length){
      value = "transparent"
      }else{
          let fill = fills[0]
          if(fill.fillType() == 0){
              value = MSColorToRGBA(fill.color())
              }else{
                  value = parseGradient(fill.gradient())
              }
            }
      colorPalette[name] = value
  })



   /* Get the theme colors */

  //Filter out styles that aren't fills.
  const regex = RegExp('(0[12345])', 'g')
  var themeColors = getSharedStyles(0).filter(style => style.name().split('/')[0] && 
  !style.name().includes('border') &&
  !style.name().includes('Shadows') &&
  !style.name().includes('Images') && 
  !style.name().includes('ExtendedPalette'))

  var  outputThemeColors = {}

  themeColors.forEach(style => {
    
    let value
    var name = style.name().split('/')[style.name().split('/').length -1]
    let fills = style.style().fills()
        if(!fills.length){
        value = "transparent"
        }else{
            let fill = fills[0]
            if(fill.fillType() == 0){
                value = getPrimitiveFromColor(fill.color(),name)
                }else{
                    value = parseGradient(fill.gradient())
                }
              }
              
      outputThemeColors[name] = value || "undefined for some fucking reason"
  })

  function getPrimitiveFromColor(color,name){
    let c = MSColorToRGBA(color)
    let prim = getKeyByValue(colorPalette, c)
    return prim
  }  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }




  ///=====================
  // Blurs and Shadows
  //These are left-over from the figma implementation, need to make them NewsKit Friendly
 /*
  Get the shadow styles
  Sketch's API doesn't let us fetch the blend mode of a shadow.
  But, there's no logical way to set the blend mode of a box-shadow in CSS, so we ignore and set it to 'NORMAL'
  Figma doesn't allow for Spread on drop shadows. Something something GPU intensive blah blah.. 
  We include it here anyway commented out, because maybe one day in the future they'll enable it.
  */

  var shadowStyles = getSharedStyles(0).filter(style => style.name().includes('Shadows'))

  shadowStyles.forEach(style => {
    let o = {}
    o.type = "EFFECT"
    let inp = style.style()
    o.name = `${style.name()}`
    o.effects = []

    inp.shadows().forEach(shadow => {
     let  e = {}
      e.type = "DROP_SHADOW"
      e.color = {
        r: shadow.color().red(),
        g: shadow.color().green(),
        b: shadow.color().blue(),
        a: shadow.color().alpha()
      }
      e.blendMode = "NORMAL"
      e.visible = true
      e.offset = {
        x: shadow.offsetX(),
        y: shadow.offsetY()
      }
      e.radius = shadow.blurRadius()
     // e.spread = shadow.spread()
      o.effects.push(e)
    })

    
    shadows.push(o)
  })
  /*
  Blur effects, this isn't the best implementation.. NewsKit was built on top of Sketch's implementations,
  Blurs aren't fully accounted for in NewsKit
  Sketch Types
  0 Gaussian (Figma Layer Blur)
  1 Motion (Unsupported in Figma)
  2 Zoom  (Unsuppoted in Figma)
  3 Background
  
  */
  var blurStyles = getSharedStyles(0).filter(style => style.style().blur().isEnabled() == 1 && !style.name().includes('border'))
  blurStyles.forEach(style => {
    let inp = style.style().blur()

   let o = {}
    o.type = "EFFECT"
    //Need a better Naming System here...
    o.name = 'Blur/' + style.name()
    o.effects = []
    let e = {}
    switch (inp.type()) {
      case 0:
        e.type = "LAYER_BLUR"
        break;
      case 1:
        console.warn('Motion Blurs are unsupported by Figma')
        break;
      case 2:
        console.warn('Zoom Blurs are unsupported by Figma')
        break;
      case 3:
        e.type = "BACKGROUND_BLUR"
        break;
    }
    e.visible = true
    e.radius = inp.radius()

    //Saturation is not yet supported for background blurs in Figma..
    //inp.saturation() ? e.saturation = inp.saturation() : null

    o.effects.push(e)
    blurs.push(o)
  })





//==============================================
/*Text Styles*/

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


var textStyles = getSharedStyles(1)
textStyles = textStyles.filter(style => style.name().includes('inkBase') && document.getSharedTextStyleWithID(style.objectID()).style.alignment == 'left')

var fontSizes = {}
var fontSizesArr = []
var lineHeights = {}
var lineHeightsArr = []
var fontWeightsArr = []
var fontFamiliesArr = []
var fontLetterSpacing = []

//Establish all the primitive values

textStyles.forEach(style => {

    //Sketch has values in different places
    let textStyle = document.getSharedTextStyleWithID(style.objectID()).style
    let font = style.value().primitiveTextStyle().attributes()[NSFont]

    //Font Family
    fontFamiliesArr.push(font.familyName())

    //Font Size
    let fontSizePx = textStyle.fontSize
    fontSizesArr.push(fontSizePx / DEFAULT_FONT_SIZE)


    let lineHeight = textStyle.lineHeight //Actual LineHeight(px) test against this to get a rem value


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


    let  w = FONT_WEIGHTS_NUMBER[`${weightOfFont(font)}`]
    if (fontWeightsArr.indexOf(w) < 0) {
      fontWeightsArr.push(w)
      }
    //Font Letter Spacing (Kerning)
    let kerning = textStyle.kerning || 0 //By deault in sketch this is null
        if (fontLetterSpacing.indexOf(kerning) < 0) {
        fontLetterSpacing.push(kerning)
        }
})


//The output Object
var textPrimitives = {
    fontFamily: {},
    fontSize: {},
    lineHeight: {},
    fontWeight: {},
    fontLetterSpacing: {}
}

fontWeightsArr = fontWeightsArr.unique().sort()
fontSizesArr = fontSizesArr.unique().sort()
lineHeightsArr = lineHeightsArr.unique().sort()
fontFamiliesArr = fontFamiliesArr.unique().sort()


//TODO: Write a function that tokenises an array
// fontFamiliesArr.forEach((value, index) => {
//   let tokenName = 'fontFamily' + index + 1
//   textPrimitives['fontFamily'][tokenName] = `${value}`
// })

fontWeightsArr.forEach((value, index) => {
  let tokenName = 'fontWeight' + tokenFormat(index + 1)
  textPrimitives['fontWeight'][tokenName] = `${value}`
})

fontSizesArr.forEach((value, index) => {
    let tokenName = 'fontSize' + tokenFormat(index + 1)
    textPrimitives['fontSize'][tokenName] = value + 'rem'
})

lineHeightsArr.forEach((value, index) => {
    let tokenName = 'fontlineHeight' + tokenFormat(index + 1)
    textPrimitives['lineHeight'][tokenName] = value + 'rem'
})

fontLetterSpacing.forEach((value,index) => {
    let tokenName = 'fontLetterSpacing' + tokenFormat(index+1)
    textPrimitives['fontLetterSpacing'][tokenName] = value
})

var textStylesOutput = {}

textStyles.forEach(style => {

    //output object
    var o = {}
    //Remove the ink name from the token name
    let n = style.name().split('/')[1]
    //o.name = n


    //Sketch has values in different places
    let textStyle = document.getSharedTextStyleWithID(style.objectID()).style
    let font = style.value().primitiveTextStyle().attributes()[NSFont]

    var fontSizePx = textStyle.fontSize
    o.fontSize = textPrimitives.fontSize.getKeyByValue(textStyle.fontSize / DEFAULT_FONT_SIZE)

    var lineHeightPx = textStyle.lineHeight  
    
    Object.entries(textPrimitives.lineHeight).forEach(lineHeight => {
    let estLineHeight = lineHeight[1]    
    //from: ncu-newskit/src/utils/font-sizing.ts 
    var adjLineHeightPx = (Math.round((estLineHeight * fontSizePx) / gridSize) * gridSize);
    if(adjLineHeightPx == lineHeightPx){
      o.lineHeight = lineHeight[0]
      }
    })


    o.fontFamily = textPrimitives.fontFamily.getKeyByValue(`${font.familyName()}`) //e.g 'The Sun'
    //o.typeName = `${font.typeName()}` // e.g 'Heavy Narrow'

    let  w = FONT_WEIGHTS_NUMBER[`${weightOfFont(font)}`]
    o.fontWeight = textPrimitives.fontWeight.getKeyByValue(w)

       

    o.fontStretch = isCondensedFont(font) ? 'condensed' : 'normal'
    o.fontStyle = isItalicFont(font) ? 'italic' : 'normal'
    //o.textDecorationLine = textStyle.textUnderline ? 'underline' : 'none'

    let kerning = textStyle.kerning || 0
    o.fontLetterSpacing = textPrimitives.fontLetterSpacing.getKeyByValue(kerning)

    textStylesOutput[n] = o

})



if (!fs.existsSync(exportPath)){
  fs.mkdirSync(exportPath);
}

try {
  fs.writeFileSync(exportPath+'color-palette.json', JSON.stringify(colorPalette,null,4));
} catch(err) {
  // An error occurred
  console.error(err);
}
try {
  fs.writeFileSync(exportPath+'theme-colors.json', JSON.stringify(outputThemeColors,null,4));
} catch(err) {
  // An error occurred
  console.error(err);
}
try{
  fs.writeFileSync(exportPath+'text-primitives.json', JSON.stringify(textPrimitives,null,4))
} catch (err){
  console.error(err)
}
try {
  fs.writeFileSync(exportPath+'text-styles.json', JSON.stringify(textStylesOutput,null,4));
} catch(err) {
  // An error occurred
  console.error(err);
}

sketch.UI.message('Exported Styles to: '+ exportPath)

//Text Cropping here, lets try it out D:


var group = new Group({
  name: 'Temporary Group - please delete after running the plugin',
  layers: [],
})

var page = MSDocument.currentDocument().currentPage();

group.parent = context.document.currentPage()

textStyles.forEach(style => {
var text = new Text({
  text: 'Type Something',
})
text.sharedStyle = style
text.parent = group
style.resetReferencingInstances()

let textStyle = document.getSharedTextStyleWithID(style.objectID()).style
let font = style.value().primitiveTextStyle().attributes()[NSFont]


var predicate = NSPredicate.predicateWithFormat("objectID CONTAINS[c] %@",text.id)
var result = page.children().filteredArrayUsingPredicate(predicate);
var layer = result[0]

    
    var metrics = {
        'ascent':font.ascender(),
        'descent':font.descender(),
        'capHeight':font.capHeight(),
        'xHeight':font.xHeight(),
        'defaultLineHeight':layer.style().textStyle().immutableModelObject().encodedAttributes().NSParagraphStyle.minimumLineHeight(),
        'italicAngle':font.italicAngle(),
        'maxAdvancement':lib.CGSizeToObj(font.maximumAdvancement()),
        'boundingRect':lib.CGRectToObj(font.boundingRectForFont())
    }

  
    var offset = metrics.defaultLineHeight - layer.immutableModelObject().textLayout().firstBaselineOffset();
    var output = {}
    output['fontName'] = `${font.fontName()}`
    console.log(textStyle.fontSize);
    output['fontSize'] = `${textPrimitives.fontSize.getKeyByValue((textStyle.fontSize / DEFAULT_FONT_SIZE)+'rem')}`
    output['topCrop'] = metrics.boundingRect.height - metrics.ascent
    output['bottom Crop'] = offset
    text.text = JSON.stringify(output)
})
//group.remove()






}



