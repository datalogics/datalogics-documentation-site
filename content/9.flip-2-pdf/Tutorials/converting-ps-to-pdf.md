---
title: Converting PostScript Files to PDF
---

JSON profile parameters:

:br

|                 |                                                                                                                                                                                                                                                                                                                                                                                                                              |   |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | - |
| downsample      | Set this value to “on” if you want to enable the ability to select a resolution value for downsampling graphics images in a PostScript file.:brdownsampling-dpiEnter a resolution value, in Dots per Inch, if you want to reduce the resolution of the graphics embedded in a PostScript file. This may result in a smaller PDF output document. The available options are 75, 150, 300, 600, and 1200. Defaults to 300 DPI. |   |
| compression     | Enter a compression method to use for graphics images in PostScript files. Enter jpeg or flate. Defaults to jpeg.                                                                                                                                                                                                                                                                                                            |   |
| rotate-pages    | Set this value to “all” to respect the “ViewingOrientation” setting in the PostScript file. Set this value to “none” to ignore the setting. This will affect the orientation of the pages in the PDF output.                                                                                                                                                                                                                 |   |
| pdf-output-type | Enter an output type, PDF, or use PDF/X-3 for graphics use. Defaults to PDF.                                                                                                                                                                                                                                                                                                                                                 |   |

:br

If you wanted to convert a PostScript file with embedded color images, reduce the resolution for these images to 600 DPI while using the default “jpeg” compression method, and save the PDF output documents as PDF/X files, the PostScript section of your JSON profile might look like this:

```js
{
 "postscript": {
 "color-images": {
 "downsample" : "on",
 "downsampling-dpi" : 600,
 }
 "pdf-output-type" : "PDF/X-3"
 }
}
```

If you weren’t planning to convert any PostScript files into PDF documents, you could leave the PostScript parameters out of your JSON profile.
