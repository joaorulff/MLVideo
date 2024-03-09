import * as d3 from 'd3';

export class DOMUtils {

    /*
    *   
    * 
    */

    public static append_div( container: HTMLDivElement ): HTMLDivElement {

        const wrapper = document.createElement('div');
        wrapper.style.width = '100%';
        wrapper.style.height = `100%`;
        wrapper.style.position = 'relative';
        
        container.append( wrapper );

        return wrapper;
    }
    
    public static create_svg( container: HTMLElement, zindex: number = 1, width?: number, height?: number ): d3.Selection<any,any,any,any> {
        
        // container dimensions
        let svgWidth: number = width ? width : container.clientWidth;
        let svgHeight: number = height ? height : container.clientHeight;

         // creating svg
        return d3.select(container)
            .append('svg')
            .style('position', 'absolute')
            .style('top', 0)
            .style('left', 0)
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .style('z-index', zindex);

    }

    public static async append_video( container: HTMLDivElement, videoPath: string, callbacks: any = {} ): Promise<HTMLVideoElement> {
        
        return new Promise( (resolve, reject) => {

            const video: HTMLVideoElement = document.createElement('video');
            video.src = videoPath;
    
            // setting video styles
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
            video.controls = true;
            video.muted = true;
            video.controls = false;
            
            setInterval( () => {
                if( 'ontimeupdate' in callbacks ){
                    callbacks['ontimeupdate'](event);
                }
            }, 50)

            video.onloadeddata = () => {
                resolve(video);
            }
    
            // appending video to container
            container.append( video );

        });

    }




}