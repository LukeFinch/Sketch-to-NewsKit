// require("@babel/polyfill");

var sketch = require('sketch')
var Document = require('sketch/dom').Document
var document = Document.getSelectedDocument()



const Shape = require('sketch/dom').Shape
const Text = require('sketch/dom').Text
const Group = require('sketch/dom').Group


const page = MSDocument.currentDocument().currentPage();

const fs = require('@skpm/fs');
const path = require('@skpm/path');
const home = require("os").homedir();


const doc = context.document
const folderName = `${new Date().toISOString().replace(/[^0-9]/g, "")}_${doc.fileURL().path().lastPathComponent().replace('.sketch','')}`


const mainFolder = `${home}/NewsKit Theme Exports/`
if (!fs.existsSync(mainFolder)) {
  fs.mkdirSync(mainFolder);
}
const exportPath = `${mainFolder}${folderName}/`


var texts = []
var paints = []
var shadows = []
var blurs = []
var output = {}


//NewsKit Constants
const DEFAULT_FONT_SIZE = 16
const gridSize = 4

var colorPalette = {}

var crops = {}



// When we run the plugin.
export default function () {

// //Make a sheet to block user input whilst the script runs.
// //it doesn't take that long, but it's helpful to show something when everything is a task in the background.
// let document = sketch.getSelectedDocument()
// let documentWindow = document.sketchObject.windowControllers()[0].window()

// let mySheetWindow = NSWindow.alloc().initWithContentRect_styleMask_backing_defer(
//     NSMakeRect(0, 0, 400, 80),
//     (NSWindowStyleMaskTitled | NSWindowStyleMaskDocModalWindow),
//     NSBackingStoreBuffered,
//     true
// )
// let progressView = NSProgressIndicator
//     .alloc()
//     .initWithFrame(NSMakeRect(20, 20, 360, 12))
// progressView.setControlTint(NSBlueControlTint)
// progressView.startAnimation(true)

// var title = NSTextView.alloc().initWithFrame(NSMakeRect(20,34,360,20))
//     title.string = 'Exporting Styles'
//     title.drawsBackground = false;
//     title.editable = false;
//     title.setAlignment(2)

// mySheetWindow.contentView().addSubview(progressView)
// mySheetWindow.contentView().addSubview(title)

// documentWindow.beginSheet_completionHandler(mySheetWindow, nil)
// //Run this when it's all done
// //    documentWindow.endSheet(mySheetWindow)






  //===============
  // Border Radius
  //==============
  var shapeDefault = findArtboardsNamed("02 Theme defaults/04 Shape/borderRadiusDefault")[0].layers()[0].cornerRadiusString() + 'px'


  const BORDER_RADIUS = {
    "borderRadiusDefault": shapeDefault

  }

  //=====================
  // Color Primitives
  //=====================

  /* Get the primitive colors that form all the foundations */

  var colorStyles = getSharedStyles(0).filter(style => 
                                                style.name().includes('Palette') && !style.name().includes('border') && !style.name().includes('_null')
                                                )


        colorStyles.forEach(style => {
          var value
          var name = style.name().split('/')[style.name().split('/').length - 1]
          let fills = style.style().fills()
          if (!fills.length) {
            value = "transparent"
          } else {
            let fill = fills[0]
            if (fill.fillType() == 0) {
              value = MSColorToRGBA(fill.color())
            } else {
              //gradients.push({'name':name,'gradient':fill.gradient()})
              value = parseGradient(fill.gradient())
            }
          }
          colorPalette[name] = value
        })





  /* Get the theme colors */

  //Filter out styles that aren't fills.
  const regex = RegExp('(0[12345])', 'g')
  var themeColors = getSharedStyles(0).filter(style =>
    style.name().split('/')[0] &&
    !style.name().includes('border') &&
    !style.name().includes('Shadows') &&
    !style.name().includes('Overlays') &&
    !style.name().includes('Images') &&
    !style.name().includes('Palette') &&
    !style.name().includes('_null')
  )

  var outputThemeColors = {}

  themeColors.forEach(style => {

    let value
    var name = style.name().split('/')[style.name().split('/').length - 1]
    let fills = style.style().fills()
    if (!fills.length) {
      value = "transparent"
    } else {
      let fill = fills[0]
      if (fill.fillType() == 0) {
        value = getPrimitiveFromColor(fill.color(), name)
      } else {
        value = parseGradient(fill.gradient())
      }
    }

    value == "transparent" ? outputThemeColors["transpareent"] = "transparent" : outputThemeColors[name] = `{{colors.${value}}}`
  })

  function getPrimitiveFromColor(color, name) {
    let c = MSColorToRGBA(color)
    let prim = getKeyByValue(colorPalette, c)
    return prim
  }

  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }




  ///=====================
  // Blurs and Shadows

  ///////////////////////

  var shadowsOutput = {}

  var shadowStyles = getSharedStyles(0).filter(style => style.name().includes('Shadows'))

  shadowStyles.forEach(style => {
    let tokenName = style.name().split('/')[1]

    var layer = new Shape({
      name: 'my shape',
      style: style.style(),
      parent: page
    })

    var predicate = NSPredicate.predicateWithFormat("objectID == %@", layer.id)
    var result = page.children().filteredArrayUsingPredicate(predicate);
    let shadowLayer = result[0]

    var shadow = shadowLayer.CSSAttributes()[1].replace('box-shadow: ', '')

    layer.remove()

    shadowsOutput[tokenName] = `${shadow}`

  })




  /*
  Blur effects, this isn't the best implementation.. NewsKit was built on top of Sketch's implementations,
  Blurs aren't fully accounted for in NewsKit
  Sketch Types
  0 Gaussian (Figma Layer Blur)
  1 Motion (Unsupported in Figma)
  2 Zoom  (Unsuppoted in Figma)
  3 Background
  

  Needs adjusting for NewsKit. No sensible way of handling blurs in newskit as of yet.

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



  //=====================
  /// Overlays
  //=====================

  var overlayStyles = getSharedStyles(0).filter(style => style.name().includes('Overlays') && !style.name().includes('border'))
  var overlaysOutput = {}

  overlayStyles.forEach(style => {
    var value
    var name = style.name().split('/')[style.name().split('/').length - 1]
    let fills = style.style().fills()
    if (!fills.length) {
      value = "transparent"
    } else {
      let fill = fills[0]
      if (fill.fillType() == 0) {
        value = MSColorToRGBA(fill.color())
      } else {
        //gradients.push({'name':name,'gradient':fill.gradient()})
        value = parseGradient(fill.gradient())
      }
    }
    overlaysOutput[name] = value
  })









  //==============================================
  /*Text Styles*/
  //Newskit defaults, if a brand's using letter spacing that isnt covered here, they're making everyone's life difficult.
  const LETTER_SPACING = {
    "fontLetterSpacing010": -0.5,
    "fontLetterSpacing020": -0.25,
    "fontLetterSpacing030": 0,
    "fontLetterSpacing040": 0.25,
    "fontLetterSpacing050": 0.5,
    "fontLetterSpacing060": 0.75,
    "fontLetterSpacing070": 1
  }



  // A lot of this stuff could probably be removed... but its useful if we ever wanted to define font-families properly.
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
    '-0.8': 100,
    '-0.6': 200,
    '-0.4': 300,
    '0':    400,
    '0.23': 500,
    '0.3':  600,
    '0.4':  700,
    '0.56': 800,
    '0.62': 900
  }
  //Map CSS font-weight to a NewsKit token
  const fontWeightTokens = {
    'fontWeight010': 100,
    'fontWeight020': 200,
    'fontWeight030': 300,
    'fontWeight040': 400,
    'fontWeight050': 500,
    'fontWeight060': 600,
    'fontWeight070': 700,
    'fontWeight080': 800,
    'fontWeight090': 900,
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


  var fontSizesArr = []

  var lineHeightsArr = []
  var fontWeightsArr = []
  var fontFamiliesArr = []

  var fontFiles = new Set()

  //Establish all the primitive values

  textStyles.forEach(style => {

    //Sketch has values in different places
    let textStyle = document.getSharedTextStyleWithID(style.objectID()).style
    let font = style.value().primitiveTextStyle().attributes()[NSFont]

    //Font Family
    //fontFamiliesArr.push(font.familyName()) -- "The Sun way of doing things"
    fontFamiliesArr.push(font.fontName()) // "The Times way"


    //Font Size
    let fontSizePx = textStyle.fontSize
    fontSizesArr.push(fontSizePx)


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


    let w = FONT_WEIGHTS_NUMBER[`${weightOfFont(font)}`]
    if (fontWeightsArr.indexOf(w) < 0) {
      fontWeightsArr.push(w)
    }

  })


  //The output Object
  var fonts = {
  
  }
  
  //used for value lookups. Not the tidiest method..
  var textPrimitives = {
    fontSize: {},
    lineHeight: {},
    fontWeight: {},
    letterSpacing: {}
  }

  fontWeightsArr = fontWeightsArr.unique().sort()
  fontSizesArr = fontSizesArr.unique().sort()
  lineHeightsArr = lineHeightsArr.unique().sort()
  fontFamiliesArr = fontFamiliesArr.unique().sort()




  fontFamiliesArr.forEach((fam, idx) => {
    let cfg = getCropsForFontFamily(fam)
    let tokenName = 'fontFamily' + tokenFormat(idx + 1)
    
    fonts[tokenName] = {
      'fontFamily': `${cfg.family}`,
      'cropConfig': {}
    }

    fonts[tokenName]['cropConfig'] = {
      'top': cfg.top,
      'bottom': cfg.bottom,
      'defaultLineHeight': cfg.defaultLineHeight
    }
  })


  function getCropsForFontFamily(fontFamily) {

    let family = fontFamily
    let size = DEFAULT_FONT_SIZE //16px = 1rem // set it to 1 to get it in px

    //Create a new text layer, we use capital T to get the cap height. 
    var text = new Text({
      text: "T",
      parent: page
    })

    //Get an actual layer for that text layer, and not just a text object.
    var predicate = NSPredicate.predicateWithFormat("objectID == %@", text.id)
    var result = page.children().filteredArrayUsingPredicate(predicate);
    let textLayer = result[0] 

    //Set the styles
    textLayer.fontPostscriptName = family
    textLayer.fontSize = size

    //Get the default line height
    let defaultLineHeight = getDefaultLineHeightForFont(textLayer.fontPostscriptName(), textLayer.fontSize())
    let defaultLineHeightEm = defaultLineHeight / size


    let bounds = textLayer.pathInFrame().bounds()   
    let t = -bounds.origin.y / size
    let b = -((defaultLineHeight - bounds.size.height) - bounds.origin.y) / size


    text.remove() //Delete the temporary layer.

    crops[fontFamily] = {'top': t, 'bottom': b, 'defaultLineHeight': defaultLineHeightEm}

    return {
      'family': fontFamily,
      'top': t,
      'bottom': b,
      'defaultLineHeight': defaultLineHeightEm
    }
  }

  function getDefaultLineHeightForFont(fontFamily, size) {
    let font = NSFont.fontWithName_size(fontFamily, size);
    let lm = NSLayoutManager.alloc().init();
    return lm.defaultLineHeightForFont(font);
  }



  fontWeightsArr.forEach((value, index) => {
    let tokenName = 'fontWeight' + tokenFormat(index + 1)
    //Commented out, tokens all just sit under a {{font}} object..
    textPrimitives['fontWeight'][tokenName] = value
    fonts[tokenName] = value
  })

  fontSizesArr.forEach((value, index) => {
    let tokenName = 'fontSize' + tokenFormat(index + 1)
    textPrimitives['fontSize'][tokenName] = value
    fonts[tokenName] = value
  })

  lineHeightsArr.forEach((value, index) => {
    let tokenName = 'fontLineHeight' + tokenFormat(index + 1)
    textPrimitives['lineHeight'][tokenName] = value
    fonts[tokenName] = value
  })

 textPrimitives['letterSpacing'] = LETTER_SPACING

  fonts  = {...fonts, ...LETTER_SPACING}

  // fontLetterSpacing.forEach((value, index) => {
  //   let tokenName = 'fontLetterSpacing' + tokenFormat(index + 1)
  //   textPrimitives['fontLetterSpacing'][tokenName] = value
  // })

  var textStylesOutput = {}

  textStyles.forEach(style => {

    //output object
    var o = {}

    let cropProps = {}

    //Get the token name for the text styles
    
    let n = style.name().split('/')[0].toLowerCase().includes("utility") ? style.name().split('/')[2] : style.name().split('/')[1]

    //Sketch has values in different places
    let textStyle = document.getSharedTextStyleWithID(style.objectID()).style
    let font = style.value().primitiveTextStyle().attributes()[NSFont]

    //Export the files used in the styles.
    fontFiles.add(path.resolve(font.fileURL().path()))

    //Size
    var fontSizePx = textStyle.fontSize
    o.fontSize = `{{fonts.${textPrimitives.fontSize.getKeyByValue(textStyle.fontSize)}}}`

    cropProps.size = textStyle.fontSize / DEFAULT_FONT_SIZE

    //lineHeight - Rounded to grid size
    var lineHeightPx = textStyle.lineHeight
    Object.entries(textPrimitives.lineHeight).forEach(lineHeight => {
      let estLineHeight = lineHeight[1]
      //from: ncu-newskit/src/utils/font-sizing.ts 
      var adjLineHeightPx = (Math.round((estLineHeight * fontSizePx) / gridSize) * gridSize);
      if (adjLineHeightPx == lineHeightPx) {
        o.lineHeight = `{{fonts.${lineHeight[0]}}}`

        cropProps.lineHeight = adjLineHeightPx / DEFAULT_FONT_SIZE

      }
    })


    // o.fontFamily = textPrimitives.fontFamily.getKeyByValue(`${font.fontName()}`) //e.g 'The Sun'
    // //o.typeName = `${font.typeName()}` // e.g 'Heavy Narrow'


    //Font Family
    let familyObj = Object.values(fonts).find(item => item.fontFamily === `${font.fontName()}`)

    let familyKey = fonts.getKeyByValue(familyObj)
    o.fontFamily = `{{fonts.${familyKey}.fontFamily}}`

    //BACK UP!!
    // let familyObj = Object.values(fonts.fontFamily).find(item => item.fontFamily === `${font.fontName()}`)

    // let familyKey = fonts.fontFamily.getKeyByValue(familyObj)
    // o.fontFamily = `{{fonts.${familyKey}}}`


    let w = FONT_WEIGHTS_NUMBER[`${weightOfFont(font)}`]
    o.fontWeight = `{{fonts.${textPrimitives.fontWeight.getKeyByValue(w)}}}`


    //Useful Stuff for if we want to do font families the 'right' way
    // o.fontStretch = isCondensedFont(font) ? 'condensed' : 'normal'
    // o.fontStyle = isItalicFont(font) ? 'italic' : 'normal'
    // o.textDecorationLine = textStyle.textUnderline ? 'underline' : 'none'
    

    let kerning = textStyle.kerning || 0

    o.letterSpacing = `{{fonts.${textPrimitives.letterSpacing.getKeyByValue(kerning)}}}`


    //Calculate the font cropping
    let cc = crops[`${font.fontName()}`]

    let deltaLineHeight = cropProps.lineHeight - cc.defaultLineHeight

    // o.cropConfig = {}
    // console.log(cc.top, cc.bottom, deltaLineHeight, cropProps.lineHeight, cc.defaultLineHeight)

    // let top = parseFloat(cc.top) - parseFloat(deltaLineHeight/2)
    // let bottom = parseFloat(cc.bottom) - parseFloat(deltaLineHeight/2)

    // o.cropConfig.cropTop = `${top}`
    // o.cropConfig.cropBottom =  `${bottom}`

    textStylesOutput[n] = o //Add the token to the output

  })







exportFiles()

function exportFiles(){

  if (!fs.existsSync(exportPath)) {
    fs.mkdirSync(exportPath);
  }
  if (!fs.existsSync(exportPath + '/fonts')) {
    fs.mkdirSync(exportPath + '/fonts');
  }


  //Copy all the fonts
  fontFiles.forEach(file => {

    try {
      fs.copyFileSync(file, exportPath + 'fonts/' + path.basename(file))
    } catch (err) {
      console.error(err)
    }
  })

  try {
    fs.writeFileSync(exportPath + 'fonts.json', prettifyJSON(fonts, 1))
  } catch (err) {
    console.error(err)
  }
  // // Colors are now wrapped into one colors.json file. So this code is no longer needed.
  // try {
  //   fs.writeFileSync(exportPath + 'color-palette.json', JSON.stringify(colorPalette, null, 4));
  // } catch (err) {
  //   // An error occurred
  //   console.error(err);
  // }
  // try {
  //   fs.writeFileSync(exportPath + 'theme-colors.json', JSON.stringify(outputThemeColors, null, 4));
  // } catch (err) {
  //   // An error occurred
  //   console.error(err);
  // }

  try {
    fs.writeFileSync(exportPath + 'colors.json', prettifyJSON({...colorPalette, ...outputThemeColors}))
  } catch (err) {
    console.error(err)
  }

  try {
    fs.writeFileSync(exportPath + 'typography-presets.json', JSON.stringify(textStylesOutput, null, 4));
  } catch (err) {
    // An error occurred
    console.error(err);
  }

  try {
    fs.writeFileSync(exportPath + 'border-radius.json', JSON.stringify(BORDER_RADIUS, null, 4))
  } catch (err) {
    console.error(err)
  }

  try {
    fs.writeFileSync(exportPath + 'overlays.json', JSON.stringify(overlaysOutput, null, 4))
  } catch (err) {
    console.error(err)
  }
  

  try {
    fs.writeFileSync(exportPath + 'shadows.json', JSON.stringify(shadowsOutput, null, 4))
  } catch (err) {
    console.error(err)
  }


  
  //documentWindow.endSheet(mySheetWindow) //Remove the progress bar
  sketch.UI.message('Exported Styles to: ' + exportPath) //Tell the user where it exported to.

}


}







