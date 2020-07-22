var globalThis = this;
var global = this;
function __skpm_run (key, context) {
  globalThis.context = context;
  try {

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/my-command.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../../node_modules/@skpm/fs/index.js":
/*!**************************************************!*\
  !*** /Users/luke/node_modules/@skpm/fs/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// TODO: async. Should probably be done with NSFileHandle and some notifications
// TODO: file descriptor. Needs to be done with NSFileHandle
var Buffer = __webpack_require__(/*! buffer */ "buffer").Buffer;
var utils = __webpack_require__(/*! ./utils */ "../../../node_modules/@skpm/fs/utils.js");
var parseStat = utils.parseStat;
var fsError = utils.fsError;
var fsErrorForPath = utils.fsErrorForPath;
var encodingFromOptions = utils.encodingFromOptions;
var NOT_IMPLEMENTED = utils.NOT_IMPLEMENTED;

module.exports.constants = {
  F_OK: 0,
  R_OK: 4,
  W_OK: 2,
  X_OK: 1
};

module.exports.access = NOT_IMPLEMENTED("access");

module.exports.accessSync = function(path, mode) {
  mode = mode | 0;
  var fileManager = NSFileManager.defaultManager();

  switch (mode) {
    case 0:
      canAccess = module.exports.existsSync(path);
      break;
    case 1:
      canAccess = Boolean(Number(fileManager.isExecutableFileAtPath(path)));
      break;
    case 2:
      canAccess = Boolean(Number(fileManager.isWritableFileAtPath(path)));
      break;
    case 3:
      canAccess =
        Boolean(Number(fileManager.isExecutableFileAtPath(path))) &&
        Boolean(Number(fileManager.isWritableFileAtPath(path)));
      break;
    case 4:
      canAccess = Boolean(Number(fileManager.isReadableFileAtPath(path)));
      break;
    case 5:
      canAccess =
        Boolean(Number(fileManager.isReadableFileAtPath(path))) &&
        Boolean(Number(fileManager.isExecutableFileAtPath(path)));
      break;
    case 6:
      canAccess =
        Boolean(Number(fileManager.isReadableFileAtPath(path))) &&
        Boolean(Number(fileManager.isWritableFileAtPath(path)));
      break;
    case 7:
      canAccess =
        Boolean(Number(fileManager.isReadableFileAtPath(path))) &&
        Boolean(Number(fileManager.isWritableFileAtPath(path))) &&
        Boolean(Number(fileManager.isExecutableFileAtPath(path)));
      break;
  }

  if (!canAccess) {
    throw new Error("Can't access " + String(path));
  }
};

module.exports.appendFile = NOT_IMPLEMENTED("appendFile");

module.exports.appendFileSync = function(file, data, options) {
  if (!module.exports.existsSync(file)) {
    return module.exports.writeFileSync(file, data, options);
  }

  var handle = NSFileHandle.fileHandleForWritingAtPath(file);
  handle.seekToEndOfFile();

  var encoding = encodingFromOptions(options, "utf8");

  var nsdata = Buffer.from(
    data,
    encoding === "NSData" || encoding === "buffer" ? undefined : encoding
  ).toNSData();

  handle.writeData(nsdata);
};

module.exports.chmod = NOT_IMPLEMENTED("chmod");

module.exports.chmodSync = function(path, mode) {
  var err = MOPointer.alloc().init();
  var fileManager = NSFileManager.defaultManager();
  fileManager.setAttributes_ofItemAtPath_error(
    {
      NSFilePosixPermissions: mode
    },
    path,
    err
  );

  if (err.value() !== null) {
    throw fsErrorForPath(path, undefined, err.value());
  }
};

module.exports.chown = NOT_IMPLEMENTED("chown");
module.exports.chownSync = NOT_IMPLEMENTED("chownSync");

module.exports.close = NOT_IMPLEMENTED("close");
module.exports.closeSync = NOT_IMPLEMENTED("closeSync");

module.exports.copyFile = NOT_IMPLEMENTED("copyFile");

module.exports.copyFileSync = function(path, dest, flags) {
  var err = MOPointer.alloc().init();
  var fileManager = NSFileManager.defaultManager();
  fileManager.copyItemAtPath_toPath_error(path, dest, err);

  if (err.value() !== null) {
    throw fsErrorForPath(path, false, err.value());
  }
};

module.exports.createReadStream = NOT_IMPLEMENTED("createReadStream");
module.exports.createWriteStream = NOT_IMPLEMENTED("createWriteStream");

module.exports.exists = NOT_IMPLEMENTED("exists");

module.exports.existsSync = function(path) {
  var fileManager = NSFileManager.defaultManager();
  return Boolean(Number(fileManager.fileExistsAtPath(path)));
};

module.exports.fchmod = NOT_IMPLEMENTED("fchmod");
module.exports.fchmodSync = NOT_IMPLEMENTED("fchmodSync");
module.exports.fchown = NOT_IMPLEMENTED("fchown");
module.exports.fchownSync = NOT_IMPLEMENTED("fchownSync");
module.exports.fdatasync = NOT_IMPLEMENTED("fdatasync");
module.exports.fdatasyncSync = NOT_IMPLEMENTED("fdatasyncSync");
module.exports.fstat = NOT_IMPLEMENTED("fstat");
module.exports.fstatSync = NOT_IMPLEMENTED("fstatSync");
module.exports.fsync = NOT_IMPLEMENTED("fsync");
module.exports.fsyncSync = NOT_IMPLEMENTED("fsyncSync");
module.exports.ftruncate = NOT_IMPLEMENTED("ftruncate");
module.exports.ftruncateSync = NOT_IMPLEMENTED("ftruncateSync");
module.exports.futimes = NOT_IMPLEMENTED("futimes");
module.exports.futimesSync = NOT_IMPLEMENTED("futimesSync");

module.exports.lchmod = NOT_IMPLEMENTED("lchmod");
module.exports.lchmodSync = NOT_IMPLEMENTED("lchmodSync");
module.exports.lchown = NOT_IMPLEMENTED("lchown");
module.exports.lchownSync = NOT_IMPLEMENTED("lchownSync");

module.exports.link = NOT_IMPLEMENTED("link");

module.exports.linkSync = function(existingPath, newPath) {
  var err = MOPointer.alloc().init();
  var fileManager = NSFileManager.defaultManager();
  fileManager.linkItemAtPath_toPath_error(existingPath, newPath, err);

  if (err.value() !== null) {
    throw fsErrorForPath(existingPath, undefined, err.value());
  }
};

module.exports.lstat = NOT_IMPLEMENTED("lstat");

module.exports.lstatSync = function(path) {
  var err = MOPointer.alloc().init();
  var fileManager = NSFileManager.defaultManager();
  var result = fileManager.attributesOfItemAtPath_error(path, err);

  if (err.value() !== null) {
    throw fsErrorForPath(path, undefined, err.value());
  }

  return parseStat(result);
};

module.exports.mkdir = NOT_IMPLEMENTED("mkdir");

module.exports.mkdirSync = function(path, options) {
  var mode = 0o777;
  var recursive = false;
  if (options && options.mode) {
    mode = options.mode;
  }
  if (options && options.recursive) {
    recursive = options.recursive;
  }
  if (typeof options === "number") {
    mode = options;
  }
  var err = MOPointer.alloc().init();
  var fileManager = NSFileManager.defaultManager();
  fileManager.createDirectoryAtPath_withIntermediateDirectories_attributes_error(
    path,
    recursive,
    {
      NSFilePosixPermissions: mode
    },
    err
  );

  if (err.value() !== null) {
    throw new Error(err.value());
  }
};

module.exports.mkdtemp = NOT_IMPLEMENTED("mkdtemp");

module.exports.mkdtempSync = function(path) {
  function makeid() {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
  var tempPath = path + makeid();
  module.exports.mkdirSync(tempPath);
  return tempPath;
};

module.exports.open = NOT_IMPLEMENTED("open");
module.exports.openSync = NOT_IMPLEMENTED("openSync");

module.exports.read = NOT_IMPLEMENTED("read");

module.exports.readdir = NOT_IMPLEMENTED("readdir");

module.exports.readdirSync = function(path, options) {
  var encoding = encodingFromOptions(options, "utf8");
  var fileManager = NSFileManager.defaultManager();
  var paths = fileManager.subpathsAtPath(path);
  var arr = [];
  for (var i = 0; i < paths.length; i++) {
    var pathName = paths[i];
    arr.push(encoding === "buffer" ? Buffer.from(pathName) : String(pathName));
  }
  return arr;
};

module.exports.readFile = NOT_IMPLEMENTED("readFile");

module.exports.readFileSync = function(path, options) {
  var encoding = encodingFromOptions(options, "buffer");
  var fileManager = NSFileManager.defaultManager();
  var data = fileManager.contentsAtPath(path);
  if (!data) {
    throw fsErrorForPath(path, false);
  }

  var buffer = Buffer.from(data);

  if (encoding === "buffer") {
    return buffer;
  } else if (encoding === "NSData") {
    return buffer.toNSData();
  } else {
    return buffer.toString(encoding);
  }
};

module.exports.readlink = NOT_IMPLEMENTED("readlink");

module.exports.readlinkSync = function(path) {
  var err = MOPointer.alloc().init();
  var fileManager = NSFileManager.defaultManager();
  var result = fileManager.destinationOfSymbolicLinkAtPath_error(path, err);

  if (err.value() !== null) {
    throw fsErrorForPath(path, undefined, err.value());
  }

  return String(result);
};

module.exports.readSync = NOT_IMPLEMENTED("readSync");

module.exports.realpath = NOT_IMPLEMENTED("realpath");
module.exports.realpath.native = NOT_IMPLEMENTED("realpath.native");

module.exports.realpathSync = function(path) {
  return String(NSString.stringWithString(path).stringByResolvingSymlinksInPath());
};

module.exports.realpathSync.native = NOT_IMPLEMENTED("realpathSync.native");

module.exports.rename = NOT_IMPLEMENTED("rename");

module.exports.renameSync = function(oldPath, newPath) {
  var err = MOPointer.alloc().init();
  var fileManager = NSFileManager.defaultManager();
  fileManager.moveItemAtPath_toPath_error(oldPath, newPath, err);

  var error = err.value();

  if (error !== null) {
    // if there is already a file, we need to overwrite it
    if (
      String(error.domain()) === "NSCocoaErrorDomain" &&
      Number(error.code()) === 516
    ) {
      var err2 = MOPointer.alloc().init();
      fileManager.replaceItemAtURL_withItemAtURL_backupItemName_options_resultingItemURL_error(
        NSURL.fileURLWithPath(newPath),
        NSURL.fileURLWithPath(oldPath),
        null,
        NSFileManagerItemReplacementUsingNewMetadataOnly,
        null,
        err2
      );
      if (err2.value() !== null) {
        throw fsErrorForPath(oldPath, undefined, err2.value());
      }
    } else {
      throw fsErrorForPath(oldPath, undefined, error);
    }
  }
};

module.exports.rmdir = NOT_IMPLEMENTED("rmdir");

module.exports.rmdirSync = function(path) {
  var err = MOPointer.alloc().init();
  var fileManager = NSFileManager.defaultManager();
  var isDirectory = module.exports.lstatSync(path).isDirectory();
  if (!isDirectory) {
    throw fsError("ENOTDIR", {
      path: path,
      syscall: "rmdir"
    });
  }
  fileManager.removeItemAtPath_error(path, err);

  if (err.value() !== null) {
    throw fsErrorForPath(path, true, err.value(), "rmdir");
  }
};

module.exports.stat = NOT_IMPLEMENTED("stat");

// the only difference with lstat is that we resolve symlinks
//
// > lstat() is identical to stat(), except that if pathname is a symbolic
// > link, then it returns information about the link itself, not the file
// > that it refers to.
// http://man7.org/linux/man-pages/man2/lstat.2.html
module.exports.statSync = function(path) {
  return module.exports.lstatSync(module.exports.realpathSync(path));
};

module.exports.symlink = NOT_IMPLEMENTED("symlink");

module.exports.symlinkSync = function(target, path) {
  var err = MOPointer.alloc().init();
  var fileManager = NSFileManager.defaultManager();
  var result = fileManager.createSymbolicLinkAtPath_withDestinationPath_error(
    path,
    target,
    err
  );

  if (err.value() !== null) {
    throw new Error(err.value());
  }
};

module.exports.truncate = NOT_IMPLEMENTED("truncate");

module.exports.truncateSync = function(path, len) {
  var hFile = NSFileHandle.fileHandleForUpdatingAtPath(sFilePath);
  hFile.truncateFileAtOffset(len || 0);
  hFile.closeFile();
};

module.exports.unlink = NOT_IMPLEMENTED("unlink");

module.exports.unlinkSync = function(path) {
  var err = MOPointer.alloc().init();
  var fileManager = NSFileManager.defaultManager();
  var isDirectory = module.exports.lstatSync(path).isDirectory();
  if (isDirectory) {
    throw fsError("EPERM", {
      path: path,
      syscall: "unlink"
    });
  }
  var result = fileManager.removeItemAtPath_error(path, err);

  if (err.value() !== null) {
    throw fsErrorForPath(path, false, err.value());
  }
};

module.exports.unwatchFile = NOT_IMPLEMENTED("unwatchFile");

module.exports.utimes = NOT_IMPLEMENTED("utimes");

module.exports.utimesSync = function(path, aTime, mTime) {
  var err = MOPointer.alloc().init();
  var fileManager = NSFileManager.defaultManager();
  var result = fileManager.setAttributes_ofItemAtPath_error(
    {
      NSFileModificationDate: aTime
    },
    path,
    err
  );

  if (err.value() !== null) {
    throw fsErrorForPath(path, undefined, err.value());
  }
};

module.exports.watch = NOT_IMPLEMENTED("watch");
module.exports.watchFile = NOT_IMPLEMENTED("watchFile");

module.exports.write = NOT_IMPLEMENTED("write");

module.exports.writeFile = NOT_IMPLEMENTED("writeFile");

module.exports.writeFileSync = function(path, data, options) {
  var encoding = encodingFromOptions(options, "utf8");

  var nsdata = Buffer.from(
    data,
    encoding === "NSData" || encoding === "buffer" ? undefined : encoding
  ).toNSData();

  nsdata.writeToFile_atomically(path, true);
};

module.exports.writeSync = NOT_IMPLEMENTED("writeSync");


/***/ }),

