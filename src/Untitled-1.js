var Shape = require('sketch/dom').Shape
var ShapePath = require('sketch/dom').ShapePath
var lib = {};
var finchlib = {};
lib.warn = function(context,msg){
    context.document.showMessage_(msg);
};

/*--------------------------------------------------------------------------------------------------------------------*/
// obj utitls
/*--------------------------------------------------------------------------------------------------------------------*/

lib.objTypeOf = function(obj,class_){
    return obj.class() == class_;
};

lib.objValuesToArr = function(obj){
    var out = [];
    for(var p in obj){
        out.push(obj[p]);
    }
    return out;
};

lib.CGPointToObj = function(point){
    return {
        x : point.x,
        y : point.y
    }
};

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

lib.createDict = function(objects,keys){
    return NSDictionary.dictionaryWithObjects_forKeys(objects, keys);
};

lib.objToDict = function(obj){
    var keys = Object.keys(obj);
    var values = new Array(keys.length);

    for(var i = 0, l = keys.length; i < l; ++i){
        values[i] = obj[""+keys[i]];
    }

    return lib.createDict(values,keys);
};

lib.dictToObj = function(dict){
    var obj  = {};
    var keys = dict.allKeys();
    for(var i = 0, l = keys.count(), key; i < l; ++i){
        key = keys[i];
        obj[key] = dict.objectForKey_(key);
    }
    return obj;
};

lib.indicesOf = function(obj,element){
    var indices = [];
    for(var i = 0, l = obj.length; i < l; ++i){
        if(obj[i] == element){
            indices.push(i);
        }
    }
    return indices;
};




/*--------------------------------------------------------------------------------------------------------------------*/
// Font
/*--------------------------------------------------------------------------------------------------------------------*/

lib.getFontMetrics = function(font){
    return {
        ascent  : font.ascender(),
        descent : font.descender(),
        capHeight : font.capHeight(),
        xHeight   : font.xHeight(),
        defaultLineHeight : font.defaultLineHeightForFont(),
        italicAngle : font.italicAngle(),
        maxAdvancement : this.CGSizeToObj(font.maximumAdvancement()),
        boundingRect : this.CGRectToObj(font.boundingRectForFont())
    }
};

lib.relToAbsMetrics = function(metrics){
    var defaultLineHeight = metrics.defaultLineHeight;
    
    var baselineHeight    = metrics.ascent;

    return {
        defaultLineHeight : defaultLineHeight,
        baselineHeight    : baselineHeight,
        descentHeight     : defaultLineHeight - metrics.descent,
        capHeight         : baselineHeight - metrics.capHeight,
        xHeight           : baselineHeight - metrics.xHeight,

        capHeightCenter : baselineHeight - metrics.capHeight * 0.5,
        xHeightCenter   : baselineHeight - metrics.xHeight * 0.5,

        italicAngle    : metrics.italicAngle,
        maxAdvancement : metrics.maxAdvancement,
        boundingRect   : metrics.boundingRect
    };
};

lib.getFontCharMetrics = function(font,char){
    var charCode = char.charCodeAt(0);
    return {
        advancement : this.CGSizeToObj(font.advancementForGlyph_(charCode)),
        boundingRect : this.CGRectToObj(font.boundingRectForGlyph_(charCode))
    }
};

lib.getFontLeading = function(metrics,lineHeight){
    return lineHeight - (metrics.ascent + metrics.descent);
};


//=========
//Edit lib, get real line heights


finchlib.getFontMetrics = function(layer){
 
    let font = layer.font()
    //defaultLineHeight : font.defaultLineHeightForFont() //Removed
    return {
        ascent  : font.ascender(),
        descent : font.descender(),
        capHeight : font.capHeight(),
        xHeight   : font.xHeight(),
        defaultLineHeight : layer.style().textStyle().immutableModelObject().encodedAttributes().NSParagraphStyle.minimumLineHeight(),
        italicAngle : font.italicAngle(),
        maxAdvancement : lib.CGSizeToObj(font.maximumAdvancement()),
        boundingRect : lib.CGRectToObj(font.boundingRectForFont())
    }
};


finchlib.relToAbsMetrics = function(metrics){
    var defaultLineHeight = metrics.defaultLineHeight;
    
    var baselineHeight    = metrics.ascent;

    return {
        defaultLineHeight : defaultLineHeight,
        baselineHeight    : baselineHeight,
        descentHeight     : defaultLineHeight - metrics.descent,
        capHeight         : baselineHeight - metrics.capHeight,
        xHeight           : baselineHeight - metrics.xHeight,

        capHeightCenter : baselineHeight - metrics.capHeight * 0.5,
        xHeightCenter   : baselineHeight - metrics.xHeight * 0.5,

        italicAngle    : metrics.italicAngle,
        maxAdvancement : metrics.maxAdvancement,
        boundingRect   : metrics.boundingRect
    };
};






function createFontMetricsGroup(layer){
     
    var font = layer.font();

    var fontName = font.fontName();
    var fontSize = layer.fontSize();
    
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

    var frame = layer.frame();
    var width = frame.width();
    var offset = metrics.defaultLineHeight - layer.immutableModelObject().textLayout().firstBaselineOffset();
    console.log('topcrop:',metrics.boundingRect.height - metrics.ascent)
    console.log('bottomcrop:',offset)
    //console.log(metrics)
    // addRectToPage('Cap Height',layer.frame().x(),layer.frame().y() + metrics.capHeight, layer.frame().width(),0.5)
    // addRectToPage('Baseline',layer.frame().x(),layer.frame().y() - offset + layer.frame().height(), layer.frame().width(),0.5)

}

/**
 * 'Create Font Metrics' - Action
 * @param context
 */
function createTextFontMetrics(context){
    var selection = lib.getSelectionSimple(context);

    if(!selection.hasSelection()){
        lib.warn(context,'Create Font Metrics: Nothing selected.');
        return;
    }

    var selectionFiltered = lib.filterLayersByClass(selection.currentSelection,MSTextLayer);
    if(selection.currentSelection.count() == 1 && selectionFiltered.length == 0){
        lib.warn(context,'Create Font Metrics: Selection not of type Text Layer.');
        return;
    } else if(selectionFiltered.length == 0) {
        lib.warn(context,'Create Font Metrics: Selection does not contain any Text Layers.');
        return;
    }

    for(var i = 0; i < selectionFiltered.length; ++i){
        createFontMetricsGroup(selectionFiltered[i]);
    }
}

function addRectToPage(name,x,y,w,h){
new ShapePath({
    name: name,
    parent: context.document.currentPage(), 
    frame: { x:x,y:y,width:w,height:h },
    style: {
    fills: ['#35E6C944'],
    borders:[]}
    })
}

//console.log(context.selection[0].font())
context.selection.forEach(sel => createFontMetricsGroup(sel))