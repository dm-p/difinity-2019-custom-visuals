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

}