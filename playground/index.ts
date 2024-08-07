import { MLVideo } from '../src/index';

const main = async () => {

    const mainDiv1: HTMLDivElement = <HTMLDivElement>document.getElementById('main-div-1');
    const video: MLVideo = new MLVideo( mainDiv1 );
    await video.create_video( './data/sensor_2_left.mp4' );

    const poses1 = fetch('./data/sensor_2_left_detections.json')
    .then((response) => response.json())
    .then((json) => {   

        const posesSubset = json.slice(400, 2000).map( (frame: any) => {
            return frame.poses.filter( (pose: any) => pose != null );
        });

        console.log(posesSubset);
        
        video.set_range_data( [400, 450], [] );
        video.play_range();

    });
}

main();