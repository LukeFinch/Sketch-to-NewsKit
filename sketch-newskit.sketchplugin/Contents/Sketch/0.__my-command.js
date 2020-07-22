var globalThis = this;
var global = this;
function __skpm_run (key, context) {
  globalThis.context = context;
  try {

(window["webpackJsonpexports"] = window["webpackJsonpexports"] || []).push([[0],{

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

//===================================================
// Utility functions.
//I should probably take these out and import them.
// Oh well.
//===================================================
//Convert sketch's colors into CSS RGBA
function MSColorToRGBA(c) {
  return "rgba(".concat(Math.round(c.red() * 255), ", ").concat(Math.round(c.green() * 255), ", ").concat(Math.round(c.blue() * 255), ", ").concat(c.alpha(), ")");
} //Used for gradients, to know what direction they face.


function angleBetween(p1, p2) {
  var angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
  return Math.round(angleDeg);
} //Return a CSS string for some gradient stuff.


function parseGradient(gradient) {
  var angle = angleBetween(gradient.from(), gradient.to());
  var type;

  switch (gradient.gradientType()) {
    case 0:
      type = "linear-gradient";
      break;

    case 1:
      type = "radial-gradient";
      break;

    case 2:
      type = "angular-gradient";
      break;
  }

  var stops = gradient.stops();
  var str = [];
  stops.forEach(function (stop) {
    //We wanted to have gradients be made up of two tokens, but alpha values made things awkard.
    // let colorToken = colorPalette.getKeyByValue(`${MSColorToRGBA(stop.color())}`)
    // str.push(` ${colorToken} ${(stop.position().toFixed(4)*100)}%`)
    str.push(" ".concat(MSColorToRGBA(stop.color()), " ").concat(stop.position().toFixed(4) * 100, "%"));
  });
  var output = "".concat(type, "(").concat(angle, "deg,").concat(str.join(','), ")");
  return output;
} //https://gist.github.com/abynim/e2df3ea4dc9ede209cc0
//https://gist.github.com/abynim/4e1d4754f990cfc933ae
//Search Through sketch documents for stuff.


var findLayersMatchingPredicate_inContainer_filterByType = function findLayersMatchingPredicate_inContainer_filterByType(predicate, container, layerType) {
  var scope;

  switch (layerType) {
    case MSPage:
      scope = doc.pages();
      return scope.filteredArrayUsingPredicate(predicate);
      break;

    case MSArtboardGroup:
      if (typeof container !== 'undefined' && container != nil) {
        if (container.className == "MSPage") {
          scope = container.artboards();
          return scope.filteredArrayUsingPredicate(predicate);
        }
      } else {
        // search all pages
        var filteredArray = NSArray.array();
        var loopPages = doc.pages().objectEnumerator(),
            page;

        while (page = loopPages.nextObject()) {
          scope = page.artboards();
          filteredArray = filteredArray.arrayByAddingObjectsFromArray(scope.filteredArrayUsingPredicate(predicate));
        }

        return filteredArray;
      }

      break;

    default:
      if (typeof container !== 'undefined' && container != nil) {
        scope = container.children();
        return scope.filteredArrayUsingPredicate(predicate);
      } else {
        // search all pages
        var filteredArray = NSArray.array();
        var loopPages = doc.pages().objectEnumerator(),
            page;

        while (page = loopPages.nextObject()) {
          scope = page.children();
          filteredArray = filteredArray.arrayByAddingObjectsFromArray(scope.filteredArrayUsingPredicate(predicate));
        }

        return filteredArray;
      }

  }

  return NSArray.array(); // Return an empty array if no matches were found
};

var findFirstLayerMatchingPredicate_inContainer_filterByType = function findFirstLayerMatchingPredicate_inContainer_filterByType(predicate, container, layerType) {
  var filteredArray = findLayersMatchingPredicate_inContainer_filterByType(predicate, container, layerType);
  return filteredArray.firstObject();
};

var findLayersNamed_inContainer_filterByType = function findLayersNamed_inContainer_filterByType(layerName, container, layerType) {
  var predicate = typeof layerType === 'undefined' || layerType == nil ? NSPredicate.predicateWithFormat("name == %@", layerName) : NSPredicate.predicateWithFormat("name == %@ && class == %@", layerName, layerType);
  return findLayersMatchingPredicate_inContainer_filterByType(predicate, container);
};

var findPagesNamed = function findPagesNamed(pageName) {
  var predicate = NSPredicate.predicateWithFormat("name == %@", pageName);
  return findLayersMatchingPredicate_inContainer_filterByType(predicate, nil, MSPage);
};

var findArtboardsNamed = function findArtboardsNamed(artboardName) {
  var predicate = NSPredicate.predicateWithFormat("name == %@", artboardName);
  return findLayersMatchingPredicate_inContainer_filterByType(predicate, nil, MSArtboardGroup);
}; ///Rectangle handlers.


var lib = {};

lib.CGSizeToObj = function (size) {
  return {
    width: size.width,
    height: size.height
  };
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
  var myStyles = [];

  if (sketch.version.sketch < 52) {
    var styles = type == 0 ? MSDocument.currentDocument().documentData().layerStyles().objects() : MSDocument.currentDocument().documentData().layerTextStyles().objects();
  } else {
    var styles = type == 0 ? MSDocument.currentDocument().documentData().allLayerStyles() : MSDocument.currentDocument().documentData().allTextStyles();
  }

  var sortByName = NSSortDescriptor.sortDescriptorWithKey_ascending("name", 1);
  styles = styles.sortedArrayUsingDescriptors([sortByName]);
  styles.forEach(function (style) {
    myStyles.push(style);
  });
  return myStyles;
} //Function to pad numbers into token form. eg: 1 becomes 010, 4.5 becomes 045


var tokenFormat = function tokenFormat(number) {
  return new Array(+3 + 1 - (number * 10 + '').length).join('0') + number * 10;
}; //Sketch Scripts don't support Set(), we can fix this with a plugin and polyfills though...


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
}; //Get Object Key by value, to map each style to primitives


Object.prototype.getKeyByValue = function (value) {
  for (var prop in this) {
    if (this.hasOwnProperty(prop)) {
      if (this[prop] === value) return prop;
    }
  }
}; //Split camelCase into words[]


function splitWords(s) {
  var re,
      match,
      output = []; // re = /[A-Z]?[a-z]+/g

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
} //Splits JSON based on categories, returns a string with nice spacing between categories


function prettifyJSON(data) {
  var str = JSON.stringify(data, '\n', 4);
  var arr = str.split('\n');
  var prevCat = null;
  arr.forEach(function (item, index) {
    var cat = splitWords(item)[0];

    if (prevCat !== cat && index != 1 && index != arr.length - 1) {
      arr[index - 1] += '\n';
      console.log(item);
    }

    prevCat = cat;
  });
  str = arr.join('\n');
  return str;
}

/***/ })

}]);
    if (key === 'default' && typeof exports === 'function') {
      exports(context);
    } else if (typeof exports[key] !== 'function') {
      throw new Error('Missing export named "' + key + '". Your command should contain something like `export function " + key +"() {}`.');
    } else {
      exports[key](context);
    }
  } catch (err) {
    if (typeof process !== 'undefined' && process.listenerCount && process.listenerCount('uncaughtException')) {
      process.emit("uncaughtException", err, "uncaughtException");
    } else {
      throw err
    }
  }
}
globalThis['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=0.__my-command.js.map