// Peer JS

navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || 
    navigator.msGetUserMedia)

function bindEvents(p) {
    
    p.on('error', function(err) {
        console.log('error', err)
    })
    
    p.on('signal', function(data) {
        document.querySelector('#offer').textContent = JSON.stringify(data)
    })

    p.on('stream', function(stream) {
        let video = document.querySelector('#receiver-video')
        video.volume = 0
        video.srcObject = stream
        video.play()
    })
    
    document.querySelector('#incoming').addEventListener('submit', function(e) {
        e.preventDefault();
        p.signal(JSON.parse(e.target.querySelector('textarea').value))
    })

}

function startPeer(initiator) {
    
    if (navigator.getUserMedia) {
        navigator.getUserMedia(
        {
            video: true,
            audio: true
        },
        function(stream) {

            let p = new SimplePeer({
                initiator: initiator,
                stream: stream,
                trickle: false
            })

            bindEvents(p)

            let emitterVideo = document.querySelector('#emitter-video')
            emitterVideo.volume = 0
            emitterVideo.srcObject = stream
            emitterVideo.play()
        },
        function(err) {
            console.log('The following error occurred when trying to use getUserMedia: ' + err)
        }
    );

    } else {
        alert('Sorry, your browser does not support getUserMedia')
    }
}

document.querySelector('#start').addEventListener('click', function(e) {
    startPeer(true)
})

document.querySelector('#receive').addEventListener('click', function(e) {
    startPeer(false)
})
