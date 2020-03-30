# Ranking choices (in-progress)

*This plug-in is in-progress, and may not work correctly.*

## Description

Use this field plug-in so you can rank choices by clicking, tapping, or dragging. Define your choices like you usually would, attach this field plug-in, and you're all set!

Enumerators can rank choices with their preferred method. They can tap/click a choice, and then click/tap another choice to swap it with. They can also click/tap and hold, then drag over to the choice they would like to swap it with.

## Default SurveyCTO feature support

| Feature / Property | Support |
| --- | --- |
| Supported field type(s) | `select_multiple`|
| Default values | Yes |
| Custom constraint message | Yes |
| Custom required message | Yes |
| Read only | Yes |
| media:image | Yes (not in choices) |
| media:audio | Yes  (not in choices) |
| media:video | Yes (not in choices) |
| `minimal` appearance | No |
| `compact` appearance | No |
| `compact-#` appearance | No |
| `randomized` appearance | Yes |

## How to use

**To use this plug-in as-is**, just download the [rankingchoices.fieldplugin.zip](rankingchoices.fieldplugin.zip) file from this repo, and attach it to your form.

To create your own field plug-in using this as a template, follow these steps:

1. Fork this repo
1. Make changes to the files in the `source` directory.

    * **Note:** be sure to update the `manifest.json` file as well.

1. Zip the updated contents of the `source` directory.
1. Rename the .zip file to *yourpluginname*.fieldplugin.zip (replace *yourpluginname* with the name you want to use for your plug-in).
1. You may then attach your new .fieldplugin.zip file to your form as normal.

## Parameters

None

## More resources

* **Test form**  
You can find a form definition in this repo here: [extras/test-form](extras/test-form).

* **Developer documentation**  
More instructions for developing and using field plug-ins can be found here: [https://github.com/surveycto/Field-plug-in-resources](https://github.com/surveycto/Field-plug-in-resources)