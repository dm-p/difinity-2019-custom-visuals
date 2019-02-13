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
        
        /** powerbi.extensibility.utils.formatting */
            import valueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;

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

                 /** Grab the data view */
                    let dataView: DataView = options.dataViews[0];

                /** Position and render our visual & details */

                    /** Current dimensions of visual viewport */
                        let width: number = options.viewport.width;
                        let height: number = options.viewport.height;

                    /** Scale canvas to match viewport */
                        this.svg.attr({
                            width: width,
                            height: height
                        });

                    /** Padding for rectangle */
                        let padding: number = 2;

                    /** Render the rectangle */
                        this.rect
                            .style('fill', this.settings.card.fillColour)
                            .style('fill-opacity', 0.5)
                            .style('stroke', 'black')
                            .style('stroke-width', this.settings.card.strokeWidth)
                            .attr({
                                x: padding,
                                y: padding,
                                width: width - (padding * 2),
                                height: height - (padding * 2)
                            });

                    /** Measure value font size */
                        let measureValueFontSize: number = Math.min(width, height) / 5;

                    /** Filter out the measure label based on role */
                        let measureDisplayLabel = dataView.metadata.columns.filter(
                            c => c.roles['measure']
                        )[0].displayName;

                    /** Format the measure by filtering the value and format string based on role */
                        let measureFormatted = valueFormatter.format(
                                dataView.categorical.values.filter(
                                    c => c.source.roles['measure']
                                )[0].values[0],
                                dataView.metadata.columns.filter(
                                    c => c.roles['measure']
                                )[0].format
                            );

                    /** Render measure text */
                        this.measureValue
                            .text(measureFormatted)
                            .attr({
                                x: '50%',
                                y: '50%',
                                dy: '0.35em',
                                'text-anchor': 'middle'
                            })
                            .style('font-size', `${measureValueFontSize}px`);

                    /** Measure label font size */
                        let measureLabelFontSize = measureValueFontSize / 4;

                    /** Render measure label text */
                        this.measureLabel
                            .text(measureDisplayLabel)
                            .attr({
                                x: '50%',
                                y: height / 2,
                                dy: measureValueFontSize / 1.2,
                                'text-anchor': 'middle'
                            })
                            .style('font-size', `${measureLabelFontSize}px`);

                /** Tooltip */

                    /** Empty array of tooltip data */
                        let tooltips: VisualTooltipDataItem[] = [];

                    /** Add the measure data */
                            tooltips.push({
                                displayName: measureDisplayLabel,
                                value: measureFormatted,
                                color: this.settings.card.fillColour
                            });

                    /** Iterate all tooltip fields and add them into the tooltips array */
                        dataView.categorical.values.filter(
                            c => c.source.roles['tooltip']
                        )
                            .map((m) => {
                                tooltips.push({
                                    displayName: m.source.displayName,
                                    value: valueFormatter.format(
                                        m.values[0],
                                        m.source.format
                                    )
                                })
                            });                            

                    /** Bind the tooltip event and data */
                        this.tooltipServiceWrapper.addTooltip(
                            this.svg,
                            (eventArgs: TooltipEventArgs<number>) => tooltips
                        );


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