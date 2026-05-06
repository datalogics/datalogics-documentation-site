---
title: Command Line Syntax
---

The command syntax for PDF Optimizer must include:

:br

- pdfoptimizer the executable file name
- -i \[--input] name of the PDF Input fie you want to optimize
- -o \[--output] name you want to assign to the output PDF file
- -j \[--profile] name of the JSON profile file

:br

For each command line option, you can use the short (“-i”) or long (“-input”) notation.

:br

These parameters are optional:

- -q \[--quiet] don’t display the results summary on the command line tool
- -l \[--log] save detailed results to an output text file

:br

A command statement for PDF Optimizer might look like this:

```js
pdfoptimizer –-input March_Report.pdf –-output March_ReportB.pdf -–
profile compressionMedium.json
```

:br

You don’t need to include the path for any of these files if the input file and profile are stored in the same directory as the program executable, and if you save the output file to the same directory as well. :br

But you might want to draw an input file from one directory and save the output to another. In that event you need to provide the path as well as the file name. The examples that follow are for Windows:

```js
pdfoptimizer –-input C:\Datalogics\OptimizedFiles\AnnualReport2016.pdf 
–-output C:\Datalogics\OutputFiles\AnnualReport2016-B.pdf –-profile 
compressionMedium.json
```

:br

If any of the file or path names include spaces, use quotes around the name:

```js
pdfoptimizer –-input “C:\Datalogics\Optimized Files\Annual Report 
2016.pdf” –-output C:\Datalogics\OutputFiles\AnnualReport2016-B.pdf –-
profile C:\Datalogics\profiles\images.json
```

:br

Note that PDF Optimizer allows for a command statement syntax that does not include the option notation, for compatibility with previous versions of the software. That is, you can leave out “--input” and “--output” if you already have this command syntax in place in your existing PDF Optimizer work flow. A command that simply lists the name and path of the input file, output file, and JSON profile might look like this:

```js
pdfoptimizer MarchReport2016.pdf MarchReport2016-B.pdf 
compressionMedium.json
```

:br

You will see a summary statement in your command line tool after you run the software to optimize a PDF document. If you would rather not see this statement, you can disable it with the optional "-q" (-- quiet) parameter, like this:

```js
pdfoptimizer –-input March_Report.pdf --output March_ReportB.pdf --
profile compressionMedium.json --quiet
```

:br

On the other hand, you can add a parameter to generate an optional Results Report, exported to a text (.txt) file, using the "-l" (--log) parameter. Include name of the report file:

```js
pdfoptimizer –-input March_Report.pdf --output March_ReportB.pdf --
profile compressionMedium.json --log MarchResults.txt
```

:br

If you want to save the results report to a specific folder, include the path name for that folder in the command line statement:

```js
pdfoptimizer –-input March_Report.pdf --output March_ReportB.pdf --
profile compressionMedium.json --log C:\Datalogics\Results 
Report\MarchResults.txt
```

:br

Note that you can use both the --quiet and --log parameters in the same statement if you like. That is, you can suppress the summary report that appears on your command line and generate a detailed output report at the same time.

:br

The Windows installation adds the location of the PDF Optimizer executable to the %PATH% in the Windows Environment Variables, so you can run “pdfoptimizer.exe” from anywhere. For Linux, you need to add the location of the PDF Optimizer executable to your PATH variable.
