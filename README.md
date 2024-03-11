# MLVideo :running_woman:

MLVideo is a library that interactively and meaningfully visualizes outputs of vision models, such as pose detection. 

[Example](https://github.com/joaorulff/MLVideo/assets/7430591/447d3559-61ec-4252-bee3-3036f24ddcb3)


## Installation

A npm local package is provided under ``./package``.

## Development

To start a development server run ``npm install`` followed by ``npm run dev``. The server will start on port 4000. The static files must be under ``./playground``.

To generate a new version of the local package run: ```npm run build-dist```. Then, ```npm pack```

## Usage

A sample of the data is provided here: TBD

```typescript
    const mainDiv: HTMLDivElement = <HTMLDivElement>document.getElementById('div-container');
    const video: MLVideo = new MLVideo( mainDiv, './path/to/video.mp4');

    // poses variable has a set of poses per frame; Each pose is defined by a set of joints ([number, number]). We assume there will be 17 joints per skeleton, following the YOLO pose format. 
    const range: [number, number] = [5000, 6000];
    let poses: number[][][] = await fetch('./path/to/people.json');
    poses = poses.slice( range[0], range[1] );

    video.set_range_data( range, poses );
    video.play_range();
```





