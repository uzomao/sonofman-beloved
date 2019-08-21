const radius  = 0.05;
const distance  = 2;
let clickedEvents = []
let isNavHotspotAdded = false

const soundType = 'sound'
const displayType = 'display'
const navigateType = 'navigate'
const soundAndDisplayType = 'sound-display'

let activeAudio
let activeAudioURI

const mapPathnameToPage = {
    '/': 'index',
    '/staircase.html': 'staircase',
    '/room.html': 'room',
}

const clickCountObj = {
    'index': {
        'minClicks': 3,
        'hotspot': {
            name: 'staircase',
            pitch: -42,
            yaw: 105, 
            media: {
                type: navigateType,
                navText: 'Do you want to go upstairs?',
                navLink: '/staircase.html'}
            }
    },
    'room': {
        'minClicks': 3,
        'hotspot': {
            name: 'roomDoor',
            pitch: -15,
            yaw: -135,
            media: {
                type: navigateType,
                navText: 'Head to the chapel?',
                navLink: '/chapel.html'
            }
        }
    },
    'chapel': 2,
}

const navHotspots = ['staircase', 'roomDoor', 'chapelDoor']

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
    'staircase': [
        {name: 'sheila', pitch: -15, yaw: 140, media: {type: navigateType, navText: 'Go to the next room?', navLink: '/room.html'}}
    ],
    room: [
        {name: 'bed', pitch: 10, yaw: 0, media: {type: soundType, fileURI: '../sound/kitt.mp3', playing: false}},
        {name: 'rosary', pitch: -65, yaw: -125, media: {type: soundType, fileURI: '../sound/hymn.mp3', playing: false}},
        {name: 'shoes', pitch: 0, yaw: -125, media: {type: soundAndDisplayType, soundFile: '../sound/achebe_interview.mp3', playing: false, visualDivId: 'biafra-map'}},
        {name: 'curtain', pitch: 20, yaw: 20},
        {name: 'couch', pitch: 35, yaw: 70},
        {name: 'office-chair', pitch: 20, yaw: -52.5},
        {name: 'tv', pitch: -30, yaw: 150}
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
            } else if(media.type === navigateType){
                // this else-if is only being done for the staircase page, where the minClick is 1 and
                // the only hotspot is a navigation one (in current form)

                navigateToLink(media.navText, media.navLink)
            } else if(media.type === soundAndDisplayType){
                media.playing = !media.playing
                toggleAudioFile(media.soundFile, media.playing)

                toggleDivDisplay(media.visualDivId)
            }
        } else {
            media = clickCountObj[pageName].hotspot.media

            navigateToLink(media.navText, media.navLink)
        }
        
        if(clickedEvents.indexOf(event.id) === -1){
            clickedEvents.push(event.id)
        }

        if(clickedEvents.length === clickCountObj[pageName].minClicks && !isNavHotspotAdded){
            const { name, pitch, yaw } = clickCountObj[pageName].hotspot
            vrView.addHotspot(name, {
                pitch: pitch,
                yaw: yaw,
                radius: radius,
                distance: distance
            })
            isNavHotspotAdded = true
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

toggleDivDisplay = (divId) => {
    let div = document.getElementById(divId)

    if(div.style.display === '' || div.style.display === 'none'){
        div.style.display = 'block'
    } else {
        div.style.display = 'none'
    }
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

navigateToLink = (text, link) => {
    if(confirm(text)){
        window.location.href = link
    }
}

$( '#bb-bookblock' ).bookblock();

$(' .close-book ').click(function(){
    hideDiv('book-wrapper')
})