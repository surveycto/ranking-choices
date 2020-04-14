# Ranking choices


## Description

Use this field plug-in so enumerators can drag to rank choices. Define your choices like you usually would, attach this field plug-in, and you're all set!


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

|Name|Description|Default|
|---|---|---|
|`allowdef`|Whether to allow the default display without making changes|0|
|`numbers`|Whether to number the rankings of each choice|1|


There are two parameters:

1. `alloqdef`: If this parameter has a value of 1, then the enumerator can swipe to the next field without making any changes. Otherwise, at least one change needs to occur. This change can be as simple as tapping a choice so it stays in the same place.
1. `numbers`:  If this parameter has a value of 1, or if it is not included, then choices will have numbers ranking them from 1 to x (x being the number of choices). The numbers will stay in order even as the choices are moved around. If the parameter has a value of 0, then these numbers will not be shown.

## More resources

* **Test form**  
You can find a form definition in this repo here: [extras/test-form](extras/test-form).

* **Developer documentation**  
More instructions for developing and using field plug-ins can be found here: [https://github.com/surveycto/Field-plug-in-resources](https://github.com/surveycto/Field-plug-in-resources)