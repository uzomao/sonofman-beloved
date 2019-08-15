const radius  = 0.05;
const distance  = 2;
let clickCount = 0;

const mapPathnameToPage = {
    "/": "index"
}

const pageName = mapPathnameToPage[window.location.pathname]

const vrView = new VRView.Player('#vrview', {
    image: `images/rooms/${pageName}.JPG`,
    width: '100%',
    height: '768'
})

const hotspots = {
    'index': [
        {name: 'family-album', pitch: 10, yaw: 180},
        {name: 'dad-image', pitch: -5, yaw: -17},
        {name: 'mom-image', pitch: -5, yaw: -49},
        {name: 'altar', pitch: -25, yaw: 118}
    ]
}

generateHotspots = (hotspots) => {
    hotspots.forEach(( { name, pitch, yaw } ) => {
        vrView.addHotspot(name, {
            pitch: pitch,
            yaw: yaw,
            radius: radius,
            distance: distance
        })
    })
}

vrView.on('ready', function(){
    generateHotspots(hotspots[pageName])
});