/***/ "../../../node_modules/@skpm/fs/utils.js":
/*!**************************************************!*\
  !*** /Users/luke/node_modules/@skpm/fs/utils.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports.parseStat = function parseStat(result) {
  return {
    dev: String(result.NSFileDeviceIdentifier),
    // ino: 48064969, The file system specific "Inode" number for the file.
    mode: result.NSFileType | result.NSFilePosixPermissions,
    nlink: Number(result.NSFileReferenceCount),
    uid: String(result.NSFileOwnerAccountID),
    gid: String(result.NSFileGroupOwnerAccountID),
    // rdev: 0, A numeric device identifier if the file is considered "special".
    size: Number(result.NSFileSize),
    // blksize: 4096, The file system block size for i/o operations.
    // blocks: 8, The number of blocks allocated for this file.
    atimeMs:
      Number(result.NSFileModificationDate.timeIntervalSince1970()) * 1000,
    mtimeMs:
      Number(result.NSFileModificationDate.timeIntervalSince1970()) * 1000,
    ctimeMs:
      Number(result.NSFileModificationDate.timeIntervalSince1970()) * 1000,
    birthtimeMs:
      Number(result.NSFileCreationDate.timeIntervalSince1970()) * 1000,
    atime: new Date(
      Number(result.NSFileModificationDate.timeIntervalSince1970()) * 1000 + 0.5
    ), // the 0.5 comes from the node source. Not sure why it's added but in doubt...
    mtime: new Date(
      Number(result.NSFileModificationDate.timeIntervalSince1970()) * 1000 + 0.5
    ),
    ctime: new Date(
      Number(result.NSFileModificationDate.timeIntervalSince1970()) * 1000 + 0.5
    ),
    birthtime: new Date(
      Number(result.NSFileCreationDate.timeIntervalSince1970()) * 1000 + 0.5
    ),
    isBlockDevice: function() {
      return result.NSFileType === NSFileTypeBlockSpecial;
    },
    isCharacterDevice: function() {
      return result.NSFileType === NSFileTypeCharacterSpecial;
    },
    isDirectory: function() {
      return result.NSFileType === NSFileTypeDirectory;
    },
    isFIFO: function() {
      return false;
    },
    isFile: function() {
      return result.NSFileType === NSFileTypeRegular;
    },
    isSocket: function() {
      return result.NSFileType === NSFileTypeSocket;
    },
    isSymbolicLink: function() {
      return result.NSFileType === NSFileTypeSymbolicLink;
    }
  };
};

var ERRORS = {
  EPERM: {
    message: "operation not permitted",
    errno: -1
  },
  ENOENT: {
    message: "no such file or directory",
    errno: -2
  },
  EACCES: {
    message: "permission denied",
    errno: -13
  },
  ENOTDIR: {
    message: "not a directory",
    errno: -20
  },
  EISDIR: {
    message: "illegal operation on a directory",
    errno: -21
  }
};

function fsError(code, options) {
  var error = new Error(
    code +
      ": " +
      ERRORS[code].message +
      ", " +
      (options.syscall || "") +
      (options.path ? " '" + options.path + "'" : "")
  );

  Object.keys(options).forEach(function(k) {
    error[k] = options[k];
  });

  error.code = code;
  error.errno = ERRORS[code].errno;

  return error;
}

module.exports.fsError = fsError;

module.exports.fsErrorForPath = function fsErrorForPath(
  path,
  shouldBeDir,
  err,
  syscall
) {
  var fileManager = NSFileManager.defaultManager();
  var doesExist = fileManager.fileExistsAtPath(path);
  if (!doesExist) {
    return fsError("ENOENT", {
      path: path,
      syscall: syscall || "open"
    });
  }
  var isReadable = fileManager.isReadableFileAtPath(path);
  if (!isReadable) {
    return fsError("EACCES", {
      path: path,
      syscall: syscall || "open"
    });
  }
  if (typeof shouldBeDir !== "undefined") {
    var isDirectory = module.exports.lstatSync(path).isDirectory();
    if (isDirectory && !shouldBeDir) {
      return fsError("EISDIR", {
        path: path,
        syscall: syscall || "read"
      });
    } else if (!isDirectory && shouldBeDir) {
      return fsError("ENOTDIR", {
        path: path,
        syscall: syscall || "read"
      });
    }
  }
  return new Error(err || "Unknown error while manipulating " + path);
};

module.exports.encodingFromOptions = function encodingFromOptions(
  options,
  defaultValue
) {
  return options && options.encoding
    ? String(options.encoding)
    : options
    ? String(options)
    : defaultValue;
};

module.exports.NOT_IMPLEMENTED = function NOT_IMPLEMENTED(name) {
  return function() {
    throw new Error(
      "fs." +
        name +
        " is not implemented yet. If you feel like implementing it, any contribution will be gladly accepted on https://github.com/skpm/fs"
    );
  };
};


/***/ }),

