# Ranking choices

![](extras/preview-images/main.jpg)

|<img src="extras/preview-images/moving.jpg" width="100px">|<img src="extras/preview-images/ranked.jpg" width="100px">|<img src="extras/preview-images/no-numbers.jpg" width="100px">|
|:---:|:---:|:---:|
|Moving|Ranked|No numbers|

## Description

*Requires at least Android 7 or iOS 13 to work in SurveyCTO Collect mobile.*

Use this field plug-in so enumerators can drag to rank choices. Define your choices like you usually would, attach this field plug-in, and you're all set!

This field will return a space-separated list of all choices in the order they were ranked. You can use the [selected-at()](https://docs.surveycto.com/02-designing-forms/01-core-concepts/09.expressions.html#Help_Forms_selected-at) function to retrieve each rank. For example, if the field is called "ranking", you can use the expression `selected-at(${ranking}, 0)` to retrieve the value of the choice ranked number 1, `selected-at(${ranking}, 1)` to retrieve the value of the choice ranked number 2, and so on.

This field plug-in also inherits functionality from the [baseline-select_multiple](https://github.com/surveycto/baseline-select_multiple) field plug-in.

[![Download now](extras/other-images/download-button.png)](https://github.com/surveycto/ranking-choices/raw/master/rankingchoices.fieldplugin.zip)

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

**To use this field plug-in as-is:**

1. Download the [sample form](https://github.com/surveycto/ranking-choices/raw/master/extras/sample-form/Ranking%20choices.xlsx) from this repo and upload it to your SurveyCTO server.
1. Download the [rankingchoices.fieldplugin.zip](https://github.com/surveycto/ranking-choices/raw/master/rankingchoices.fieldplugin.zip) file from this repo, and attach it to the sample form on your SurveyCTO server.
1. Adjust the parameter if you would like to use a different unit (see below).

## Parameters

|Name|Description|Default|
|---|---|---|
|`allowdef`|Whether to allow the default display without making changes|0|
|`numbers`|Whether to number the rankings of each choice|1|


There are two parameters:

1. `alloqdef`: If this parameter has a value of 1, then the enumerator can swipe to the next field without making any changes. If the parameter is any other value, or it is not included, at least one change needs to occur. This change can be as simple as tapping a choice so it stays in the same place.
1. `numbers`:  If this parameter has a value of 1, or if it is not included, then choices will have numbers ranking them from 1 to x (x being the number of choices). The numbers will stay in order even as the choices are moved around. If the parameter has a value of 0, then these numbers will not be shown.

## More resources

* **Sample form**  
You can find a form definition in this repo here: [extras/sample-form](extras/sample-form).

* **Developer documentation**  
More instructions for developing and using field plug-ins can be found here: [https://github.com/surveycto/Field-plug-in-resources](https://github.com/surveycto/Field-plug-in-resources)
