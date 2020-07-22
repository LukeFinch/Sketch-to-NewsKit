var sketch = require('sketch')
var Document = require('sketch/dom').Document
var document = Document.getSelectedDocument()
var ShapePath = require('sketch/dom').ShapePath

var colorPalette = {}
var texts = []
var paints = []
var shadows = []
var blurs = []
var output = {}


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

//var styles = getSharedStyles(0).filter(style => style.name().includes('ExtendedPalette') && !style.name().includes('border'))

function parseGradient(gradient) {

    angle = angleBetween(gradient.from(), gradient.to())

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
    str = []
    stops.forEach(stop => {
                str.push(` ${MSColorToRGBA(stop.color())} ${(stop.position().toFixed(4)*100)}%`)
            })

    output = `${type}(${angle}deg,${str.join(',')})`

    return output
}

function MSColorToRGBA(c){
return `rgba(${Math.round(c.red() * 255)}, ${Math.round(c.green() * 255)}, ${Math.round(c.blue() * 255)}, ${c.alpha()})`
}

function angleBetween(p1,p2){
var angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
console.log(angleDeg)
return Math.round(angleDeg)
}


styles.forEach(style => {
var value
var name = style.name().split('/')[style.name().split('/').length -1]
//console.log(name)
fills = style.style().fills()
    if(!fills.length){
    value = "transparent"
    }else{
        fill = fills[0]
        if(fill.fillType == 0){
            value = MSColorToRGBA(fill.color())
            }else{
                value = parseGradient(fill.gradient())
            }
          }
    colorPalette[name] = value
})






// colorPaletteOutput = JSON.stringify(colorPalette,null,4))