//===================================================
// Utility functions.
//I should probably take these out and import them.
// Oh well.
//===================================================

//Convert sketch's colors into CSS RGBA
function MSColorToRGBA(c) {
  return `rgba(${Math.round(c.red() * 255)}, ${Math.round(c.green() * 255)}, ${Math.round(c.blue() * 255)}, ${c.alpha()})`
}

//Used for gradients, to know what direction they face.
function angleBetween(p1, p2) {
  let angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
  return Math.round(angleDeg)
}

//Return a CSS string for some gradient stuff.
function parseGradient(gradient) {

  let angle = angleBetween(gradient.from(), gradient.to())
  let type
  switch (gradient.gradientType()) {
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

    //We wanted to have gradients be made up of two tokens, but alpha values made things awkard.
    // let colorToken = colorPalette.getKeyByValue(`${MSColorToRGBA(stop.color())}`)
    // str.push(` ${colorToken} ${(stop.position().toFixed(4)*100)}%`)

    str.push(` ${MSColorToRGBA(stop.color())} ${(stop.position().toFixed(4)*100)}%`)


  })

  let output = `${type}(${angle}deg,${str.join(',')})`

  return output
}


//https://gist.github.com/abynim/e2df3ea4dc9ede209cc0
//https://gist.github.com/abynim/4e1d4754f990cfc933ae
//Search Through sketch documents for stuff.



