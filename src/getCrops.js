function getCrops(font, size, lineHeight) {
  fontConfig = font.cropConfig
  let LH = lineHeight * fontConfig.UPM
  let AD = fontConfig.yMax - fontConfig.yMin

  let L = LH - AD
  console.log(L)
  //Values in Font Units
   
  let bottom = -(AD - fontConfig.bottomCrop) - (L/2) -30
  let top = -(L/2 + fontConfig.topCrop) - 0

  cropTop = top/fontConfig.UPM
  cropBottom = bottom/fontConfig.UPM

  var crops = {}
  crops.cropTop = cropTop
  crops.cropBottom = cropBottom

 document.documentElement.style
    .setProperty('--fontFamily', font.fontFamily);
   document.documentElement.style
    .setProperty('--fontSize', size + 'px');
     document.documentElement.style
    .setProperty('--lineHeight', lineHeight + 'em');
   document.documentElement.style
    .setProperty('--topCrop', cropTop + 'em');
 document.documentElement.style
    .setProperty('--bottomCrop', cropBottom + 'em');
    
  return crops
  
}