/***/ "../../../node_modules/@skpm/path/index.js":
/*!****************************************************!*\
  !*** /Users/luke/node_modules/@skpm/path/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var sketchSpecifics = __webpack_require__(/*! ./sketch-specifics */ "../../../node_modules/@skpm/path/sketch-specifics.js")

// we only expose the posix implementation since Sketch only runs on macOS

var CHAR_FORWARD_SLASH = 47
var CHAR_DOT = 46

// Resolves . and .. elements in a path with directory names
function normalizeString(path, allowAboveRoot) {
  var res = ''
  var lastSegmentLength = 0
  var lastSlash = -1
  var dots = 0
  var code
  for (var i = 0; i <= path.length; i += 1) {
    if (i < path.length) code = path.charCodeAt(i)
    else if (code === CHAR_FORWARD_SLASH) break
    else code = CHAR_FORWARD_SLASH
    if (code === CHAR_FORWARD_SLASH) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (
          res.length < 2 ||
          lastSegmentLength !== 2 ||
          res.charCodeAt(res.length - 1) !== CHAR_DOT ||
          res.charCodeAt(res.length - 2) !== CHAR_DOT
        ) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/')
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = ''
                lastSegmentLength = 0
              } else {
                res = res.slice(0, lastSlashIndex)
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/')
              }
              lastSlash = i
              dots = 0
              continue
            }
          } else if (res.length === 2 || res.length === 1) {
            res = ''
            lastSegmentLength = 0
            lastSlash = i
            dots = 0
            continue
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0) res += '/..'
          else res = '..'
          lastSegmentLength = 2
        }
      } else {
        if (res.length > 0) res += '/' + path.slice(lastSlash + 1, i)
        else res = path.slice(lastSlash + 1, i)
        lastSegmentLength = i - lastSlash - 1
      }
      lastSlash = i
      dots = 0
    } else if (code === CHAR_DOT && dots !== -1) {
      ++dots
    } else {
      dots = -1
    }
  }
  return res
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root
  var base =
    pathObject.base || (pathObject.name || '') + (pathObject.ext || '')
  if (!dir) {
    return base
  }
  if (dir === pathObject.root) {
    return dir + base
  }
  return dir + sep + base
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = ''
    var resolvedAbsolute = false
    var cwd

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i -= 1) {
      var path
      if (i >= 0) {
        path = arguments[i]
      } else {
        if (cwd === undefined) {
          cwd = posix.dirname(sketchSpecifics.cwd())
        }
        path = cwd
      }

      path = sketchSpecifics.getString(path, 'path')

      // Skip empty entries
      if (path.length === 0) {
        continue
      }

      resolvedPath = path + '/' + resolvedPath
      resolvedAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute)

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0) return '/' + resolvedPath
      else return '/'
    } else if (resolvedPath.length > 0) {
      return resolvedPath
    } else {
      return '.'
    }
  },

  normalize: function normalize(path) {
    path = sketchSpecifics.getString(path, 'path')

    if (path.length === 0) return '.'

    var isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH
    var trailingSeparator =
      path.charCodeAt(path.length - 1) === CHAR_FORWARD_SLASH

    // Normalize the path
    path = normalizeString(path, !isAbsolute)

    if (path.length === 0 && !isAbsolute) path = '.'
    if (path.length > 0 && trailingSeparator) path += '/'

    if (isAbsolute) return '/' + path
    return path
  },

  isAbsolute: function isAbsolute(path) {
    path = sketchSpecifics.getString(path, 'path')
    return path.length > 0 && path.charCodeAt(0) === CHAR_FORWARD_SLASH
  },

  join: function join() {
    if (arguments.length === 0) return '.'
    var joined
    for (var i = 0; i < arguments.length; i += 1) {
      var arg = arguments[i]
      arg = sketchSpecifics.getString(arg, 'path')
      if (arg.length > 0) {
        if (joined === undefined) joined = arg
        else joined += '/' + arg
      }
    }
    if (joined === undefined) return '.'
    return posix.normalize(joined)
  },

  relative: function relative(from, to) {
    from = sketchSpecifics.getString(from, 'from path')
    to = sketchSpecifics.getString(to, 'to path')

    if (from === to) return ''

    from = posix.resolve(from)
    to = posix.resolve(to)

    if (from === to) return ''

    // Trim any leading backslashes
    var fromStart = 1
    for (; fromStart < from.length; fromStart += 1) {
      if (from.charCodeAt(fromStart) !== CHAR_FORWARD_SLASH) break
    }
    var fromEnd = from.length
    var fromLen = fromEnd - fromStart

    // Trim any leading backslashes
    var toStart = 1
    for (; toStart < to.length; toStart += 1) {
      if (to.charCodeAt(toStart) !== CHAR_FORWARD_SLASH) break
    }
    var toEnd = to.length
    var toLen = toEnd - toStart

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen
    var lastCommonSep = -1
    var i = 0
    for (; i <= length; i += 1) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === CHAR_FORWARD_SLASH) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1)
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i)
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === CHAR_FORWARD_SLASH) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0
          }
        }
        break
      }
      var fromCode = from.charCodeAt(fromStart + i)
      var toCode = to.charCodeAt(toStart + i)
      if (fromCode !== toCode) break
      else if (fromCode === CHAR_FORWARD_SLASH) lastCommonSep = i
    }

    var out = ''
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; i += 1) {
      if (i === fromEnd || from.charCodeAt(i) === CHAR_FORWARD_SLASH) {
        if (out.length === 0) out += '..'
        else out += '/..'
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0) return out + to.slice(toStart + lastCommonSep)
    else {
      toStart += lastCommonSep
      if (to.charCodeAt(toStart) === CHAR_FORWARD_SLASH) toStart += 1
      return to.slice(toStart)
    }
  },

  toNamespacedPath: function toNamespacedPath(path) {
    // Non-op on posix systems
    return path
  },

  dirname: function dirname(path) {
    path = sketchSpecifics.getString(path, 'path')
    if (path.length === 0) return '.'
    var code = path.charCodeAt(0)
    var hasRoot = code === CHAR_FORWARD_SLASH
    var end = -1
    var matchedSlash = true
    for (var i = path.length - 1; i >= 1; i -= 1) {
      code = path.charCodeAt(i)
      if (code === CHAR_FORWARD_SLASH) {
        if (!matchedSlash) {
          end = i
          break
        }
      } else {
        // We saw the first non-path separator
        matchedSlash = false
      }
    }

    if (end === -1) return hasRoot ? '/' : '.'
    if (hasRoot && end === 1) return '//'
    return path.slice(0, end)
  },

  basename: function basename(path, ext) {
    if (ext !== undefined)
      ext = sketchSpecifics.getString(ext, 'ext')
    path = sketchSpecifics.getString(path, 'path')

    var start = 0
    var end = -1
    var matchedSlash = true
    var i

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return ''
      var extIdx = ext.length - 1
      var firstNonSlashEnd = -1
      for (i = path.length - 1; i >= 0; i -= 1) {
        var code = path.charCodeAt(i)
        if (code === CHAR_FORWARD_SLASH) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            start = i + 1
            break
          }
        } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false
            firstNonSlashEnd = i + 1
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1
              end = firstNonSlashEnd
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd
      else if (end === -1) end = path.length
      return path.slice(start, end)
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            start = i + 1
            break
          }
        } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false
          end = i + 1
        }
      }

      if (end === -1) return ''
      return path.slice(start, end)
    }
  },

  extname: function extname(path) {
    path = sketchSpecifics.getString(path, 'path')
    var startDot = -1
    var startPart = 0
    var end = -1
    var matchedSlash = true
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i)
      if (code === CHAR_FORWARD_SLASH) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1
          break
        }
        continue
      }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false
        end = i + 1
      }
      if (code === CHAR_DOT) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1) startDot = i
        else if (preDotState !== 1) preDotState = 1
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1
      }
    }

    if (
      startDot === -1 ||
      end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)
    ) {
      return ''
    }
    return path.slice(startDot, end)
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new Error('pathObject should be an Object')
    }
    return _format('/', pathObject)
  },

  parse: function parse(path) {
    path = sketchSpecifics.getString(path, 'path')

    var ret = { root: '', dir: '', base: '', ext: '', name: '' }
    if (path.length === 0) return ret
    var code = path.charCodeAt(0)
    var isAbsolute = code === CHAR_FORWARD_SLASH
    var start
    if (isAbsolute) {
      ret.root = '/'
      start = 1
    } else {
      start = 0
    }
    var startDot = -1
    var startPart = 0
    var end = -1
    var matchedSlash = true
    var i = path.length - 1

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i)
      if (code === CHAR_FORWARD_SLASH) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1
          break
        }
        continue
      }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false
        end = i + 1
      }
      if (code === CHAR_DOT) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1) startDot = i
        else if (preDotState !== 1) preDotState = 1
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1
      }
    }

    if (
      startDot === -1 ||
      end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)
    ) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute)
          ret.base = ret.name = path.slice(1, end)
        else ret.base = ret.name = path.slice(startPart, end)
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot)
        ret.base = path.slice(1, end)
      } else {
        ret.name = path.slice(startPart, startDot)
        ret.base = path.slice(startPart, end)
      }
      ret.ext = path.slice(startDot, end)
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1)
    else if (isAbsolute) ret.dir = '/'

    return ret
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null,

  resourcePath: sketchSpecifics.resourcePath,
}

