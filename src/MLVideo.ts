import {DOMUtils} from './utils/dom.utils';

// types
import { Point, Box, Pose } from './types';

// external
import * as d3 from 'd3';

export class MLVideo {

    public videoContainer!: HTMLDivElement;
    public video!: HTMLVideoElement;
    public svg!: d3.Selection<any,any,any,any>;

    public playRange: [number, number] = [0, 0];

    // Geometric objects
    // public points: Point[] = [];
    public boxes: Box[][] = [];
    public poses: Pose[][] = [];

    // Objects visibility
    public poseVisibility: boolean = false;
    public boundingboxVisibility: boolean = true;

    // constants
    public rangeScale: 'FRAME' | 'SECONDS' = 'FRAME';
    public frameRate: number = 14.4;
    public tail: number = 2;
    
    public SKELETON: [number, number][] = [
        [1, 3], [1, 0], [2, 4], [2, 0], [0, 5], [0, 6], [5, 7], [7, 9], [6, 8], [8, 10], [5, 11], [6, 12], [11, 12],
        [11, 13], [13, 15], [12, 14], [14, 16]
    ];

    // scales
    private xScale!: d3.ScaleLinear<any, any>;
    private yScale!: d3.ScaleLinear<any, any>;
    public tailScale = d3.scalePow([0, this.tail], [0, 1]);

    constructor( public container: HTMLDivElement ){}    

    public set_range_data( range: [number, number], poses: Pose[][] = [], boxes: Box[][] = [] ): void {

        // clearing 
        this.update_poses( [] );
        this.update_bounding_boxes( [] );

        // setting range
        this.playRange = range;

        // setting range geometric objects
        this.poses = poses;
        this.boxes = boxes;

        // stopping video and positioning track
        this.video.pause();
        this.video.currentTime = range[0]/this.frameRate;

    }

    public play_range(): void {

        this.video.currentTime = this.playRange[0]/this.frameRate;
        this.video.play();
    }

    public stop_video(): void {

        this.video.pause();

        // clearing
        this.update_poses( [] );
    }
 
    private update( event: Event ): void {

        if( !this.video || this.video.paused ){
            return;
        }

        let currentTime: number = this.video.currentTime;
        if( this.rangeScale == 'FRAME' ){
            currentTime = currentTime*this.frameRate;
        }

        if( currentTime > this.playRange[1] ){
            this.stop_video();
            return;
        }
        
        const index: number = Math.ceil(currentTime - this.playRange[0]);
        const start: number = (index - this.tail) < 0 ? 0 : (index - this.tail);
        const end: number = index;

        // if the index is less than 0, it will try to render all the provided data, crashing the application.
        // It happens because currentTime start as something slightly smaller than the initial timestamp.
        // Ex: if I set the timestamp to start at frame 400, currentTime might be 399.999. This is because the frame rate precision.
        if( index < 0 ){
            return;
        }

        const trajectory: Pose[][] = this.poses.slice( start, end );
        const box: Box[][] = this.boxes.slice( start, end );

        if( this.poseVisibility ) this.update_poses( trajectory );
        if( this.boundingboxVisibility ) this.update_bounding_boxes( box );

    }

    private update_bounding_boxes( boxes: Box[][] ): void {

        const timeGroups = this.svg
            .selectAll('.time-group')
            .data( boxes )
            .join(
                enter => enter
                    .append('g')
                    .attr('class', 'time-group')
                    .attr('transform', 'translate(0,0)')
                    .attr('opacity', (d: any, index: number) => this.tailScale(index) ),
                update => update,
                exit => exit.remove()
        )

        const boxGroups = timeGroups
            .selectAll('.box-group')
            .data( (boxes: Box[]) => boxes )
            .join(
                enter => enter
                    .append('g')
                    .attr('class', 'box-group')
                    .attr('transform', 'translate(0,0)'),
                update => update,
                exit => exit.remove()
        )

        const boxeElements = boxGroups
            .selectAll('.box-rect')
            .data( (box: Box) => [box.points] )
            .join(
                enter => enter
                    .append('rect')
                    .attr('class', 'box-rect')
                    .attr('x', (points: number[]) => this.xScale(points[0]) )
                    .attr('y', (points: number[]) => this.yScale(points[1]) )
                    .attr('width', (points: number[]) => this.xScale(points[2] - points[0]) )
                    .attr('height', (points: number[]) => this.yScale(points[3] - points[1]))
                    .attr('stroke', '#370617')
                    .attr('stroke-width', 5)
                    .attr('fill', '#9d0208'),
                update => update  
                    .attr('x', (points: number[]) => this.xScale(points[0]) )
                    .attr('y', (points: number[]) => this.yScale(points[1]) )
                    .attr('width', (points: number[]) => this.xScale(points[2] - points[0]) )
                    .attr('height', (points: number[]) => this.yScale(points[3] - points[1]) ),
                exit => exit.remove()
            )


    }

