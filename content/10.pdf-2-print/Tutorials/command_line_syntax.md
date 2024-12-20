---
title: Command Line Syntax
---

The command syntax for PDF2PRINT must include the executable name and the name of the file (or files) to print. These are the only required elements:

```js
pdf2print filename.pdf
```

:br

If you don’t include a printer name, the system will use the default printer. The printer can be either local or networked.

:br

If you want to select a printer for a print job, you must provide the name of that printer before the input file name.

```js
pdf2print --printer=printername filename.pdf
```

:br

We recommend that you add any options to the command statement after the printer name, though the options can be in any order:

```js
pdf2print --printer=printername --copies=2 --orientation=landscape filename.pdf
```

:br

You can send as many files to a printer as you like, separating each file name with a space:

```js
pdf2print --printer=printername --copies=2 --orientation=landscape filename1.pdf 
filename2.pdf
```

:br

Select a Windows printer, and for the printer name use the full Windows UNC path. To find the printer name for a network printer open the Windows Control Panel and select Devices and Printers. The name should appear on the Hardware tab for the printer Properties window.

:br

When printing to a network printer, we recommend that you include the full path name of the server and domain for the printer in your command line statement. Depending on how your network is set up, you might see error messages if you leave the domain name out. The syntax looks like this:

```js
pdf2print --printer=”\\servername\printer device name” filename.pdf
```

:br

So the statement might look like this:

```js
pdf2print --printer=”\\London.standard.company.com\Sales Cannon printer” 
annualreport2016.pdf
```

:br

In the above example "London" is the server name, “standard.company.com” is the domain, and “Sales Cannon printer” is the printer name.

:br

If you type the printer name wrong, you will see an error message. If any printer or path name includes spaces, use quotes around that printer or path name, as shown above.

:br

In this example the PDF file to be printed would be found in the same directory where you are running the PDF2PRINT utility.

:br

If you want to print a PDF document that is stored in a different directory, you need to provide the path name:

```js
pdf2print --printer=”\\London.standard.company.com\Sales Cannon printer” 
C:\Datalogics\PrintDocuments\annualreport2016.pdf
```
