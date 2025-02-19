import { MLVideo } from '../src/index';

const main = async () => {

    const mainDiv1: HTMLDivElement = <HTMLDivElement>document.getElementById('main-div-1');
    const video: MLVideo = new MLVideo( mainDiv1 );

    await video.create_video( './data/bytetrack_merge/sensor_4_right.mp4' );

    const poses1 = fetch('./data/bytetrack_merge/sensor_4_right_detections.json')
    .then((response) => response.json())
    .then((json) => {   

        const boxes = json.detections.map( (frame: any, i: number) => {

            if( !frame ){
                return [];
            }

            const frameBoxes: { points: number[], id: string}[] = frame.map( (a: any, j: number) => {
                return { id: `${a.trackID}`, points: a.boundingBox };
            })

            return frameBoxes;

        });

        const poses = json.detections.map( (frame: any, i: number) => {

            if( !frame ){
                return [];
            }
            
            const p: any[] = [];
            frame.forEach( (a: any, j: number) => {

                if( ('pose' in a && a['pose']) && a['classID'] == 0 ){
                    p.push( { id: `${frame['trackID']}`, points: a.pose } );
                }

                
            })

            return p;

        })

        video.set_range_data( [15000, 20000], poses.slice(15000, 20000), boxes.slice(15000, 20000) );
        video.play_range();

    });
}

main();