module.exports = posix
module.exports.posix = posix


/***/ }),

/***/ "../../../node_modules/@skpm/path/sketch-specifics.js":
/*!***************************************************************!*\
  !*** /Users/luke/node_modules/@skpm/path/sketch-specifics.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var util = __webpack_require__(/*! util */ "util")

module.exports.getString = function getString(path, argumentName) {
  if (!util.isString(path)) {
    // let's make a special case for NSURL
    if (util.getNativeClass(path) === 'NSURL') {
      return String(path.path().copy())
    }
    throw new Error(argumentName + ' should be a string. Got ' + typeof path + ' instead.')
  }
  return String(path)
}

module.exports.cwd = function cwd() {
  if (typeof __command !== 'undefined' && __command.script() && __command.script().URL()) {
    return String(__command.script().URL().path().copy())
  }
  return String(MSPluginManager.defaultPluginURL().path().copy())
}

module.exports.resourcePath = function resourcePath(resourceName) {
  if (typeof __command === 'undefined' || !__command.pluginBundle()) {
    return undefined
  }
  var resource = __command.pluginBundle().urlForResourceNamed(resourceName)
  if (!resource) {
    return undefined
  }
  return String(resource.path())
}


/***/ }),

/***/ "./src/my-command.js":
/*!***************************!*\
  !*** ./src/my-command.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var sketch_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sketch/ui */ "sketch/ui");
