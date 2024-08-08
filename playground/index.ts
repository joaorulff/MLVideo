import { MLVideo } from '../src/index';

const main = async () => {

    const mainDiv1: HTMLDivElement = <HTMLDivElement>document.getElementById('main-div-1');
    const video: MLVideo = new MLVideo( mainDiv1 );

    await video.create_video( './data/bytetrack/left.mp4' );

    const poses1 = fetch('./data/bytetrack/20240807_bytetrack_left_annotations.json')
    .then((response) => response.json())
    .then((json) => {   

        const boxes = json.annotations.map( (frame: any, i: number) => {

            if( !frame ){
                return [];
            }

            const frameBoxes: { topLeft: [number, number], bottomRight: [number, number], id: string}[] = frame.boundingBoxes.map( (box: number[], j: number) => {
                return { id: `${frame['trackIDs'][j]}`, points: box };
            })

            return frameBoxes;

        })

        video.set_range_data( [10000, 20000], [], boxes.slice(10000, 20000) );
        video.play_range();

    });
}

main();