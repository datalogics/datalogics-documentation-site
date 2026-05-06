---
title: Abort Results Output
---

_**Sample Results JSON File Output: Abort Results Output**_

This is what the JSON results report would look like if PDF Checker determines that the PDF source file is not in fact a PDF document at all, or if PDF Checker can’t open the file.

The first instance of the check will stop all further processing. Since PDF Checker is multi-threaded and doing multiple checks at once, the actual remaining checks that are not processed can vary when the signal is received. The check that triggered the abort is shown in the report below.

```js
{
   "analysis-summary": {
     "can-be-optimized": false,
     "date": "Mon Dec 5 12:08:07 2022",
     "errors": ["unable-to-open"],
     "information": [ ],
     "input": "C:\\path\\to\\input.pdf",
     "language": "None",
     "number-of-pages": 0,
     "pdf-checker-version": "2.2.0",
     "profile": "C:\\path\\to\\everything.json",
     "size-in-bytes": 3538813,
     "triggered-abort": "unable-to-open"
   },
   "cleanup-results": {
     "checks-aborted": [
       "suboptimal-compression"
   ],
   "checks-completed": [ ],
   "errors": { },
   "how-to-optimize": { },
   "information": { }
 },
 "color-images": {
   "checks-aborted": [
     "image-depth",
     "resolution-too-high",
     "resolution-too-low",
     "uses-jpeg2000-compression"
   ],
   "checks-completed": [ ],
   "errors": { },
   "how-to-optimize": { },
   "information": { }
 },
"fonts-results": {
   "checks-aborted": [
     "fontdescriptor-missing-capheight",
     "fontdescriptor-missing-fields",
     "uses-base14fonts-not-embedded",
     "uses-fonts-fully-embedded",
     "uses-fonts-not-embedded"
   ],
   "checks-completed": [ ],
   "errors": { },
   "how-to-optimize": { },
   "information": { }
 },
 "general-results": {
   "checks-aborted": [
     "born-digital"
     "claims-pdfa-conformance"
     "claims-pdfe-conformance"
     "claims-pdfua-conformance"
     "claims-pdfvt-conformance"
     "claims-pdfx-conformance"
     "contains-owner-password"
     "contains-signature"
     "damaged"
     "image-only"
     "password-protected"
     "pdf-v2"
     "xfa-type"
   ],
   "checks-completed": [
     "unable-to-open"
   ],
   "errors": {
     "unable-to-open": [
       "Cannot be opened/not valid PDF"
     ]
   },
   "how-to-optimize": { },
   "information": { }
 },
 "grayscale-images": {
   "checks-aborted": [
     "resolution-too-high",
     "resolution-too-low",
     "uses-jpeg2000-compression"
   ],
   "checks-completed": [ ],
   "errors": { },
   "how-to-optimize": { },
   "information": { }
 },
 "image-results": {
   "checks-aborted": [
     "alternate-images"
   ],
   "checks-completed": [ ],
   "errors": { },
   "how-to-optimize": { },
   "information": { }
 },
 "monochrome-images": {
   "checks-aborted": [
     "resolution-too-high",
     "resolution-too-low",
     "uses-jbig2-compression"
   ],
   "checks-completed": [ ],
   "errors": { },
   "how-to-optimize": { },
   "information": { }
 },
 "objects-results": {
   "checks-aborted": [
     "contains-javascript-actions",
     "contains-thumbnails"
   ],
   "checks-completed": [ ],
   "errors": { },
   "how-to-optimize": { },
   "information": { }
 },
 "userdata-results": {
     "checks-aborted": [
       "contains-annots",
       "contains-annots-not-for-printing",
       "contains-annots-not-for-viewing",
       "contains-annots-without-normal-appearances",
       "contains-embedded-files",
       "contains-metadata",
       "contains-optional-content",
       "contains-private-data",
       "contains-transparency"
   ],
   "checks-completed": [ ],
   "errors": { },
   "how-to-optimize": { },
   "information": { }
   }
}

```