var findLayersMatchingPredicate_inContainer_filterByType = function (predicate, container, layerType) {
  var scope;
  switch (layerType) {
    case MSPage:
      scope = doc.pages()
      return scope.filteredArrayUsingPredicate(predicate)
      break;

    case MSArtboardGroup:
      if (typeof container !== 'undefined' && container != nil) {
        if (container.className == "MSPage") {
          scope = container.artboards()
          return scope.filteredArrayUsingPredicate(predicate)
        }
      } else {
        // search all pages
        var filteredArray = NSArray.array()
        var loopPages = doc.pages().objectEnumerator(),
          page;
        while (page = loopPages.nextObject()) {
          scope = page.artboards()
          filteredArray = filteredArray.arrayByAddingObjectsFromArray(scope.filteredArrayUsingPredicate(predicate))
        }
        return filteredArray
      }
      break;

    default:
      if (typeof container !== 'undefined' && container != nil) {
        scope = container.children()
        return scope.filteredArrayUsingPredicate(predicate)
      } else {
        // search all pages
        var filteredArray = NSArray.array()
        var loopPages = doc.pages().objectEnumerator(),
          page;
        while (page = loopPages.nextObject()) {
          scope = page.children()
          filteredArray = filteredArray.arrayByAddingObjectsFromArray(scope.filteredArrayUsingPredicate(predicate))
        }
        return filteredArray
      }
  }
  return NSArray.array() // Return an empty array if no matches were found
}

