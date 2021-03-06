/* Tesla Cam Player by BitJunky https://github.com/gigajunky */

function $(query) { return document.querySelector(query) }
let vidA = document.querySelectorAll('video')
  , vidL = $('#vidL')
  , vidF = document.querySelector('#vidF')
  , vidR = document.querySelector('#vidR')
  , play = document.querySelector('.play')
  , rwd = document.querySelector('.rwd')
  , fwd = document.querySelector('.fwd')
  , slider = document.querySelector(".slider")
  //, tbClipPath = document.querySelector('#tbClipPath')
  , currentClipIndex = 0
  , intervalFwd, intervalRwd
  , skipInterval = 200, skipTime = 3
  //, clipNames = []
  , files = []
//localStorage.getItem('clipNames')
/*
chrome.storage.local.get('clipNames', function (result) {
  console.log('chrome storage: ', result)
  if(result) clipNames = JSON.parse(result.clipNames)
})

chrome.storage.local.get('files', function (result) {
  console.log('chrome storage: ', result)
  if(result) files = JSON.parse(result)
})

chrome.storage.local.get('ClipPath', function (result) {
  console.log('chrome storage ClipPath: ', result.ClipPath)
  tbClipPath.value = result.ClipPath
})

//tbClipPath.value = chrome.localStorage.getItem('ClipPath')
tbClipPath.addEventListener('change', function () {
  console.log('tbClipPath', tbClipPath.value)
  //localStorage.setItem('ClipPath', tbClipPath.value)
  chrome.storage.local.set({'ClipPath': tbClipPath.value})
})

if (clipNames !== null && clipNames.length > 0) loadClip(clipNames[0])

function loadClipX(clipName) {
  let clipPath =  'file:///' + tbClipPath.value + '/' 
  document.querySelector('#currentFile').innerHTML = clipName
  console.log('loadclip: ', clipPath + clipName)
  vidL.src = clipPath + clipName + '-left_repeater.mp4'
  vidF.src = clipPath + clipName + '-front.mp4'
  vidR.src = clipPath + clipName + '-right_repeater.mp4'
}
*/

function loadClip(i) {
  console.log('loadclip2: ', i)
  clipName = files[i].name.substr(0, 16)
  document.querySelector('#currentFile').innerHTML = clipName

  vidL.src = URL.createObjectURL(files[i * 3  + 1])
  vidF.src = URL.createObjectURL(files[i * 3])
  vidR.src = URL.createObjectURL(files[i * 3 + 2])
}

vidF.addEventListener('ended', function () {
  setTimeout(() => playNextMedia(), 100)
})
vidF.addEventListener('error', function () {
    console.log('Failed to load Video Clip.  Make sure clip path is correct.')
})


document.querySelector('.next').addEventListener('click', playNextMedia)
function playNextMedia() {
  if (currentClipIndex < files.length / 3 - 2) currentClipIndex++
  //clipName = clipNames[currentClipIndex]
  loadClip(currentClipIndex)
  playPauseMedia()
}

document.querySelector('.prior').addEventListener('click', function () {
  if (currentClipIndex > 0) currentClipIndex--
  //clipName = clipNames[currentClipIndex]
  loadClip(currentClipIndex)
  playPauseMedia()
})

play.addEventListener('click', playPauseMedia)
function playPauseMedia() {
  if (vidF.paused) {
    play.setAttribute('data-icon', 'u')
    vidA.forEach(v => v.play())
  } else {
    play.setAttribute('data-icon', 'P')
    vidA.forEach(v => v.pause())
  }
}

document.querySelector('.stop').addEventListener('click', stopMedia)
function stopMedia() {
  vidA.forEach(v => {
    v.play()
    v.pause()
    v.currentTime = 0
  })
  play.setAttribute('data-icon', 'P')
}

rwd.addEventListener('click', function () {
  clearInterval(intervalFwd)
  fwd.classList.remove('active')

  if (rwd.classList.contains('active')) {
    rwd.classList.remove('active')
    clearInterval(intervalRwd)
    vidA.forEach(v => v.play())
  } else {
    rwd.classList.add('active')
    vidA.forEach(v => v.pause())
    intervalRwd = setInterval(windBackward, skipInterval)
  }
})

fwd.addEventListener('click', function () {
  clearInterval(intervalRwd)
  rwd.classList.remove('active')

  if (fwd.classList.contains('active')) {
    fwd.classList.remove('active')
    clearInterval(intervalFwd)
    vidF.play()
  } else {
    fwd.classList.add('active')
    vidF.pause()
    intervalFwd = setInterval(windForward, skipInterval)
  }
})

function windBackward() {
  if (vidF.currentTime <= skipTime) {
    rwd.classList.remove('active')
    clearInterval(intervalRwd)
    stopMedia()
  } else vidA.forEach(v => v.currentTime -= skipTime)
}

function windForward() {
  if (vidF.currentTime >= vidF.duration - skipTime) {
    fwd.classList.remove('active')
    clearInterval(intervalFwd)
    stopMedia()
  } else vidA.forEach(v => v.currentTime += skipTime)
}

vidF.addEventListener('timeupdate', function () {
  var minutes = Math.floor(vidF.currentTime / 60)
    , seconds = Math.floor(vidF.currentTime - minutes * 60)
    , minuteValue = minutes < 10 ? '0' + minutes : minutes
    , secondValue = seconds < 10 ? '0' + seconds : seconds
    , mediaTime = minuteValue + ':' + secondValue
    , barLength = document.querySelector('.timer').clientWidth * (vidF.currentTime / vidF.duration)
  document.querySelector('.timer span').textContent = mediaTime
  //document.querySelector('.timer div').style.width = barLength + 'px'
  slider.value = seconds
})

slider.addEventListener('input', function () {
  vidA.forEach(v => {
    v.currentTime = this.value
  })
})

document.getElementById("files").addEventListener("change", function (event) {
  files = event.target.files
  console.log(files)
  /*
  clipNames = []
  for (let i = 0; i < files.length; i++)
    if (files[i].name.endsWith('-front.mp4')){
     clipNames.push(files[i].name.substr(0, 16))
    }
  */
  //localStorage.setItem('clipNames', JSON.stringify(clipNames))
  //chrome.storage.local.set({'clipNames': JSON.stringify(clipNames)})
  //chrome.storage.local.set({'files': JSON.stringify(files)})
  //clipNames = clipNames.sort()
  currentClipIndex = 0
  loadClip(0)

}, false)

