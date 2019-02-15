module powerbi.extensibility.visual {

    /**
     *  Used to specify any dimension attributes, for sizing, etc.
     * 
     *  @property {number} width                    - Width of element, in pixels
     *  @property {number} height                   - Height of element, in pixels
     */
        export interface IDimensions {
            width?: number;
            height?: number;
        }

    /**
     *  Used to specify padding attributes for element positioning or styling
     * 
     *  @property {number} left                     - Number of pixels to pad from the left
     *  @property {number} top                      - Number of pixels to pad from the top
     */
        export interface IPadding {
            left?: number;
            top?: number;
        }

    /**
     *  Used to specify everything needed to successfully render the card within our visual
     * 
     *  @property {IPadding} padding                - Padding from top/left for card
     *  @property {IDimensions} dimensions          - Dimensions of the card container
     *  @property {IHtmlAttribute[]} attributes     - Array of SVG attributes to apply to the card `rect` element
     *  @property {IHtmlAttribute[]} styles         - Array of CSS styles and their values
     *  @property {ICardText} measureValue          - The displayed measure value
     *  @property {ICardText} measureLabel          - The label displayed underneath the measure value
     *  @property {VisualTooltipDataItem[]}         - Array of tooltip entries for the card
     */
        export interface ICard {
            padding: IPadding;
            dimensions: IDimensions;
            attributes: IHtmlAttribute[];
            styles: IHtmlAttribute[];
            measureValue: ICardText;
            measureLabel: ICardText;
            tooltips?: VisualTooltipDataItem[];
        }

    /**
     *  Used to specify everything needed to render a textual value within the card
     * 
     *  @property {string} text                     - The displayed text
     *  @property {IHtmlAttribute[]} attributes     - Array of attributes to apply to the text
     *  @property {IHtmlAttribute[]} styles         - Array of CSS styles and their values
     */
        export interface ICardText {
            text: string;
            attributes: IHtmlAttribute[];
            styles: IHtmlAttribute[];
        }

    /**
     *  Simple interface used to apply generic key/value pairs, e.g. for styling and attributes
     *  
     *  @property {string} key                      - Name of the property to assign
     *  @property {string} value                    - Value of the assigned property
     */
        export interface IHtmlAttribute {
            key: string;
            value: string;
        }

}