/* harmony import */ var sketch_ui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sketch_ui__WEBPACK_IMPORTED_MODULE_0__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// require("@babel/polyfill");
var sketch = __webpack_require__(/*! sketch */ "sketch");

var Document = __webpack_require__(/*! sketch/dom */ "sketch/dom").Document;

var document = Document.getSelectedDocument();

var Shape = __webpack_require__(/*! sketch/dom */ "sketch/dom").Shape;

var Text = __webpack_require__(/*! sketch/dom */ "sketch/dom").Text;

var Group = __webpack_require__(/*! sketch/dom */ "sketch/dom").Group;


var page = MSDocument.currentDocument().currentPage();

var fs = __webpack_require__(/*! @skpm/fs */ "../../../node_modules/@skpm/fs/index.js");

var path = __webpack_require__(/*! @skpm/path */ "../../../node_modules/@skpm/path/index.js");

var home = __webpack_require__(/*! os */ "os").homedir();

var doc = context.document;
var folderName = "".concat(new Date().toISOString().replace(/[^0-9]/g, ""), "_").concat(doc.fileURL().path().lastPathComponent().replace('.sketch', ''));
var exportPath = "".concat(home, "/SketchJSON/").concat(folderName, "/");
var texts = [];
var paints = [];
var shadows = [];
var blurs = [];
var output = {}; //NewsKit Constants

var DEFAULT_FONT_SIZE = 16;
var gridSize = 4;
var colorPalette = {};
var crops = {}; // When we run the plugin.

