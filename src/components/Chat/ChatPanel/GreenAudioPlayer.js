import React, { useEffect, useRef, useState } from 'react'
import './GreenAudioPlayer.scss'
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US');

export default function GreenAudioPlayer({ src, sentAt, position = 'left', showVolumeBtn = false, status = 'waiting', onPlay, alreadyPlayed = false }) {

    const audioPlayerRef = useRef();
    const playPauseRef = useRef();
    const playpauseBtnRef = useRef();
    const loadingRef = useRef();
    const progressRef = useRef();
    const slidersRef1 = useRef();
    const slidersRef2 = useRef();
    const pinRef1 = useRef();
    const pinRef2 = useRef();
    const volumeBtnRef = useRef();
    const volumeControlsRef = useRef();
    const volumeProgressRef = useRef();
    const audioRef = useRef();
    const currentTimeRef = useRef();
    const totalTimeRef = useRef();
    const speakerRef = useRef();

    const [played, setPlayed] = useState(false);


    useEffect(() => {

        var audioPlayer = audioPlayerRef.current;
        var playPause = playPauseRef.current;
        var playpauseBtn = playpauseBtnRef.current;
        var loading = loadingRef.current;
        var progress = progressRef.current;
        var slider1 = slidersRef1.current;
        var pin1 = pinRef1.current;
        var slider2 = slidersRef2.current;
        var pin2 = pinRef2.current;
        var volumeBtn = volumeBtnRef.current;
        var volumeControls = volumeControlsRef.current;
        var volumeProgress = volumeProgressRef.current;
        var player = audioRef.current;
        var currentTime = currentTimeRef.current;
        var totalTime = totalTimeRef.current;
        var speaker = speakerRef.current;
        // var audioPlayer = document.querySelector('.green-audio-player');
        // var playPause = audioPlayer.querySelector('#playPause');
        // var playpauseBtn = audioPlayer.querySelector('.play-pause-btn');
        // var loading = audioPlayer.querySelector('.loading');
        // var progress = audioPlayer.querySelector('.progress');
        // var sliders = audioPlayer.querySelectorAll('.slider');
        // var volumeBtn = audioPlayer.querySelector('.volume-btn');
        // var volumeControls = audioPlayer.querySelector('.volume-controls');
        // var volumeProgress = volumeControls.querySelector('.slider .progress');
        // var player = audioPlayer.querySelector('audio');
        // var currentTime = audioPlayer.querySelector('.current-time');
        // var totalTime = audioPlayer.querySelector('.total-time');
        // var speaker = audioPlayer.querySelector('#speaker');

        var draggableClasses = ['pin'];
        var currentlyDragged = null;
        window['rewind'] = rewind;
        window['changeVolume'] = changeVolume;

        window.addEventListener('mousedown', mouseDownHandler);

        playpauseBtn.addEventListener('click', togglePlay);
        player.addEventListener('timeupdate', updateProgress);
        player.addEventListener('volumechange', updateVolume);
        player.addEventListener('loadedmetadata', loadedMetadata);
        player.addEventListener('canplay', makePlay);
        player.addEventListener('ended', endedHandler);

        volumeBtn.addEventListener('click', volumeBtnHandler);

        document.addEventListener('click', playersClickHandler);
        window.addEventListener('resize', directionAware);

        // sliders.forEach(slider => {
        //     let pin = slider.querySelector('.pin');
        //     slider.addEventListener('click', window[pin.dataset.method]);
        // });

        slider1.addEventListener('mousedown', () => {
            window['rewind'] = rewind;

        });
        slider2.addEventListener('mousedown', () => {
            window['changeVolume'] = changeVolume;
        });

        directionAware();

        function isDraggable(el) {
            let canDrag = false;
            let classes = Array.from(el.classList);
            draggableClasses.forEach(draggable => {
                if (classes.indexOf(draggable) !== -1)
                    canDrag = true;
            })
            return canDrag;
        }

        function inRange(event) {
            let rangeBox = getRangeBox(event);
            let rect = rangeBox.getBoundingClientRect();
            let direction = rangeBox.dataset.direction;
            if (direction === 'horizontal') {

                // let min = rangeBox.offsetLeft;
                // let max = min + rangeBox.offsetWidth;
                let min = rect.left;
                let max = rect.right;
                if (event.clientX < min || event.clientX > max) return false;
            } else {
                let min = rect.top;
                let max = min + rangeBox.offsetHeight;
                if (event.clientY < min || event.clientY > max) return false;
            }
            return true;
        }

        function updateProgress() {
            var current = player.currentTime;
            var percent = (current / player.duration) * 100;
            progress.style.width = percent + '%';

            currentTime.textContent = formatTime(current);
        }

        function updateVolume() {
            volumeProgress.style.height = player.volume * 100 + '%';
            if (player.volume >= 0.5) {
                speaker.attributes.d.value = 'M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z';
            } else if (player.volume < 0.5 && player.volume > 0.05) {
                speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667M17.333 11.373C17.333 9.013 16 6.987 14 6v10.707c2-.947 3.333-2.987 3.333-5.334z';
            } else if (player.volume <= 0.05) {
                speaker.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667';
            }
        }

        function getRangeBox(event) {
            let rangeBox = event.target;
            let el = currentlyDragged;
            if (event.type === 'click' && isDraggable(event.target)) {
                rangeBox = event.target.parentElement.parentElement;
            }
            if (event.type === 'mousemove') {
                rangeBox = el.parentElement.parentElement;
            }
            return rangeBox;
        }

        function getCoefficient(event) {
            let slider = getRangeBox(event);
            let rect = slider.getBoundingClientRect();
            let K = 0;
            if (slider.dataset.direction === 'horizontal') {

                // let offsetX = event.clientX - slider.offsetLeft;
                // let width = slider.clientWidth;
                let offsetX = event.clientX - rect.left;
                let width = rect.width;
                K = offsetX / width;

            } else if (slider.dataset.direction === 'vertical') {

                let height = slider.clientHeight;
                var offsetY = event.clientY - rect.top;
                K = 1 - offsetY / height;

            }
            return K;
        }

        function rewind(event) {
            if (inRange(event)) {
                player.currentTime = player.duration * getCoefficient(event);
            }
        }

        function changeVolume(event) {
            if (inRange(event)) {
                player.volume = getCoefficient(event);
            }
        }

        function formatTime(time) {
            var min = Math.floor(time / 60);
            var sec = Math.floor(time % 60);
            return min + ':' + ((sec < 10) ? ('0' + sec) : sec);
        }

        function playersClickHandler(event) {

            var isClickInsideElement = volumeBtn.contains(event.target);
            if (event.target.id === 'playPause' && !isClickInsideElement) {
                volumeBtn.classList.remove('open');
                volumeControls.classList.add('hidden');
                // if (!player.paused) player.pause()
            }
            var isClickInsidPlayPauseBtn = playpauseBtn.contains(event.target);
            if (event.target.id === 'playPause' && !isClickInsidPlayPauseBtn) {
                player.pause();
                playPause.attributes.d.value = "M18 12L0 24V0";
            }
        }

        function loadedMetadata() {
            totalTime.textContent = formatTime(player.duration);
        }

        function endedHandler() {
            playPause.attributes.d.value = "M18 12L0 24V0";
            player.currentTime = 0;
        }
        function volumeBtnHandler() {
            volumeBtn.classList.toggle('open');
            volumeControls.classList.toggle('hidden');
        }

        function mouseDownHandler(event) {
            if (!isDraggable(event.target)) return false;
            currentlyDragged = event.target;
            let handleMethod = currentlyDragged.dataset.method;
            this.addEventListener('mousemove', window[handleMethod], false);

            window.addEventListener('mouseup', mouseUpHandler(handleMethod), false);
        }
        let mouseDownHandlerFunc;
        function mouseUpHandler(handleMethod) {
            mouseDownHandlerFunc = function () {
                currentlyDragged = false;
                window.removeEventListener('mousemove', window[handleMethod], false);
            }
            return mouseDownHandlerFunc;
        }
        function togglePlay() {
            if (player.paused) {
                playPause.attributes.d.value = "M0 0h6v24H0zM12 0h6v24h-6z";
                player.play();
                setPlayed(true);
                if (onPlay) onPlay();
            } else {
                playPause.attributes.d.value = "M18 12L0 24V0";
                player.pause();
            }
        }

        function makePlay() {
            playpauseBtn.style.display = 'block';
            loading.style.display = 'none';
        }

        function directionAware() {
            if (window.innerHeight < 250) {
                volumeControls.style.bottom = '-54px';
                volumeControls.style.left = '54px';
            } else if (audioPlayer.offsetTop < 154) {
                volumeControls.style.bottom = '-164px';
                volumeControls.style.left = '-3px';
            } else {
                volumeControls.style.bottom = '52px';
                volumeControls.style.left = '-3px';
            }
        }
        return () => {
            window.removeEventListener('mousedown', mouseDownHandler);
            window.removeEventListener('resize', directionAware);
            window.removeEventListener('mouseup', mouseDownHandlerFunc);

            playpauseBtn.removeEventListener('click', togglePlay);
            player.removeEventListener('timeupdate', updateProgress);
            player.removeEventListener('volumechange', updateVolume);
            player.removeEventListener('loadedmetadata', loadedMetadata);
            player.removeEventListener('canplay', makePlay);
            player.removeEventListener('ended', endedHandler);

            volumeBtn.removeEventListener('click', volumeBtnHandler);
            window.removeEventListener('resize', directionAware);

            document.removeEventListener('click', playersClickHandler);
        }
    }, [])
    return (
        <div className={"player-holder position-" + position} >
            <div className="audio green-audio-player" ref={audioPlayerRef}>
                <div className="loading" ref={loadingRef}>
                    <div className="spinner" />
                </div>
                <div className="play-pause-btn" ref={playpauseBtnRef}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={24} viewBox="0 0 18 24">
                        <path fill={(alreadyPlayed || played) ? "#566574" : "#44bfa3"} fillRule="evenodd" d="M18 12L0 24V0" className="play-pause-icon" id="playPause" ref={playPauseRef} />
                    </svg>
                </div>
                <div className="controls">
                    <span className="current-time" ref={currentTimeRef}>0:00</span>
                    <div className="slider" data-direction="horizontal" ref={slidersRef1}>
                        <div className="progress" ref={progressRef}>
                            <div className="pin" id="progress-pin" data-method="rewind" ref={pinRef1} />
                        </div>
                    </div>
                    <span className="total-time" ref={totalTimeRef}>0:00</span>
                </div>
                <div className="volume" hidden={!showVolumeBtn}>
                    <div className="volume-btn" ref={volumeBtnRef}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                            <path fill="#566574" fillRule="evenodd" d="M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z" id="speaker" ref={speakerRef} />
                        </svg>
                    </div>

                    <div className="volume-controls hidden" ref={volumeControlsRef}>
                        <div className="slider" data-direction="vertical" ref={slidersRef2}>
                            <div className="progress" ref={volumeProgressRef}>
                                <div className="pin" id="volume-pin" data-method="changeVolume" ref={pinRef2} />
                            </div>
                        </div>
                    </div>
                </div>
                {sentAt && (<div className="green-audio-player-time">{timeAgo.format(sentAt)}</div>)}
                < div className="green-audio-player-status">
                    {status === 'waiting' && (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" style={{ verticalAlign: 'middle' }}><g><path d="m20.9 11.6v8.8l7.5 4.4-1.3 2.2-8.7-5.4v-10h2.5z m-0.9 21.8q5.5 0 9.4-4t4-9.4-4-9.4-9.4-4-9.4 4-4 9.4 4 9.4 9.4 4z m0-30q6.9 0 11.8 4.8t4.8 11.8-4.8 11.8-11.8 4.8-11.8-4.8-4.8-11.8 4.8-11.8 11.8-4.8z"></path></g></svg>)}
                    {status === 'sent' && (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" style={{ verticalAlign: 'middle' }}><g><path d="m15 27l17.7-17.7 2.3 2.3-20 20-9.3-9.3 2.3-2.3z"></path></g></svg>)}
                    {status === 'received' && (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" style={{ verticalAlign: 'middle' }}><g><path d="m30.3 10.9l-10.9 10.9-2.4-2.4 10.9-10.9z m7.3-2.4l2.4 2.4-20.6 20.6-9.6-9.6 2.4-2.4 7.2 7.1z m-37.6 13.4l2.5-2.4 9.5 9.6-2.4 2.4z"></path></g></svg>)}
                    {status === 'read' && (<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" style={{ verticalAlign: 'middle', color: 'rgb(79, 195, 247)' }}><g><path d="m30.3 10.9l-10.9 10.9-2.4-2.4 10.9-10.9z m7.3-2.4l2.4 2.4-20.6 20.6-9.6-9.6 2.4-2.4 7.2 7.1z m-37.6 13.4l2.5-2.4 9.5 9.6-2.4 2.4z"></path> </g></svg>)}

                </div>
                <audio src={src} ref={audioRef}>
                    {/* <source src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/355309/Swing_Jazz_Drum.mp3" type="audio/mpeg" /> */}
                </audio>
            </div>

        </div >

    )
}
