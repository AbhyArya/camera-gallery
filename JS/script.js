// Element Selected
const video = document.querySelector("video");
const recordBtnCont = document.querySelector(".record-btn-cont");
const captureBtnCont = document.querySelector(".capture-btn-cont");
const recordBtn = document.querySelector(".record-btn");
const captureBtn = document.querySelector(".capture-btn");

// Filter color variable
let trasparentColor = "transparent"

// Recorder toggle variable
let recordFlag = false;

let recorder;

let chucks = [];
const constraints = {
  video: true,
  audio: false,
};

// Camera access using mediaDevice API
navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
  video.srcObject = stream;
  recorder = new MediaRecorder(stream);
  recorder.addEventListener("start", (e) => {
    chucks = [];
  });
  recorder.addEventListener("dataavailable", (e) => {
    chucks.push(e.data);
  });

  recorder.addEventListener("stop", (e) => {
    let blob = new Blob(chucks, { type: "video/mp4" });
      if(DB){
        const videoId = "vid-"+shortid()
        const DBTransaction = DB.transaction('video', 'readwrite')
        const videoStore =DBTransaction.objectStore("video")
        const videoEntry = {
          id:videoId,
          blobData: blob
        }
        videoStore.add(videoEntry)
      }

  });
});

// Recorder btn click listener
recordBtnCont.addEventListener("click", (e) => {
  if (!recorder) {
    return;
  }
  recordFlag = !recordFlag;
  if (recordFlag) {
      recordBtn.classList.add("scale-record");
      recorder.start();
      startTimer()
  } else {
      recordBtn.classList.remove("scale-record");
      recorder.stop();
      stopTimer()
  }
});
// Capture btn click listener
captureBtnCont.addEventListener("click", (e) => {
  captureBtn.classList.add("scale-capture")
  const canvas = document.createElement("canvas")
  canvas.height = video.videoHeight
  canvas.width = video.videoWidth
  const tool = canvas.getContext("2d")
  tool.drawImage(video,0,0,canvas.width, canvas.height)
  tool.fillStyle = trasparentColor 
  tool.fillRect(0,0,canvas.width, canvas.height)
  const imageURL = canvas.toDataURL();
  if(DB){
    const imageId = "img-"+shortid()
    const DBTransaction = DB.transaction('image', 'readwrite')
    const videoStore =DBTransaction.objectStore("image")
    const imageEntry = {
      id:imageId,
      blobData: imageURL
    }
    videoStore.add(imageEntry)
  }
  setTimeout(() => {
    captureBtn.classList.remove("scale-capture")
  }, 100);
});

let timerID;
let counter = 0;
const timer = document.querySelector(".timer");

// Start timer while recording
function startTimer() {
  timer.style.display = "block"
  function displayTimer() {
    let totalSeconds = counter;
    let hour = Number.parseInt(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Number.parseInt(totalSeconds / 60);
    totalSeconds %= 60;
    let seconds = totalSeconds;
    hour = hour < 10 ? `0${hour}` : hour;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    timer.innerText = `${hour}:${minutes}:${seconds}`;
    counter++;
  }
  timerID = setInterval(displayTimer, 1000);
}
// Stop timer while recording
function stopTimer() {
  counter =0
  timer.style.display = "none"
  clearInterval(timerID);
  timer.innerText = "00:00:00";
}

const filterLayer = document.querySelector(".filter-layer")
const allfilter = document.querySelectorAll(".filter")
// Filter change listeners
allfilter.forEach(filterElem=>{
    filterElem.addEventListener("click", (e)=>{
        trasparentColor = getComputedStyle(filterElem).getPropertyValue('background-color')
         filterLayer.style.backgroundColor = trasparentColor
    })
})

const gallery = document.querySelector(".gallery")
gallery.addEventListener("click",(e)=>{
  location.assign("../HTML/gallery.html")
})