/* harmony default export */ __webpack_exports__["default"] = (function () {
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
  var shapeDefault = findArtboardsNamed("02 Theme defaults/04 Shape/borderRadiusDefault")[0].layers()[0].cornerRadiusString() + 'px';
  var BORDER_RADIUS = {
    "borderRadiusDefault": shapeDefault
  }; //=====================
  // Color Primitives
  //=====================

  /* Get the primitive colors that form all the foundations */

  var colorStyles = getSharedStyles(0).filter(function (style) {
    return style.name().includes('ExtendedPalette') && !style.name().includes('border');
  });
  colorStyles.forEach(function (style) {
    var value;
    var name = style.name().split('/')[style.name().split('/').length - 1];
    var fills = style.style().fills();

    if (!fills.length) {
      value = "transparent";
    } else {
      var fill = fills[0];

      if (fill.fillType() == 0) {
        value = MSColorToRGBA(fill.color());
      } else {
        //gradients.push({'name':name,'gradient':fill.gradient()})
        value = parseGradient(fill.gradient());
      }
    }

    colorPalette[name] = value;
  });
  /* Get the theme colors */
  //Filter out styles that aren't fills.

  var regex = RegExp('(0[12345])', 'g');
  var themeColors = getSharedStyles(0).filter(function (style) {
    return style.name().split('/')[0] && !style.name().includes('border') && !style.name().includes('Shadows') && !style.name().includes('Overlays') && !style.name().includes('Images') && !style.name().includes('ExtendedPalette');
  });
  var outputThemeColors = {};
  themeColors.forEach(function (style) {
    var value;
    var name = style.name().split('/')[style.name().split('/').length - 1];
    var fills = style.style().fills();

    if (!fills.length) {
      value = "transparent";
    } else {
      var fill = fills[0];

      if (fill.fillType() == 0) {
        value = getPrimitiveFromColor(fill.color(), name);
      } else {
        value = parseGradient(fill.gradient());
      }
    }

    outputThemeColors[name] = "{{colors.".concat(value, "}}");
  });

  function getPrimitiveFromColor(color, name) {
    var c = MSColorToRGBA(color);
    var prim = getKeyByValue(colorPalette, c);
    return prim;
  }

  function getKeyByValue(object, value) {
    return Object.keys(object).find(function (key) {
      return object[key] === value;
    });
  } ///=====================
  // Blurs and Shadows
  ///////////////////////


  var shadowsOutput = {};
  var shadowStyles = getSharedStyles(0).filter(function (style) {
    return style.name().includes('Shadows');
  });
  shadowStyles.forEach(function (style) {
    var tokenName = style.name().split('/')[1];
    var layer = new Shape({
      name: 'my shape',
      style: style.style(),
      parent: page
    });
    var predicate = NSPredicate.predicateWithFormat("objectID == %@", layer.id);
    var result = page.children().filteredArrayUsingPredicate(predicate);
    var shadowLayer = result[0];
    var shadow = shadowLayer.CSSAttributes()[1].replace('box-shadow: ', '');
    layer.remove();
    shadowsOutput[tokenName] = "".concat(shadow);
  });
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

  var blurStyles = getSharedStyles(0).filter(function (style) {
    return style.style().blur().isEnabled() == 1 && !style.name().includes('border');
  });
  blurStyles.forEach(function (style) {
    var inp = style.style().blur();
    var o = {};
    o.type = "EFFECT"; //Need a better Naming System here...

    o.name = 'Blur/' + style.name();
    o.effects = [];
    var e = {};

    switch (inp.type()) {
      case 0:
        e.type = "LAYER_BLUR";
        break;

      case 1:
        console.warn('Motion Blurs are unsupported by Figma');
        break;

      case 2:
        console.warn('Zoom Blurs are unsupported by Figma');
        break;

      case 3:
        e.type = "BACKGROUND_BLUR";
        break;
    }

    e.visible = true;
    e.radius = inp.radius(); //Saturation is not yet supported for background blurs in Figma..
    //inp.saturation() ? e.saturation = inp.saturation() : null

    o.effects.push(e);
    blurs.push(o);
  }); //=====================
  /// Overlays
  //=====================

  var overlayStyles = getSharedStyles(0).filter(function (style) {
    return style.name().includes('Overlays') && !style.name().includes('border');
  });
  var overlaysOutput = {};
  overlayStyles.forEach(function (style) {
    var value;
    var name = style.name().split('/')[style.name().split('/').length - 1];
    var fills = style.style().fills();

    if (!fills.length) {
      value = "transparent";
    } else {
      var fill = fills[0];

      if (fill.fillType() == 0) {
        value = MSColorToRGBA(fill.color());
      } else {
        //gradients.push({'name':name,'gradient':fill.gradient()})
        value = parseGradient(fill.gradient());
      }
    }

    overlaysOutput[name] = value;
  }); //==============================================

  /*Text Styles*/
  //Newskit defaults, if a brand's using letter spacing that isnt covered here, they're making everyone's life difficult.

  var LETTER_SPACING = {
    "fontLetterSpacing010": -0.5,
    "fontLetterSpacing020": -0.25,
    "fontLetterSpacing030": 0,
    "fontLetterSpacing040": 0.25,
    "fontLetterSpacing050": 0.5,
    "fontLetterSpacing060": 0.75,
    "fontLetterSpacing070": 1
  }; // A lot of this stuff could probably be removed... but its useful if we ever wanted to define font-families properly.
  //From @airbnb/react-sketch
  //Sketch gives a float for fontWeight, 

  var FONT_WEIGHTS = {
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
    '900': 0.62
  }; //Extract out only CSS numbers

  var FONT_WEIGHTS_NUMBER = {
    '-0.8': '100',
    '-0.6': '200',
    '-0.4': '300',
    '0': '400',
    '0.23': '500',
    '0.3': '600',
    '0.4': '700',
    '0.56': '800',
    '0.62': '900'
  }; //Map CSS font-weight to a NewsKit token

  var fontWeightTokens = {
    'fontWeight010': '100',
    'fontWeight020': '200',
    'fontWeight030': '300',
    'fontWeight040': '400',
    'fontWeight050': '500',
    'fontWeight060': '600',
    'fontWeight070': '700',
    'fontWeight080': '800',
    'fontWeight090': '900'
  }; //from @airbnb/react-sketch
  //Return booleans of font-style and font-stretch

  var isItalicFont = function isItalicFont(font) {
    var traits = font.fontDescriptor().objectForKey(NSFontTraitsAttribute);
    var symbolicTraits = traits[NSFontSymbolicTrait].unsignedIntValue();
    return (symbolicTraits & NSFontItalicTrait) !== 0;
  };

  var isCondensedFont = function isCondensedFont(font) {
    var traits = font.fontDescriptor().objectForKey(NSFontTraitsAttribute);
    var symbolicTraits = traits[NSFontSymbolicTrait].unsignedIntValue();
    return (symbolicTraits & NSFontCondensedTrait) !== 0;
  };

  var weightOfFont = function weightOfFont(font) {
    var traits = font.fontDescriptor().objectForKey(NSFontTraitsAttribute);
    var weight = traits[NSFontWeightTrait].doubleValue();

    if (weight === 0.0) {
      var weights = Object.keys(FONT_WEIGHTS);
      var fontName = String(font.fontName()).toLowerCase();
      var matchingWeight = weights.find(function (w) {
        return fontName.endsWith(w);
      });

      if (matchingWeight) {
        return FONT_WEIGHTS[matchingWeight];
      }
    }

    return weight;
  };

  var textStyles = getSharedStyles(1);
  textStyles = textStyles.filter(function (style) {
    return style.name().includes('inkBase') && document.getSharedTextStyleWithID(style.objectID()).style.alignment == 'left';
  });
  var fontSizesArr = [];
  var lineHeightsArr = [];
  var fontWeightsArr = [];
  var fontFamiliesArr = [];
  var fontFiles = new Set(); //Establish all the primitive values

  textStyles.forEach(function (style) {
    //Sketch has values in different places
    var textStyle = document.getSharedTextStyleWithID(style.objectID()).style;
    var font = style.value().primitiveTextStyle().attributes()[NSFont]; //Font Family
    //fontFamiliesArr.push(font.familyName()) -- "The Sun way of doing things"

    fontFamiliesArr.push(font.fontName()); // "The Times way"
    //Font Size

    var fontSizePx = textStyle.fontSize;
    fontSizesArr.push(fontSizePx / DEFAULT_FONT_SIZE);
    var lineHeight = textStyle.lineHeight; //Actual LineHeight(px) test against this to get a rem value

    var adjLineHeight = 0;
    var outputRem = 0;
    var inc = 1 / 24; // Catch eighths and sixths

    for (var rem = 1; rem <= 4; rem += inc) {
      var estLineHeight = rem * fontSizePx; //from: ncu-newskit/src/utils/font-sizing.ts 

      var adjLineHeight = Math.round(estLineHeight * fontSizePx / gridSize) * gridSize / fontSizePx;

      if (adjLineHeight == lineHeight) {
        outputRem = Number(rem.toFixed(4)); //If the lineHeight (rem) matches up to the value after rounding to gridSize 

        lineHeightsArr.push(outputRem);
        break;
      }

      if (rem == 4) {
        console.error("Couldn't find a line height (probably not a multiple of gridSize)", fontSizePx, lineHeight);
      }
    }

    var w = FONT_WEIGHTS_NUMBER["".concat(weightOfFont(font))];

    if (fontWeightsArr.indexOf(w) < 0) {
      fontWeightsArr.push(w);
    }
  }); //The output Object

  var fonts = {
    fontFamily: {}
  }; //used for value lookups. Not the tidiest method..

  var textPrimitives = {
    fontFamily: {},
    fontSize: {},
    lineHeight: {},
    fontWeight: {},
    fontLetterSpacing: {}
  };
  fontWeightsArr = fontWeightsArr.unique().sort();
  fontSizesArr = fontSizesArr.unique().sort();
  lineHeightsArr = lineHeightsArr.unique().sort();
  fontFamiliesArr = fontFamiliesArr.unique().sort();
  fontFamiliesArr.forEach(function (fam, idx) {
    var cfg = getCropsForFontFamily(fam);
    var tokenName = 'fontFamily' + (idx + 1);
    console.log(cfg);
    fonts['fontFamily'][tokenName] = {
      'fontFamily': "".concat(cfg.family),
      'cropConfig': {}
    };
    fonts['fontFamily'][tokenName]['cropConfig'] = {
      'top': cfg.top,
      'bottom': cfg.bottom,
      'defaultLineHeight': cfg.defaultLineHeight
    };
  });

  function getCropsForFontFamily(fontFamily) {
    var family = fontFamily;
    var size = DEFAULT_FONT_SIZE; //16px = 1rem
    //Create a new text layer, we use capital T to get the cap height. 

    var text = new Text({
      text: "T",
      parent: page
    }); //Get an actual layer for that text layer, and not just a text object.

    var predicate = NSPredicate.predicateWithFormat("objectID == %@", text.id);
    var result = page.children().filteredArrayUsingPredicate(predicate);
    var textLayer = result[0]; //Set the styles

    textLayer.fontPostscriptName = family;
    textLayer.fontSize = size; //Get the default line height

    var defaultLineHeight = getDefaultLineHeightForFont(textLayer.fontPostscriptName(), textLayer.fontSize());
    var defaultLineHeightEm = defaultLineHeight / size;
    var bounds = textLayer.pathInFrame().bounds();
    var t = -bounds.origin.y / size;
    var b = -(defaultLineHeight - bounds.size.height - bounds.origin.y) / size;
    text.remove(); //Delete the temporary layer.

    crops[fontFamily] = {
      'top': t,
      'bottom': b,
      'defaultLineHeight': defaultLineHeightEm
    };
    return {
      'family': fontFamily,
      'top': t,
      'bottom': b,
      'defaultLineHeight': defaultLineHeightEm
    };
  }

  function getDefaultLineHeightForFont(fontFamily, size) {
    var font = NSFont.fontWithName_size(fontFamily, size);
    var lm = NSLayoutManager.alloc().init();
    return lm.defaultLineHeightForFont(font);
  }

  fontWeightsArr.forEach(function (value, index) {
    var tokenName = 'fontWeight' + tokenFormat(index + 1); //Commented out, tokens all just sit under a {{font}} object..

    textPrimitives['fontWeight'][tokenName] = "".concat(value);
    fonts[tokenName] = "".concat(value);
  });
  fontSizesArr.forEach(function (value, index) {
    var tokenName = 'fontSize' + tokenFormat(index + 1);
    textPrimitives['fontSize'][tokenName] = value;
    fonts[tokenName] = "".concat(value, "rem");
  });
  lineHeightsArr.forEach(function (value, index) {
    var tokenName = 'fontlineHeight' + tokenFormat(index + 1);
    textPrimitives['lineHeight'][tokenName] = value;
    fonts[tokenName] = "".concat(value);
  });
  textPrimitives['fontLetterSpacing'] = LETTER_SPACING;
  fonts = _objectSpread(_objectSpread({}, fonts), LETTER_SPACING); // fontLetterSpacing.forEach((value, index) => {
  //   let tokenName = 'fontLetterSpacing' + tokenFormat(index + 1)
  //   textPrimitives['fontLetterSpacing'][tokenName] = value
  // })

  var textStylesOutput = {};
  textStyles.forEach(function (style) {
    //output object
    var o = {};
    var cropProps = {}; //Get the token name for the text styles

    var n = style.name().split('/')[1]; //Sketch has values in different places

    var textStyle = document.getSharedTextStyleWithID(style.objectID()).style;
    var font = style.value().primitiveTextStyle().attributes()[NSFont]; //Export the files used in the styles.

    fontFiles.add(path.resolve(font.fileURL().path())); //Size

    var fontSizePx = textStyle.fontSize;
    o.fontSize = "{{fonts.".concat(textPrimitives.fontSize.getKeyByValue(textStyle.fontSize / DEFAULT_FONT_SIZE), "}}");
    cropProps.size = textStyle.fontSize / DEFAULT_FONT_SIZE; //lineHeight - Rounded to grid size

    var lineHeightPx = textStyle.lineHeight;
    Object.entries(textPrimitives.lineHeight).forEach(function (lineHeight) {
      var estLineHeight = lineHeight[1]; //from: ncu-newskit/src/utils/font-sizing.ts 

      var adjLineHeightPx = Math.round(estLineHeight * fontSizePx / gridSize) * gridSize;

      if (adjLineHeightPx == lineHeightPx) {
        o.lineHeight = "{{fonts.".concat(lineHeight[0], "}");
        cropProps.lineHeight = adjLineHeightPx / DEFAULT_FONT_SIZE;
      }
    }); // o.fontFamily = textPrimitives.fontFamily.getKeyByValue(`${font.fontName()}`) //e.g 'The Sun'
    // //o.typeName = `${font.typeName()}` // e.g 'Heavy Narrow'
    //Font Family

    var familyObj = Object.values(fonts.fontFamily).find(function (item) {
      return item.fontFamily === "".concat(font.fontName());
    });
    var familyKey = fonts.fontFamily.getKeyByValue(familyObj);
    o.fontFamily = "{{fonts.".concat(familyKey, "}}");
    var w = FONT_WEIGHTS_NUMBER["".concat(weightOfFont(font))];
    o.fontWeight = "{{fonts.".concat(textPrimitives.fontWeight.getKeyByValue(w), "}}"); //Useful Stuff for if we want to do font families the 'right' way
    // o.fontStretch = isCondensedFont(font) ? 'condensed' : 'normal'
    // o.fontStyle = isItalicFont(font) ? 'italic' : 'normal'
    // o.textDecorationLine = textStyle.textUnderline ? 'underline' : 'none'

    var kerning = textStyle.kerning || 0;
    o.fontLetterSpacing = "{{fonts.".concat(textPrimitives.fontLetterSpacing.getKeyByValue(kerning), "}}"); //Calculate the font cropping

    var cc = crops["".concat(font.fontName())];
    var deltaLineHeight = cropProps.lineHeight - cc.defaultLineHeight; // o.cropConfig = {}
    // console.log(cc.top, cc.bottom, deltaLineHeight, cropProps.lineHeight, cc.defaultLineHeight)
    // let top = parseFloat(cc.top) - parseFloat(deltaLineHeight/2)
    // let bottom = parseFloat(cc.bottom) - parseFloat(deltaLineHeight/2)
    // o.cropConfig.cropTop = `${top}`
    // o.cropConfig.cropBottom =  `${bottom}`

    textStylesOutput[n] = o; //Add the token to the output
  });
  exportFiles();

  function exportFiles() {
    if (!fs.existsSync(exportPath)) {
      fs.mkdirSync(exportPath);
    }

    if (!fs.existsSync(exportPath + '/fonts')) {
      fs.mkdirSync(exportPath + '/fonts');
    } //Copy all the fonts


    fontFiles.forEach(function (file) {
      try {
        fs.copyFileSync(file, exportPath + 'fonts/' + path.basename(file));
      } catch (err) {
        console.error(err);
      }
    });

    try {
      fs.writeFileSync(exportPath + 'fonts.json', prettifyJSON(fonts, 1));
    } catch (err) {
      console.error(err);
    } // // Colors are now wrapped into one colors.json file. So this code is no longer needed.
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
      fs.writeFileSync(exportPath + 'colors.json', prettifyJSON(_objectSpread(_objectSpread({}, colorPalette), outputThemeColors)));
    } catch (err) {
      console.error(err);
    }

    try {
      fs.writeFileSync(exportPath + 'text-styles.json', JSON.stringify(textStylesOutput, null, 4));
    } catch (err) {
      // An error occurred
      console.error(err);
    }

    try {
      fs.writeFileSync(exportPath + 'border-radius.json', JSON.stringify(BORDER_RADIUS, null, 4));
    } catch (err) {
      console.error(err);
    }

    try {
      fs.writeFileSync(exportPath + 'overlays.json', JSON.stringify(overlaysOutput, null, 4));
    } catch (err) {
      console.error(err);
    }

    try {
      fs.writeFileSync(exportPath + 'shadows.json', JSON.stringify(shadowsOutput, null, 4));
    } catch (err) {
      console.error(err);
    } //documentWindow.endSheet(mySheetWindow) //Remove the progress bar


    sketch.UI.message('Exported Styles to: ' + exportPath); //Tell the user where it exported to.
  }
}); //===================================================
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


function prettifyJSON(data, idx) {
  var idx = idx ? idx : 0;
  var str = JSON.stringify(data, '\n', 4);
  var arr = str.split('\n');
  var prevCat = null;
  arr.forEach(function (item, index) {
    var cat = splitWords(item)[idx];
    var cats = 0;

    if (prevCat !== cat && index != 1 && index != arr.length - 1) {
      cats++;

      if (cats >= 1) {
        arr[index - 1] += '\n';
        cats = 0;
      }
    }

    prevCat = cat;
  });
  str = arr.join('\n');
  return str;
}

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("buffer");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "sketch":
/*!*************************!*\
  !*** external "sketch" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch");

/***/ }),

/***/ "sketch/dom":
/*!*****************************!*\
  !*** external "sketch/dom" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/dom");

/***/ }),

/***/ "sketch/ui":
/*!****************************!*\
  !*** external "sketch/ui" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/ui");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })

/******/ });
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

//# sourceMappingURL=__my-command.js.map