    private update_poses( poses: Pose[][] ): void {

        const timeGroups = this.svg
            .selectAll('.time-group')
            .data( poses )
            .join(
                enter => enter
                    .append('g')
                    .attr('class', 'time-group')
                    .attr('transform', 'translate(0,0)')
                    .attr('opacity', (d: any, index: number) => this.tailScale(index) ),
                update => update,
                exit => exit.remove()
            )

        const poseGroups = timeGroups
            .selectAll('.pose-group')
            .data( (poses: Pose[]) => poses )
            .join(
                enter => enter
                    .append('g')
                    .attr('class', 'pose-group')
                    .attr('transform', 'translate(0,0)'),
                update => update,
                exit => exit.remove()
            )

        const poseBones = poseGroups
            .selectAll('.pose-bone')
            .data( (pose: Pose) => {
                
                const bones: number[][][] = [];
                this.SKELETON.forEach( (boneJoint: [number, number]) => {
                    const bone: number[][] = [ pose.points[boneJoint[0]], pose.points[boneJoint[1]] ];
                    bones.push( bone );
                })

                return bones;
            })
            .join(
                enter => enter
                    .append('line')
                    .attr('class', 'pose-bone')
                    .attr('x1', (coord: number[][]) => this.xScale(coord[0][0]) )
                    .attr('y1', (coord: number[][]) => this.xScale(coord[0][1]) )
                    .attr('x2', (coord: number[][]) => this.yScale(coord[1][0]) )
                    .attr('y2', (coord: number[][]) => this.xScale(coord[1][1]) )
                    .style("stroke", "#33a02c")
                    .style("stroke-width", 3),
                update => update  
                    .attr('x1', (coord: number[][]) => this.xScale(coord[0][0]) )
                    .attr('y1', (coord: number[][]) => this.xScale(coord[0][1]) )
                    .attr('x2', (coord: number[][]) => this.yScale(coord[1][0]) )
                    .attr('y2', (coord: number[][]) => this.xScale(coord[1][1]) ),
                exit => exit.remove()

            )

        const poseJoints = poseGroups
            .selectAll('.pose-joint')
            .data( (pose: Pose) => pose.points )
            .join(
                enter => enter
                    .append('circle')
                    .attr('class', 'pose-joint')
                    .attr('cx', (coord: [number, number]) => this.xScale(coord[0]) )
                    .attr('cy', (coord: [number, number]) => this.yScale(coord[1]) )
                    .attr('r', 2)
                    .attr('fill', '#1f78b4'),
                update => update  
                    .attr('cx', (coord: [number, number]) => this.xScale(coord[0]) )
                    .attr('cy', (coord: [number, number]) => this.yScale(coord[1]) ),
                exit => exit.remove()
            )
    }

    public destroy_video(): void {

        while (this.container.firstChild) {
            if( this.container.lastChild )
            this.container.removeChild(this.container.lastChild);
          }

    }

    public async create_video( videoPath: string ): Promise<void> {

        // creating video inside the container
        this.video = await DOMUtils.create_video( videoPath, {'ontimeupdate': (event: Event) => this.update(event)} );

        // setting container size
        const containerSize: {width: number, height: number} = DOMUtils.get_video_container_size( this.video.videoWidth, this.video.videoHeight, this.container.clientWidth, this.container.clientHeight );
        
        const videoWrapper: HTMLDivElement = DOMUtils.append_div( this.container, '100%', '100%', '#000000' );
        this.videoContainer = DOMUtils.append_div( videoWrapper, `${containerSize.width}px`, `${containerSize.height}px` );
        this.videoContainer.append(this.video);

        // creating SVG
        this.svg = DOMUtils.create_svg( this.videoContainer );

        // creating scales
        this.xScale = d3.scaleLinear().domain([0,this.video.videoWidth]).range([0,this.video.offsetWidth]);
        this.yScale = d3.scaleLinear().domain([0,this.video.videoHeight]).range([0,this.video.offsetHeight]);

    }



}