// test code to be bundled by browserify in order to be serviced on client
// before launching this script you should make sure you have signalhub listening (e.g. signalhub listen -p 8080)

const createSwarm = require('webrtc-swarm')

const signalhub = require('signalhub')
const hub = signalhub('CidTest', ['http://localhost:8080'])

console.log('communication is running')

const swarm = createSwarm(hub, {
    wrtc: require('wrtc') // don't need this if used in the browser
})

swarm.on('peer', function (peer, id) {
    console.log('connected to a new peer:', id)
    console.log('total peers:', swarm.peers.length)
})

swarm.on('connect', function (peer, id) {
    //datachannel
    peer.on('data', function (data) {
        data = JSON.parse(data.toString())
        console.log(data)
    })
})

swarm.on('disconnect', function (peer, id) {
    console.log('disconnected from a peer:', id)
    console.log('total peers:', swarm.peers.length)
})

setTimeout(() => swarm.peers.forEach(function (peer) {
    console.log('saying hi to the others')
    peer.send(JSON.stringify('hi'))
}), 10000);
