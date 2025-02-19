import * as d3 from 'd3';

export class DOMUtils {

    /*
    *   
    * 
    */

    public static get_video_container_size( videoWidth: number, videoHeight: number, containerWidth: number, containerHeight: number ): {width: number, height: number} {

        const videoAspectRatio: number = videoWidth/videoHeight;
        const containerAspectRatio: number = containerWidth/containerHeight;

        if( containerAspectRatio >= videoAspectRatio ){
            const height: number = containerHeight;
            const width: number =  (videoWidth * containerHeight)/videoHeight;
            return {width, height};
        }

        const width: number = containerWidth;
        const height: number =  (containerWidth * videoHeight)/videoWidth;

        return {width, height};
    }

    public static append_div( container: HTMLDivElement, width: string, height: string, color: string = '#000000' ): HTMLDivElement {

        const wrapper = document.createElement('div');

        wrapper.style.width = width;
        wrapper.style.height = height;
        wrapper.style.position = 'relative';
        wrapper.style.display = 'flex';
        wrapper.style.justifyContent = 'center';
        wrapper.style.alignItems = 'center';
        wrapper.style.backgroundColor = color;

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

    public static async create_video( /*container: HTMLDivElement,*/ videoPath: string, callbacks: any = {} ): Promise<HTMLVideoElement> {
        
        return new Promise( (resolve, reject) => {

            const video: HTMLVideoElement = document.createElement('video');
            video.src = videoPath;
                
            // setting video styles
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
            video.controls = false;
            video.muted = true;
            
            setInterval( () => {
                if( 'ontimeupdate' in callbacks ){
                    callbacks['ontimeupdate']();
                }
            }, 50)
            
            video.onloadeddata = () => {
                resolve(video);
            }

        });

    }




}