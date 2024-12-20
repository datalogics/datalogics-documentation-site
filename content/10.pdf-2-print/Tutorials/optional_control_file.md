---
title: Optional Control File
---

You can make your use of PDF2PRINT simpler by use of a control file. Enter a set of custom settings in this file, including the printer you want to use, the name of the file or files you want to print, page ranges for printing for each of these files, and any of the other options offered. Then, save the file to a directory and reuse it as often as you like, naming it in the PDF2PRINT command line statement. You can create and use as many control files as you like and make each one as long or as short as you need. The options provided for the command line statement have the same syntax and values when added to the control file.

If you want to change the names of the print files in a control file you will need to manually edit that file, but otherwise, if you have a routine where you regularly print a file or a series of files using the same printer, number of copies, page ranges, page size, and so on, you can define these values in a control file and complete your PDF2PRINT commands a lot more quickly.

The control file must use the JSON format, and we recommend that you include the “.json” extension. JSON, or JavaScript Object Notation, is an open standard file format that relies on easily readable English text, and it is used as an alternative to XML. Use the JSON validator found at https\://jsonlint.com/ to check your JSON syntax.

This is the command syntax:

```js
pdf2print –control=”path to control file”
```

Provide the path to the file. The command line the statement would look something like this:

```js
pdf2print --control=C:\Datalogics\Profiles\primary.json
```

If you call the control file as part of the command line statement, no other options are needed. All of the options can be included in the control file. But if you do add an option to a command line statement that also features a control file, and the option is found in that control file, the option in the command line statement will overwrite the setting for that same option in the control file.

Suppose you have a control file that you configured to print three copies of four different PDF documents. But you want to change that setting to print just one copy of each. It’s easier to leave the file unchanged and add a “--copies” parameter to the command statement:

```js
pdf2print --control=C:\Datalogics\Profiles\primary.json --copies=1
```

The printer disregards the number of copies provided in the control file. Note that this does not work for the “--range” setting, for defining page ranges for printing. Also, you can’t add an option to a command line to change the files to be printed.

A typical control file might look like this:

```js
{
				 "printer": "London",
				 "duplex": "long",
				 "tray": "auto",
				 "collate": "false",
				 "copies": 3,
				 "orientation": "landscape",
				 "showtrays": false,
				 "shrinktofit": false,
				 "input-files": [
								 {
												 "file-name": "File1.pdf",
												 "range": "all"
								 },
								 {
												 "file-name": "File2.pdf",
												 "range": "even"
								 },
								 {
												 "file-name": "File3.pdf",
												 "range": "1-1"
								 },
								 {
												 "file-name": "File4.pdf",
												 "range": "all"
								 }
				 ]
}
```

If you do not store the PDF print files in the same directory as the control file, you need to provide a path name for each print file in the control file. It would look like this:

```js
	 {
												 "file-name": "C:\\Datalogics\\Print\\File4.pdf",
												 "range": "all"
								 }
```

You can also include a page range for each file. Note that you can only include a single page range for each document you name in the JSON profile.

If you want, however, to print more than one range of pages for a single file, you can name the same file more than once, and give a different print range to each instance, like this:

```js
{
												 "file-name": "File2.pdf",
												 "range": "1-3"
								 },
								 {
												 "file-name": "File2.pdf",
												 "range": "7-12"
								 },
								 {
												 "file-name": "File2.pdf",
												 "range": "20-23"
								 }
```
