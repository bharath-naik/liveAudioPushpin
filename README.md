# liveAudioPushpin
record a live microphone stream from browser and let listeners listen to the live stream via pushpin. backend is nodejs server.

Project structure:

*micUploadStream.html* : webpage where live mic stream is recorded and then sent to a websocket server

*websocketServer.js* : receive live mic audio in blobs and push to pushpin

*backend.js* : nodejs server which is reverse proxied by pushpin. This is where headers for subscribing to pushpin channels are set. Throttling and chunk sizes are adjusted. On http request, first audio chunk containing headers from a file is sent in response. This file's bitrate is same as microphone bitrate (32000 bits per second).