var findFirstLayerMatchingPredicate_inContainer_filterByType = function (predicate, container, layerType) {
  var filteredArray = findLayersMatchingPredicate_inContainer_filterByType(predicate, container, layerType)
  return filteredArray.firstObject()
}
var findLayersNamed_inContainer_filterByType = function (layerName, container, layerType) {
  var predicate = (typeof layerType === 'undefined' || layerType == nil) ? NSPredicate.predicateWithFormat("name == %@", layerName) : NSPredicate.predicateWithFormat("name == %@ && class == %@", layerName, layerType)
  return findLayersMatchingPredicate_inContainer_filterByType(predicate, container)
}

var findPagesNamed = function (pageName) {
  var predicate = NSPredicate.predicateWithFormat("name == %@", pageName)
  return findLayersMatchingPredicate_inContainer_filterByType(predicate, nil, MSPage)
}


var findArtboardsNamed = function (artboardName) {
  var predicate = NSPredicate.predicateWithFormat("name == %@", artboardName)
  return findLayersMatchingPredicate_inContainer_filterByType(predicate, nil, MSArtboardGroup)
}

///Rectangle handlers.
var lib = {}
lib.CGSizeToObj = function (size) {
  return {
    width: size.width,
    height: size.height
  }
};

lib.CGRectToObj = function (rect) {
  var origin = rect.origin;
  var size = rect.size;
  return {
    x: origin.x,
    y: origin.y,
    width: size.width,
    height: size.height
  };
};

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

