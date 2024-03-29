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
    '/chapel.html': 'chapel'
}

const clickCountObj = {
    'index': {
        'minClicks': 3,
        'hotspot': {
            name: 'staircase',
            pitch: 10,
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
            pitch: 15,
            yaw: -135,
            media: {
                type: navigateType,
                navText: 'Head to the chapel?',
                navLink: '/chapel.html'
            }
        }
    },
    'chapel': {
        'minClicks': 2,
        'hotspot': {
            name: 'chapelDoor',
            pitch: 0,
            yaw: -67,
            media: {
                type: navigateType,
                navText: 'Leave the house?',
                navLink: '/'
            }
        }
    },
}

const navHotspots = ['staircase', 'roomDoor', 'chapelDoor']

const pageName = mapPathnameToPage[window.location.pathname]

const vrView = new VRView.Player('#vrview', {
    image: `images/rooms/${pageName}.JPG`,
    width: '100%',
    height: '768'
})

const displayTypeContents = {
    'chapel': {
        'nb-rosary': 'https://drive.google.com/file/d/19l0egHcMpA6ptYZr_y1c3__OPp0HQNRc/preview',
        'nb-mary-left-arm': 'https://drive.google.com/file/d/1sGu8WIAuRTQzGbGEnvQSWbMiOxWndmRp/preview',
        'nb-mary-right-arm': 'https://drive.google.com/file/d/1051dVkarxC2M8FmYHLfKi5Q8Yxa3JNab/preview',
        'head-of-jesus': 'https://drive.google.com/file/d/19PuYO34tIQmQ2qhBTRWpnnLGcA4r5oQN/preview',
        'pew-books': 'https://drive.google.com/file/d/1ZQDKYPf8th8c0_ulAejvw0H-30iVG5-A/preview',
        'matchbox': 'https://drive.google.com/file/d/1fCK50wKtDEccy7TeN1tgg7xdgxPv2uwp/preview',
        'infant-of-prague': 'https://drive.google.com/file/d/1Y9TXYWlx6XvzEzCjG6BuOhQGiGePC8D8/preview',
        'curtain': 'https://drive.google.com/file/d/1yjqn-jXZ-HJQRuxDkgWyowvcF68sQZsc/preview',
        'pews': 'https://drive.google.com/file/d/1x2p-dwzwZu5mdWxRYzWcCjwyszzdBFMn/preview',
        'podium': 'https://drive.google.com/file/d/1hPdW1VH5GvxtSWJylrX47lJsS1idQeRH/preview',
        'melting-candle': 'https://drive.google.com/file/d/1yHap-l3Zt4kMddLWiQBD8GyyrVXRseRk/preview'
    }
}

const hotspots = {
    'index': [
        {name: 'family-album', pitch: -10, yaw: 180, media: {type: displayType, divId: 'book-wrapper'}},
        {name: 'dad-image', pitch: -5, yaw: -17, media: {type: soundType, fileURI: '../sound/achebe.mp3', playing: false}},
        {name: 'mom-image', pitch: -5, yaw: -49, media: {type: soundType, fileURI: '../sound/kitt.mp3', playing: false}},
        {name: 'altar', pitch: 15, yaw: 118, media: {type: displayType, divId: 'book-wrapper'}},
        {name: 'record-player', pitch: -12.5, yaw: 15, media: {type: displayType, divId: 'record-player'}},
        {name: 'television', pitch: 22.5, yaw: 12.5}
    ],
    'staircase': [
        {name: 'sheila', pitch: 15, yaw: 140, media: {type: navigateType, navText: 'Go to the next room?', navLink: '/room.html'}}
    ],
    'room': [
        {name: 'bed', pitch: 10, yaw: 0, media: {type: soundType, fileURI: '../sound/kitt.mp3', playing: false}},
        {name: 'rosary', pitch: 30, yaw: -105, media: {type: soundType, fileURI: '../sound/hymn.mp3', playing: false}},
        {name: 'shoes', pitch: 0, yaw: -125, media: {type: soundAndDisplayType, soundFile: '../sound/achebe_interview.mp3', playing: false, visualDivId: 'biafra-map'}},
        {name: 'curtain', pitch: 20, yaw: 20},
        {name: 'couch', pitch: 15, yaw: 70},
        {name: 'office-chair', pitch: 10, yaw: -52.5},
        {name: 'tv', pitch: 30, yaw: 150}
    ],
    'chapel': [
        {name: 'pew-books', pitch: -20, yaw: 13, media: {type: displayType, divId: 'pew-books'}},
        {name: 'rosary', pitch: 35, yaw: 117, media: {type: displayType, divId: 'nb-rosary' }},
        {name: 'mary-left-arm', pitch: 20, yaw: 165, media: {type: displayType, divId: 'nb-mary-left-arm'}},
        {name: 'mary-right-arm', pitch: 16.5, yaw: 145, media: {type: displayType, divId: 'nb-mary-right-arm'}},
        {name: 'head-of-jesus', pitch: 30, yaw: 180, media: {type: displayType, divId: 'head-of-jesus'}},
        {name: 'matchbox', pitch: -17, yaw: 125, media: {type: displayType, divId: 'matchbox'}},
        {name: 'infant-of-prague', pitch: 0, yaw: -142.5, media: {type: displayType, divId: 'infant-of-prague'}},
        {name: 'curtain', pitch: 17, yaw: 90, media: {type: displayType, divId: 'curtain'}},
        {name: 'pews', pitch: 0, yaw: 0, media: {type: displayType, divId: 'pews'}},
        {name: 'podium', pitch: -55, yaw: 180, media: {type: displayType, divId: 'podium'}},
        {name: 'melting-candle', pitch: 0, yaw: -90, media: {type: displayType, divId: 'melting-candle'}},

    ]
}

const bookPages = {
    'altar': ['job/job.png', 'job/job-1.png', 'job/job-2.png', 'job/job-3.png', 'job/job-4.png'],
    'family-album': ['youngman.jpg', 'youngman.jpg', 'youngman.jpg']
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
        if(!navHotspots.includes(event.id)){
            media = currentPageHotspots[hotspotNames.indexOf(event.id)].media

            if(media.type === soundType){
                media.playing = !media.playing
                toggleAudioFile(media.fileURI, media.playing)
            } else if(media.type === displayType){

                if(event.id === 'altar' || event.id === 'family-album'){
  
                    document.getElementById('book-wrapper').style.display = 'block'
                    const bookBlockDiv = document.getElementById('bb-bookblock')

                    //empty out the node first
                    while(bookBlockDiv.firstChild){
                        bookBlockDiv.removeChild(bookBlockDiv.firstChild)
                    }

                    let count = 0;
                    for(page of bookPages[event.id]){
                        let bookDiv = document.createElement('div')
                        bookDiv.className = 'bb-item'

                        if(count === 0){
                            bookDiv.style.display = 'block'
                        }

                        count += 1

                        // Need to also understand how to prevent that 'undefined' white page on page turn.

                        let pageImg = document.createElement('img')
                        pageImg.src = `images/${page}`
                        pageImg.className = 'dialog-img'
                        pageImg.alt = 'dialog'

                        bookDiv.appendChild(pageImg)
                        bookBlockDiv.appendChild(bookDiv)
                    }

                } else {
                    toggleDivDisplay(media.divId)
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
        
        if(!clickedEvents.includes(event.id)){
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
    let div;
    console.log(displayTypeContents[pageName][divId])

    if(pageName === 'chapel'){
        div = document.getElementById('caritas-video')
        div.src = displayTypeContents[pageName][divId]
    } else {
        div = document.getElementById(divId)
    }

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