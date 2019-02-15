/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual {
    "use strict";

    /** External dependencies */

        /** powerbi.extensibility.utils.tooltip */
            import tooltip = powerbi.extensibility.utils.tooltip;
            import TooltipEventArgs = powerbi.extensibility.utils.tooltip.TooltipEventArgs;
            import ITooltipServiceWrapper = powerbi.extensibility.utils.tooltip.ITooltipServiceWrapper;   

    export class Visual implements IVisual {
        
        /** Properties */
            private settings: VisualSettings;
            private host: IVisualHost;
            private svg: d3.Selection<SVGElement>;
            private container: d3.Selection<SVGElement>;
            private rect: d3.Selection<SVGElement>;
            private measureValue: d3.Selection<SVGElement>;
            private measureLabel: d3.Selection<SVGElement>;
            private tooltipServiceWrapper: ITooltipServiceWrapper;

        /** Runs on instantiation */
            constructor(options: VisualConstructorOptions) {
                            
                /** Create elements for our visual */

                    /** Main canvas */
                        this.svg = d3.select(options.element)
                            .append('svg')
                            .classed('card', true);

                    /** Group container for card */
                        this.container = this.svg
                            .append('g')
                            .classed('container', true);

                    /** Rectangle surrounding value & measure */
                        this.rect = this.container
                            .append('rect')
                            .classed('rect', true);

                    /** Measure */
                        this.measureValue = this.container
                            .append('text')
                            .classed('textValue', true);

                    /** Label */
                        this.measureLabel = this.container
                            .append('text')
                            .classed('textLabel', true);

                /** Instantiate the tooltipWrapper */
                    this.tooltipServiceWrapper = tooltip.createTooltipServiceWrapper(
                        options.host.tooltipService,
                        options.element
                    );

            }

        /** Runs when the visual is updated with valid data roles */
            public update(options: VisualUpdateOptions) {

                /** Parse our settings from the data view */
                    this.settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);

                /** Map the view model */
                    let viewModel = visualTransform(options, this.settings);

                /** Inspect the view model in the browser console; should be removed later on */
                    console.log('View Model:', viewModel); 

                /** Position and render our visual & details */

                    /** Scale canvas to match viewport */
                        this.svg.attr({
                            width: viewModel.dimensions.width,
                            height: viewModel.dimensions.height
                        });

                    /** Render the rectangle */
                        viewModel.card.styles.map((s) => {
                            this.rect.style(s.key, s.value);
                        });
                        viewModel.card.attributes.map((a) => {
                            this.rect.attr(a.key, a.value);
                        });

                    /** Render measure text */
                        this.measureValue
                            .text(viewModel.card.measureValue.text);
                                    
                        viewModel.card.measureValue.attributes.map((a) => {
                            this.measureValue.attr(a.key, a.value);
                        });
                        viewModel.card.measureValue.styles.map((s) => {
                            this.measureValue.style(s.key, s.value);
                        });

                    /** Render measure label text */
                        this.measureLabel
                            .text(viewModel.card.measureLabel.text);

                        viewModel.card.measureLabel.attributes.map((a) => {
                            this.measureLabel.attr(a.key, a.value);
                        });
                        viewModel.card.measureLabel.styles.map((s) => {
                            this.measureLabel.style(s.key, s.value);
                        });

                    /** Bind the tooltip event and data */
                        if (viewModel.card.tooltips.length > 0) {
                            this.tooltipServiceWrapper.addTooltip(
                                this.svg,
                                (eventArgs: TooltipEventArgs<number>) => viewModel.card.tooltips
                            );
                        }

            }

        /** Parses the settings out of the data view */
            private static parseSettings(dataView: DataView): VisualSettings {
                return VisualSettings.parse(dataView) as VisualSettings;
            }

        /** 
         *  This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
         *  objects and properties you want to expose to the users in the property pane.
         */
            public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] 
                | VisualObjectInstanceEnumerationObject {
                return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
            }
    }
}