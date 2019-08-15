const radius  = 0.05;
const distance  = 2;
let clickCount = 0;

const soundType = 'sound'
const visualType = 'visual'

let activeAudio
let activeAudioURI

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
        {name: 'mom-image', pitch: -5, yaw: -49, media: {type: soundType, fileURI: '../sound/kitt.mp3', playing: false}},
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

const currentPageHotspots = hotspots[pageName]
const hotspotNames = currentPageHotspots.map((hotspot) => hotspot.name)

vrView.on('ready', function(){
    generateHotspots(currentPageHotspots)
});

vrView.on('click', function(event){
    // get and the media attributes of the hotspot object
    // in the same index in the array of hotspot objects
    // as the event.id (the hotspot name) is in the array of hotspot names

    media = currentPageHotspots[hotspotNames.indexOf(event.id)].media

    if(media.type === soundType){
        media.playing = !media.playing
        toggleAudioFile(media.fileURI, media.playing)
    }
})

toggleAudioFile = (fileURI, playing) => {
    if(activeAudio && activeAudioURI === fileURI){
        return
    } else {
        activeAudio = new Audio(fileURI)
        activeAudioURI = fileURI
    }

    // TODO: Debug toggling
    playing ? activeAudio.play() : activeAudio.pause()
}
