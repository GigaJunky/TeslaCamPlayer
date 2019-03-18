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
  , tbClipPath = document.querySelector('#tbClipPath')
  , currentClipIndex = 0
  , intervalFwd, intervalRwd
  , skipInterval = 200, skipTime = 3
, clipNames = localStorage.getItem('clipNames')
if(clipNames != null) clipNames = JSON.parse(localStorage.getItem('clipNames'))

tbClipPath.value = localStorage.getItem('ClipPath')
tbClipPath.addEventListener('change', function () {
  console.log('tbClipPath', tbClipPath.value)
  localStorage.setItem('ClipPath', tbClipPath.value)
})

if (clipNames !== null && clipNames.length > 0) loadClip(clipNames[0])

function loadClip(clipName) {
  let clipPath = 'file:///' + tbClipPath.value + '/'
  document.querySelector('#currentFile').innerHTML = clipName
  console.log('loadclip: ', clipPath + clipName)
  vidL.src = clipPath + clipName + '-left_repeater.mp4'
  vidF.src = clipPath + clipName + '-front.mp4'
  vidR.src = clipPath + clipName + '-right_repeater.mp4'
}

vidF.addEventListener('ended', function () {
  setTimeout(() => playNextMedia(), 100)
})

document.querySelector('.next').addEventListener('click', playNextMedia)
function playNextMedia() {
  if (currentClipIndex < clipNames.length - 2) currentClipIndex++
  clipName = clipNames[currentClipIndex]
  loadClip(clipName)
  playPauseMedia()
}

document.querySelector('.prior').addEventListener('click', function () {
  if (currentClipIndex > 0) currentClipIndex--
  clipName = clipNames[currentClipIndex]
  loadClip(clipName)
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
  let files = event.target.files
  clipNames = []
  for (let i = 0; i < files.length; i++)
    if (files[i].name.endsWith('-front.mp4')) clipNames.push(files[i].name.substr(0, 16))

  localStorage.setItem('clipNames', JSON.stringify(clipNames))
  clipNames = clipNames.sort()
  currentClipIndex = 0
  loadClip(clipNames[0])
}, false)

