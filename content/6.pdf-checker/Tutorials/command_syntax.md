---
title: Command Syntax
---

The command syntax for PDF Checker includes these values:

Required: The executable name, **pdfchecker**

Required: &#x2A;*-i \[--input]** name and path of the PDF input file to review

Required: &#x2A;*-j \[--profile]** name and path of the JSON profile file

:br

Optional: &#x2A;*-o \[--output]** name and path to assign to the output results file

Optional: &#x2A;*-s \[--json-output]** name and path to assign to a JSON output results file

Optional: &#x2A;*-p \[--password]** password needed to open a protected PDF input file

Optional: &#x2A;*-n \[--nopath]** remove the system paths to the input PDF or JSON file

For each command line option, you can use either the short &#x2A;*(“-i”)*&#x2A; or long &#x2A;*(“--input”)** notation.

The only value in the command line statement that does not require a matching argument is the last one listed above, &#x2A;*“--nopath”** for removing the path from the input file name.

The command syntax for PDF Checker with the required values looks like this:

```js
pdfchecker –-input test.pdf –-profile everything.json 
```

In this command you are telling the system to inspect the PDF file called &#x2A;*“test.pdf”*&#x2A; using the JSON profile &#x2A;*“everything.json.”**

PDF Checker will display the results of the review on your command line screen by default.

If you would like the product to export the results to an output file, use the &#x2A;*“--output”** option. Two kinds of output files are available, a text file and a JSON file. The text file is meant to be easy for you to read, while we designed the JSON output report to be machine-readable. You can either display the results report on your console or save it to an export file, or you can do both.

With the JSON output file, you can add the report results from PDF Checker to your own batch process. For example, you can collect and store the results for any PDF document you review with PDF Checker in your own database for later analysis. These are the options that PDF Checker provides when you generate report output:

1. Display the text file report to the console (default, if you don’t use the “- -output” option)
2. Save this content to an output text file
3. Display the JSON report content to the console
4. Save the JSON report content to an output JSON file
5. Save both kinds of output, human readable and machine readable, to a pair of output files, text and JSON
6. Display the JSON file output on the console and save the text content to an output text file
7. Display the text file output on the console and save the JSON output to an output JSON file

Note that you can’t both display a report on your console and save the same content to an output file. It is possible to display both the text and JSON report content on the console, though a need for that seems unlikely. You could simply use PDF Checker to analyze the same PDF document twice instead.

To generate JSON output, you need to use the &#x2A;*“-s”*&#x2A; or &#x2A;*“--json-output -”** value to your command line statement.

You can also enter a password for opening a PDF document if the PDF input file is password protected.

Finally, if you don’t want the path name for the input PDF document or of the JSON Profile file to appear in your output text file, or in the standard output provided by your command line tool, add the value &#x2A;*“--nopath”** to the end of your command line statement. You may want to suppress the place where you store your PDF input files or your JSON profile for security reasons.

The full command syntax for PDF Checker looks like this:

```js
pdfchecker –-input test.pdf –-profile everything.json 
–-json-output PDFChecker_results.json –-password mypassword --nopath
```

:br

Note the use of the &#x2A;*“--json-output”*&#x2A; option instead of &#x2A;*“--output”** in this command statement. If you want to display the JSON output on your command line monitor, you could use this command instead:

```js
pdfchecker –-input test.pdf –-profile everything.json –-json-output -
```

:br

You can create both kinds of output files, text and JSON:

```js
pdfchecker –-input test.pdf –-profile everything.json 
–-json-output PDFChecker_results.json –-output PDFChecker_results.txt
```

:br

You can display the JSON output on your console and save the same output as a text file:

```js
pdfchecker –-input test.pdf –-profile everything.json 
–-json-output - –-output PDFChecker_results.txt
```

Alternately, you could display the text output on your console and save the same output as a JSON formatted file:

```js
pdfchecker –-input test.pdf –-profile everything.json --output -
–-json-output PDFChecker_results.json
```

The Windows installation program for PDF Checker adds the location of the PDF Checker executable to the PATH in the Windows Environment Variables. That means that you can run the executable, pdfchecker.exe, from anywhere.

You don’t need to include a path name for any of the files mentioned in the command statement if the input file and profile are stored in the same directory as the executable pdfchecker.exe, and if you want to save the PDF Checker results file to the same directory. But you of course might want to draw an input file from one directory and save the output to another, and maybe store your JSON Profile files in a third.

In that event you need to provide the path as well as the file name:

```js
pdfchecker –-input C:\Datalogics\CheckerFiles\AnnualReport2016.pdf –-
profile everything.json –-output C:\Datalogics\PDFChecker_results.txt
```

:br

If any of the file or path names include spaces, use quotes around the name:

```js
pdfchecker –-input C:\Datalogics\CheckerFiles\AnnualReport2016.pdf –-
profile everything.json –-output “C:\Datalogics\PDFChecker results.txt”
```

:br

And you can provide a path name for the JSON profile file, just as you would for the input PDF document and the output results file:

```js
pdfchecker –-input C:\Datalogics\CheckerFiles\AnnualReport2016.pdf –-
profile C:\Datalogics\JSONProfiles\everything.json –-output
C:\Datalogics\PDFChecker_results.txt
```

:br

If you don’t enter a path name for the JSON profile file as part of the “--profile” value, PDF Checker will look for the JSON profile file to use. It will first search the CheckerProfiles folder, which is part of the directory structure for your PDF Checker software installation package and where the standard JSON Profile file, everything.json, the file we provide with the software, is stored. If the file is not in the CheckerProfiles directory, PDF Checker will treat the “--profile” input value in the command statement as a path to the profile and try to load the profile from that location.

This makes the product easier for you to use after you install it. All you need to do is provide the name of the JSON Profile file. PDF Checker can find the file for you.

You can use the JSON profile we provide, everything.json, from the command line, like this:

```js
pdfchecker –-input test.pdf –-profile everything.json --output
PDFChecker _results.txt –-password mypassword --nopath
```
