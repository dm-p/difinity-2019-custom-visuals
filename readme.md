# Hi There!

This repository is to support the presentation given at Difinity 2019, entitled *Power BI Custom Visuals: Getting Beyond the Boilerplate*.

Each tag represents a specific step in the tutorial and can be reconciled against the [PDF copy of the presentation](https://github.com/dm-p/difinity-2019-custom-visuals/blob/master/presentation/Power%20BI%20Custom%20Visuals%20-%20Getting%20Beyond%20the%20Boilerplate%20-%20Difinity%202019-02-20.pdf), also present in this repository's `presentation` subfolder.

You will need access to the [Power BI Custom Visuals SDK](https://microsoft.github.io/PowerBI-visuals/docs/step-by-step-lab/developing-a-power-bi-custom-visual/). Refer here for instructions on setting up the toolchain, certificate and developer visual. You can then run `npm i` to update your packages and then get started.

----
:exclamation: **Update [2019-06-19]:** Please note that if you're still referring to this guide, the Power BI Custom Visuals tooling has recently been updated to a new major version and this contains some breaking changes to older code. [The migration guide can be found here if you want to attempt this yourself](https://microsoft.github.io/PowerBI-visuals/docs/how-to-guide/migrating-to-powerbi-visuals-tools-3-0). 

If you want to use this tutorial as-is, please change this line in the setup instructions on slide 9 of the presentation from:
```
npm i power-bi-visuals-tools -g
```
To:
```
npm i power-bi-visuals-tools@2.3 -g
```
----
Enjoy!

Daniel Marsh-Patrick
