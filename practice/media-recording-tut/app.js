const videoRecord = document.querySelector('#video-record');
const videoControls = document.querySelector("#video-controls");
const constraints = {
    audio: true,
    video: {
        width: 1280,
        height: 720,
        facingMode: 'user' 
    }
}
let recorder;
const recordedChunks = [];
async function getMedia(constraints){
    let  stream =  null;
    try{
       stream = await navigator.mediaDevices.getUserMedia(constraints);
       return stream;
    }catch(err){
        console.error(err)
    }
}
async function startRecording() {
    const stream = await getMedia(constraints);
    const video = document.createElement("video");
    video.id = "video-preview";
    if ('srcObject' in video){
        video.srcObject = stream;
    }else {
        URL.createObjectURL(stream)
    }
     recorder = new MediaRecorder(stream, {
        mimeType : "video/webm;codecs=vp9",
        
    }); 
    recorder.start();
    recorder.onstart = () => {

        const pause = document.createElement("button");
        pause.id="pause-btn";
        pause.textContent ="pause recording";
        videoControls.appendChild(pause);
        pause.addEventListener('click', () => pauseRecording(pause));
        const stop = document.createElement("button");
        stop.id = "stop-btn";
        stop.textContent = "stop recording";
        videoControls.appendChild(stop);
        stop.addEventListener('click', () => stopRecording(stop, pause));
    }
    recorder.ondataavailable = (evt) => {
        if(!!evt.data.size){
            recordedChunks.push(evt.data)
        }
    }
}
function pauseRecording(pause) {
    if(recorder instanceof MediaRecorder){
        if(recorder.state === 'recording'){
            recorder.pause();
            pause.textContent = "resume recording";
        }else{
            recorder.resume();
            pause.textContent = "pause recording";
        }
    }
}
function stopRecording(stop, pause){
    if(recorder instanceof MediaRecorder && recorder.state === 'recording'){
        recorder.stop();
        recorder.onstop = () =>{
           const videoBlob = new Blob(recordedChunks, {
                type : "video/webm"
            });
            const videoUrl = URL.createObjectURL(videoBlob);
            const downloadLink = document.createElement('a');
            downloadLink.href = videoUrl;
            downloadLink.download = "recorded.webm"
            videoControls.appendChild(downloadLink);
            videoControls.removeChild(stop);
            videoControls.removeChild(pause);
            
        }
    }
}
videoRecord.addEventListener('click', startRecording);
