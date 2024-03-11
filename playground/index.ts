import { MLVideo } from '../src/index';

const main = async () => {

    const mainDiv: HTMLDivElement = <HTMLDivElement>document.getElementById('main-div');
    const video: MLVideo = new MLVideo( mainDiv, './data/left.mp4');

    const poses = fetch('./data/left_people.json')
        .then((response) => response.json())
        .then((json) => {   

            setTimeout(() => {

                const posesSubset = json.slice(500, 600).map( (frame: any) => {

                    if( frame.poses == null ){
                        return []
                    }
                    return frame.poses;
    
                });


                video.set_range_data( [500, 600], posesSubset );
                video.play_range();
            }, 2000);

            setTimeout(() => {

                const posesSubset = json.slice(2000, 2300).map( (frame: any) => {

                    if( frame.poses == null ){
                        return []
                    }
                    return frame.poses;
    
                });

                video.set_range_data( [2000, 2300], posesSubset );
                video.play_range();
                

            }, 6000)

        });




}

main();