# Sample Results JSON File Output: Successful Review

This is what a complete JSON results report file would look like when each of the fields controlling the output is specified and PDF Checker completes the review successfully.

You could set up a batch process to review a set of PDF documents stored in a server directory automatically, one by one. Then, you could add a step to your batch code that would identify the PDF documents that PDF Checker found with issues or problems, and send this JSON report output to PDF Optimizer, and PDF Optimizer could then optimize each PDF document based on the items found by PDF Checker.

Note that PDF Checker provides the size of the PDF source document, and a machine readable value, “sizeInBytes.” This allows you to scan the results to make decisions on document processing based on file size. For example, a PDF document that is only 10 KB probably isn’t worth optimizing.

Note that the metadata for the PDF document is provided at the top of the report. The “Trapped” parameter refers to the prepress workflow when printing in color. Trapping a document governs how the ink will appear on the page; colors are trapped by adjusting the shape of objects as they are printed on the page to avoid gaps from appearing. Trapping can be enabled by some software products that generate PDF documents, such as Adobe InDesign.

PDF Checker will determine if the PDF document claims PDF/A compliance, and provide the type of PDF/A file. If in fact the file is not PDF/A compliant, an error message will appear in the output report.

```js
{
   "analysis-summary": {
       "can-be-optimized": true,
       "claimed-pdfa-type": PDF/A-1b,
       "conforms-to-claimed-pdfa-type": true,
      "date": "Mon Dec 5 11:07:33 2022",
      "errors": [
           "uses-base14fonts-not-embedded",
           "uses-fonts-not-embedded"
      ],
      "information": [
           "born-digital",
           "contains-annots",
           "contains-annots-not-for-printing",
           "contains-metadata",
           "contains-transparency",
           "found-non-extractible-text",
           "suboptimal-compression",
           "tagged-pdf"
      ],
      "input"C:\\path\\to\\input.pdf",
      "language": "None",
     "metadata": {
           "Author": "John Smith",
           "CreationDate": "2020-09-08T13:13:58",
           "Creator": "Acrobat PDFMaker 15 for Word",
           "Keywords": "",
           "ModDate": "2020-09-08T13:14:04",
           "Producer": "Adobe PDF Library 18.0",
           "Subject": "",
           "Title": "",
           "Trapped": ""
      },
     "number-of-pages": 1894,
      "pdf-checker-version": "2.2.0",
      "pdf-extension-level": 5,
      "pdf-major-version": 1,
      "pdf-minor-version": 7,
      "profile": "C:\\path\\to\\everything.json",
      "size-in-bytes": 402518,
      "triggered-abort": ""
 },
 "cleanup-results": {
      "checks-aborted": [],
      "checks-completed": [
           "suboptimal-compression"
      ],
      "errors": {},
      "how-to-optimize": {},
      "information": {
           "suboptimal-compression": [
                "Uncompressed: (1 instance)"
           ]
      }
 },
 "color-images": {
      "checks-aborted": [],
      "checks-completed": [
           "image-depth",
           "resolution-too-high",
           "resolution-too-low",
           "uses-jpeg2000-compression"
      ],
      "errors": {},
      "how-to-optimize": {},
     "information": {}
 },
 "fonts-results": {
      "checks-aborted": [],
      "checks-completed": [
           "fontdescriptor-missing-capheight",
           "fontdescriptor-missing-fields",
           "found-non-extractible-text",
           "uses-base14fonts-not-embedded",
           "uses-fonts-fully-embedded",
           "uses-fonts-not-embedded"
      ],
      "errors": {
           "uses-base14fonts-not-embedded": [
                "Arial-BoldMT (1 instance)",
                "ArialMT (1 instance)",
                "CourierNewPSMT (1 instance)"
      ],
      "uses-fonts-not-embedded": [
           "CenturyGothic (1 instance)",
           "CenturyGothic-Bold (1 instance)"
      ]
 },
 "how-to-optimize": {},
 "information": {
      "found-non-extractible-text": [
           "HSODIF+SymbolMT, SubType: Type0 (1 instance)"
           ]
      }
 },
 "general-results": {
      "checks-aborted": [],
      "checks-completed": [
           "acroforms-type",
           "born-digital",
           "claims-pdfe-conformance",
           "claims-pdfua-conformance",
           "claims-pdfvt-conformance",
           "claims-pdfx-conformance",
           "contains-owner-password",
           "contains-signature",
           "damaged",
           “does-not-conform-to-claimed-pdfa-type”,
           "image-only",
           "password-protected",
           "pdf-v2",
           "tagged-pdf",
           "unable-to-open",
           "xfa-type"
     ],
      "errors": {},
      "how-to-optimize": {},
      "information": {
           "born-digital": [
                "Document was born digital. It was produced from PDF authoring software and so
it may contain text, images, tables, forms, and other objects. These types of PDFs typically do
not require OCR."
           ],
           "tagged-pdf": [
                "Document contains tagged content"
            ]
      }
 },
 "grayscale-images": {
      "checks-aborted": [],
      "checks-completed": [
           "resolution-too-high",
           "resolution-too-low",
           "uses-jpeg2000-compression"
      ],
      "errors": {},
      "how-to-optimize": {},
      "information": {}
 },
 "image-results": {
      "checks-aborted": [],
      "checks-completed": [
           "alternate-images"
      ],
      "errors": {},
      "how-to-optimize": {},
      "information": {}
 },
 "monochrome-images": {
      "checks-aborted": [],
      "checks-completed": [
           "resolution-too-high",
           "resolution-too-low",
           "uses-jbig2-compression"
      ],
      "errors": {},
      "how-to-optimize": {},
      "information": {}
 },
 "objects-results": {
      "checks-aborted": [],
      "checks-completed": [
           "contains-javascript-actions",
           "contains-thumbnails"
      ],
      "errors": {},
      "how-to-optimize": {},
      "information": {}
 },
 "userdata-results": {
      "checks-aborted": [],
      "checks-completed": [
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
      "errors": {},
      "how-to-optimize": {
           "contains-annots": [
                "Annotations can be removed using PDF Optimizer to save space. (21 instances)"
           ],
           "contains-annots-not-for-printing": [
                "Annotations not intended for printing can be removed using PDF Optimizer to save
space. (21 instances)"
           ],
 "contains-metadata": [
                "Metadata can be removed using PDF Optimizer to save space. (1 instance)",
"XMP Metadata padding can be removed using PDF Optimizer to save space. (1
instance)"
           ],
           "contains-transparency": [
                "Transparency (which is not universally supported by PDF Viewers) can be
flattened using PDF Optimizer. (1 instance)"
           ]
      },
      "information": {
           "contains-annots": [
                "SubType: Link (21 instances)"
           ],
           "contains-annots-not-for-printing": [
                "SubType: Link (21 instances)"
           ],
           "contains-metadata": [
                "SubType: XML, Update region size: 2048 (1 instance)",
                "Total: (1 instance)"
           ],
           "contains-transparency": [
                "Total: (1 instance)"
           ]
        }
    }
}
```
