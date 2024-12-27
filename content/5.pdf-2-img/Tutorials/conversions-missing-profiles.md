---
title: Conversions with Missing Profiles
description: null
---

When creating a PDF document, the best practice is to embed all the fonts that document will need to use in the document itself. That way, the software used to open that PDF document (such as Adobe Reader or Acrobat) does not need to try to find fonts that it needs from the local workstation or laptop or provide substitutes.

:br

Likewise, before PDF2IMG starts the process to convert a PDF document to a graphic file or series of graphic files, the product will look for the needed fonts within the PDF document itself.

:br

If the fonts are not embedded in the document PDF2IMG will try to make use of font resources found on the system. PDF2IMG can use environment variables to determine where to find those font resources.

/br

Or the software can provide its own fonts. PDF2IMG offers internal font and CMap resources that are shipped with the product. These font resource files are copied to the installation directory for the PDF2IMG software (where the executable is stored) when you install the product.
