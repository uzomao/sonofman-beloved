const radius  = 0.05;
const distance  = 2;
let clickedEvents = []

const soundType = 'sound'
const displayType = 'display'
const navigateType = 'navigate'

let activeAudio
let activeAudioURI

const mapPathnameToPage = {
    '/': 'index',
}

const clickCountObj = {
    'index': {
        'minClicks': 3,
        'hotspot': {name: 'staircase', pitch: -42, yaw: 105, 
                    media: {type: navigateType, navText: 'Do you want to go upstairs?', navLink: '/staircase.html'}
                }
    },
    'room': 3,
    'chapel': 2,
}

const navHotspots = ['staircase', 'sheila', 'door', 'chapelDoor']

const pageName = mapPathnameToPage[window.location.pathname]

const vrView = new VRView.Player('#vrview', {
    image: `images/rooms/${pageName}.JPG`,
    width: '100%',
    height: '768'
})

const hotspots = {
    'index': [
        {name: 'family-album', pitch: 10, yaw: 180, media: {type: displayType, divId: 'book-wrapper'}},
        {name: 'dad-image', pitch: -5, yaw: -17, media: {type: soundType, fileURI: '../sound/achebe.mp3', playing: false}},
        {name: 'mom-image', pitch: -5, yaw: -49, media: {type: soundType, fileURI: '../sound/kitt.mp3', playing: false}},
        {name: 'altar', pitch: -25, yaw: 118, media: {type: displayType, divId: 'job-wrapper'}}
    ],
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

    if(event.id){
        if(navHotspots.indexOf(event.id) === -1){
            media = currentPageHotspots[hotspotNames.indexOf(event.id)].media

            if(media.type === soundType){
                media.playing = !media.playing
                toggleAudioFile(media.fileURI, media.playing)
            } else if(media.type === displayType){
                document.getElementById(media.divId).style.display = 'block'

                if(event.id === 'altar'){
                    turnJs()
                }
            }
        } else {
            media = clickCountObj[pageName].hotspot.media

            if(confirm(media.navText)){
                window.location.href = media.navLink
            }
        }
        
        if(clickedEvents.indexOf(event.id) === -1){
            clickedEvents.push(event.id)
        }

        if(clickedEvents.length === clickCountObj[pageName].minClicks){
            const { name, pitch, yaw } = clickCountObj[pageName].hotspot
            vrView.addHotspot(name, {
                pitch: pitch,
                yaw: yaw,
                radius: radius,
                distance: distance
            })
        }
    }
})

toggleAudioFile = (fileURI, playing) => {
    if(activeAudio && activeAudioURI === fileURI){
        playing ? activeAudio.play() : activeAudio.pause()
        return
    } else {
        activeAudio = new Audio(fileURI)
        activeAudioURI = fileURI
    }

    playing ? activeAudio.play() : activeAudio.pause()
}

hideDiv = (divId) => {
    document.getElementById(divId).style.display = 'none';
}

turnJs = () => {
    $("#book-of-job").turn({
        width: 900,
        height: 500,
        autoCenter: true,
        page: 1
    });
    $("#book-of-job").bind("last", function(event) {
        setTimeout(function(){
            $('#job-wrapper').css('display', 'none');
        }, 5000);
    });
}