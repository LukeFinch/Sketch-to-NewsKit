var sketch = require('sketch')
var Document = require('sketch/dom').Document
var document = Document.getSelectedDocument()

const fs = require('@skpm/fs');
const path = require('@skpm/path');
const home = require("os").homedir();
const exportPath = `${home}/SketchJSON/`


var texts = []
var paints = []
var shadows = []
var blurs = []
var output = {}

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


  /* Get the primitive colours that form all the foundations */
  var colourPalette = {}
  var colourStyles = getSharedStyles(0).filter(style => style.name().includes('ExtendedPalette') || style.name().includes('Overlays') && !style.name().includes('border'))

  colourStyles.forEach(style => {
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
      colourPalette[name] = value
  })

  if (!fs.existsSync(exportPath)){
    fs.mkdirSync(exportPath);
}

  try {
    fs.writeFileSync(exportPath+'colour-palette.json', JSON.stringify(colourPalette,null,4));
  } catch(err) {
    // An error occurred
    console.error(err);
  }

   /* Get the theme colours, where a option is given a decision */

  //Filter out styles that aren't fills.
  const regex = RegExp('(0[12345])', 'g')
  var themeColours = getSharedStyles(0).filter(style => style.name().split('/')[0] && 
  !style.name().includes('border') &&
  !style.name().includes('Shadows') &&
  !style.name().includes('Images') && 
  !style.name().includes('ExtendedPalette'))

  var  outputThemeColours = {}

  themeColours.forEach(style => {
    
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
              
      outputThemeColours[name] = value || "undefined for some fucking reason"
  })


  try {
    fs.writeFileSync(exportPath+'theme-colours.json', JSON.stringify(outputThemeColours,null,4));
  } catch(err) {
    // An error occurred
    console.error(err);
  }






  function getPrimitiveFromColor(color,name){
    let c = MSColorToRGBA(color)
    let prim = getKeyByValue(colourPalette, c)
    console.log(name,c,prim)
    return prim
  }



  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }




  ///=====================

  var textStyles = getSharedStyles(1)

  /*
  Optional - Filter so we only get left aligned text, and the base colour.
  Figma's less explicit around type alignment and colour for styles.
  Therefore we only need to extract the Font Family, Weight, Size, Line Height and Kerning
  
  We ignore text decoration in these cases. Underlining should be done at the designers discrepancy in the design outputs.
  Italic / Oblique fonts are pulled through, this is a side-effect of getting the weight from the PostScript name. 
   
  */
  textStyles = textStyles.filter(style => style.name().includes('inkBase') && document.getSharedTextStyleWithID(style.objectID()).style.alignment == 'left')



  textStyles.forEach(style => {

    //Output object
    let o = {}
    o.type = "TEXT"

    //The input style
   let inp = document.getSharedTextStyleWithID(style.objectID()).style

    //Extracting the name of the weight from the Postscript name, Figma expects this in title case with spaces.
    let fontStyle = style.style().textStyle().fontPostscriptName().split('-')[1].replace(/([a-z0-9])([A-Z])/g, '$1 $2')



    //Remove the ink name from the token name
    let n = style.name().split('/')
    n.pop()
    o.name = n.join('/')

    o.fontSize = inp.fontSize
    o.fontName = {
      family: inp.fontFamily,
      style: fontStyle
    }
    o.lineHeight = {
      unit: "PIXELS",
      value: inp.lineHeight
    }
    o.letterSpacing = inp.kerning
    o.paragraphSpacing = inp.paragraphSpacing


    texts.push(o)
  })





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


  //Combine all the styles into one Object
  output.texts = texts
  output.paints = paints
  output.blurs = blurs
  output.shadows = shadows


  const str = JSON.stringify(colourPalette,null,4)
  //const str = JSON.stringify(output, null, 4)

  //Make a dialog box to show the output
  var UI = require('sketch/ui')
  UI.getInputFromUser(
    "Style Output:", {
      description: "Click ok to Export",
      initialValue: str,
      type: UI.INPUT_TYPE.string,
      numberOfLines: 20

    },
    (err, value) => {

      if (err) {
        // most likely the user canceled the input
        return
      }
      if (value) {
        //Export styles when they hit Ok

      //   if (!fs.existsSync(exportPath)){
      //     fs.mkdirSync(exportPath);
      // }
      
      //   try {
      //     fs.writeFileSync(exportPath+'export.json', str);
      //   } catch(err) {
      //     // An error occurred
      //     console.error(err);
      //   }
        

        // var pasteBoard = NSPasteboard.generalPasteboard()
        // pasteBoard.declareTypes_owner(NSArray.arrayWithObject(NSPasteboardTypeString), nil)
        // pasteBoard.setString_forType(str, NSPasteboardTypeString)
        UI.message('Styles exported to: ' + exportPath)
      }
    }
  )



}





function parseGradient(gradient) {

  let angle = angleBetween(gradient.from(), gradient.to())
  let type
  //console.log(gradient)
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