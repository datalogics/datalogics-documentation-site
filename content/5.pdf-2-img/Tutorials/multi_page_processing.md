---
title: Multi-Page Processing
---

By default, PDF2IMG converts the pages in a PDF file into multiple single-page image files. The system assigns a name to each image file with an underscore character (\_) added between the file name prefix and the sequence counter number. For example, the five pages in a PDF input file called Convert.PDF would be exported to form five bitmap (BMP) graphic files:

- convert\_1.BMP
- convert\_2.BMP
- convert\_3.BMP
- convert\_4.BMP
- convert\_5.BMP

:br

If you are working with a long PDF document, the software will by default pad the sequence number with leading zeroes as needed, to keep the export graphic files in order by name. So if Convert.PDF has 128 pages, the first few BMP export files will be named:

- convert\_001.BMP
- convert\_002.BMP
- convert\_003.BMP

:br

Followed, later, by:

- convert\_043.BMP
- convert\_044.BMP
- convert\_045.BMP

:br

And finally by:

- convert\_126.BMP
- convert\_127.BMP
- convert\_128.BMP

:br

Remember:

1. You can select PDF as your export format for a PDF document, rather than a graphic file format like PNG or BMP. So if you have a 15-page PDF document and want to use PDF2IMG to export it to PDF, you can set up the software to provide a series of 15 PDF documents as the export result. The software will use the page-split feature. To this end you will need to select the pdf2img\_set\_pdf\_output\_type API call, or the command line statement pdf-rasterize-split or pdf-split.
2. You can use the optional firstonly command line argument to direct PDF2IMG to convert only the first page of the input PDF file rather than every page in the document. So you can use this argument to test a conversion before using the product to process a series of very long PDF documents.
3. Or you can use the optional multipage command line argument to convert long, multipage PDF document into a single multipage TIFF document.
4. Use the optional digits command line argument to specify the number of digits for numbering the output files and suppress the underscore character (\_). For example, if you enter "- digits=3" as part of a command, the export files generated from your input PDF document will be named FILE001.JPG, FILE002.JPG, and so on.
5. Finally, use the optional output command line argument to specify an alternate output file name prefix. The value given here will be used for the output file name, with a sequence number and an appropriate extension appended to indicate the output file type, such as sample\_1.gif and sample\_1.jpg. For a PDF input document with more than one page, the system will create sequential, separate output files for each page of the input file, with a sequence number appended to each, such as sample\_1.gif, sample\_2.gif, sample\_3.gif, and so on.

:br

**Note: An alternate file folder location can be specified for the output file(s) to be created, but that folder must already exist; PDF2IMG will not create it.**