//Function to pad numbers into token form. eg: 1 becomes 010, 4.5 becomes 045
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

//Split camelCase into words[]
function splitWords(s) {
    var re, match, output = [];
    // re = /[A-Z]?[a-z]+/g
    re = /([A-Za-z]?)([a-z]+)/g;

    /*
    matches example: "oneTwoThree"
    ["one", "o", "ne"]
    ["Two", "T", "wo"]
    ["Three", "T", "hree"]
    */

    match = re.exec(s);
    while (match) {
        // output.push(match.join(""));
        output.push([match[1].toUpperCase(), match[2]].join(""));
        match = re.exec(s);
    }

    return output;

}
//Splits JSON based on categories, returns a string with nice spacing between categories
function prettifyJSON(data, idx){
  var idx = idx ? idx : 0
  let str = JSON.stringify(data, '\n', 4)
  let arr = str.split('\n')
  
  let prevCat = null
  arr.forEach((item,index) => {
    
   let cat = splitWords(item)[idx]
   let cats = 0 
    if(prevCat !== cat && index != 1 && index != arr.length -1){
      cats ++ 
      if (cats >= 1){
      arr[index-1] += '\n'
      cats = 0
      }
    }
   prevCat = cat
  })
  
  str = arr.join('\n')
  return str
  }