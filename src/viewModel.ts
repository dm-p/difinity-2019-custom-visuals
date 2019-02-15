module powerbi.extensibility.visual {

    /**
     *  Everything we need to render our visual
     * 
     *  @property {VisualSettings} settings         - Parsed visual settings
     *  @property {IDimensions} dimensions          - Dimensions of the visual container
     *  @property {ICard} card                      - Card configuration and logic
     */
        export interface IViewModel {
            settings: VisualSettings;
            dimensions: IDimensions;
            card: ICard;
        }

    /**
     *  Map the data view and settings into a view model, suitable for our `update` method.
     * 
     *  @param {VisualUpdateOptions} options        - Visual update options (passed through from `update` method)
     *  @param {VisualSettings} visualSettings      - Parsed visual settings
     */
        export function visualTransform(options: VisualUpdateOptions, visualSettings: VisualSettings): IViewModel {

            /** Current dimensions of visual viewport */
                let viewportWidth: number = options.viewport.width,
                    viewportHeight: number = options.viewport.height;

            /** 
             *  Options for calculating layouts; the defaults we were previously hard-coding here, so that we
             *  can swap them out more easily for settings if we want to introduce them to the visual.
             */
                let defaults = {
                        padding: {
                            top: 2,
                            left: 2
                        },
                        card: {
                            fillOpacity: '0.5',
                            stroke: 'black'
                        }
                    }

            /** Calculations that we might be prone to repeating when mapping */
                let measureValueFontSize: number = Math.min(viewportWidth, viewportHeight) / 5,
                    cardDimensions: IDimensions = {
                        width: viewportWidth - (defaults.padding.left * 2),
                        height: viewportHeight - (defaults.padding.top * 2)
                    };

            /** Default view model; used if we can't do everything we need and represents minimum draw */
                let viewModel: IViewModel = {
                    settings: visualSettings,
                    dimensions: {
                        width: viewportWidth,
                        height: viewportHeight,
                    },
                    card: {
                        padding: {
                            top: defaults.padding.top,
                            left: defaults.padding.left
                        },
                        dimensions: cardDimensions,
                        attributes: [
                            {
                                key: 'x',
                                value: `${defaults.padding.left}`
                            },
                            {
                                key: 'y',
                                value: `${defaults.padding.top}`
                            },
                            {
                                key: 'width',
                                value: `${cardDimensions.width}`
                            },
                            {
                                key: 'height',
                                value: `${cardDimensions.height}`
                            }
                        ],
                        styles: [
                            {
                                key: 'fill',
                                value: visualSettings.card.fillColour
                            },
                            {
                                key: 'fill-opacity',
                                value: defaults.card.fillOpacity
                            },
                            {
                                key: 'stroke',
                                value: defaults.card.stroke
                            },
                            {
                                key: 'stroke-width',
                                value: `${visualSettings.card.strokeWidth}`
                            }
                        ],
                        measureValue: {
                            text: '(blank)',
                            attributes: [
                                {
                                    key: 'x',
                                    value: '50%'
                                },
                                {
                                    key: 'y',
                                    value: '50%'
                                },
                                {
                                    key: 'dy',
                                    value: '0.35em'
                                },
                                {
                                    key: 'text-anchor',
                                    value: 'middle'
                                }
                            ],
                            styles: [
                                {
                                    key: 'font-size',
                                    value: `${measureValueFontSize}`
                                }
                            ]
                        },
                        measureLabel: {
                            text: '[No Measure Supplied]',
                            attributes: [
                                {
                                    key: 'x',
                                    value: '50%'
                                },
                                {
                                    key: 'y',
                                    value: `${viewportHeight / 2}`
                                },
                                {
                                    key: 'dy',
                                    value: `${measureValueFontSize / 1.2}px`
                                },
                                {
                                    key: 'text-anchor',
                                    value: 'middle'
                                }
                            ],
                            styles: [
                                {
                                    key: 'font-size',
                                    value: `${measureValueFontSize / 4}px`
                                }
                            ]
                        },
                        tooltips: []
                    }                
                }

            /** Our resulting view model */
                return viewModel;

        }

}