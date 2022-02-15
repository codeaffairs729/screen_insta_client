import React, { useEffect, useRef, useState } from 'react'
import './GreenAudioRecorder.scss'
import { useReactMediaRecorder } from "react-media-recorder";
import getBlobDuration from 'get-blob-duration';
import ysFixWebmDuration from 'fix-webm-duration';
import Icon from "../../Icon/Icon";
export default function GreenAudioRecorder({ position = 'right', showVolumeBtn = false, onPlay, alreadyPlayed = false, onDelete, onSend }) {

    function formatTime(time) {
        var min = Math.floor(time / 60);
        var sec = Math.floor(time % 60);
        return min + ':' + ((sec < 10) ? ('0' + sec) : sec);
    }

    const {
        status,
        startRecording,
        stopRecording,
        // resumeRecording,
        // pauseRecording,
        mediaBlobUrl,
    } = useReactMediaRecorder({ audio: true });

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

        async function updateProgress() {
            const duration = await getBlobDuration(player.src) // Blob
            var current = player.currentTime;
            var percent = (current / duration) * 100;
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

        async function rewind(event) {
            if (inRange(event)) {
                const duration = 1 * await getBlobDuration(player.src) // Blob
                player.currentTime = duration * getCoefficient(event);
            }
        }

        function changeVolume(event) {
            if (inRange(event)) {
                player.volume = getCoefficient(event);
            }
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

        async function loadedMetadata() {
            const duration = 1 * await getBlobDuration(player.src) // Blob
            totalTime.textContent = formatTime(duration);
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

    const handleSendMedia = async (mediaBlobUrl) => {
        if (mediaBlobUrl) {
            // seconds we need to converted to milliseconds
            // const mediaBlob = await fetch(mediaBlobUrl).then(response => response.blob());
            // const duration = await getBlobDuration(mediaBlob);
            // ysFixWebmDuration(mediaBlob, 1000 * duration, function (fixedBlob) {
            //     const wavefilefromblob = new File([fixedBlob], 'filename.wav', { type: 'audio/wav' });
            //     onSend(wavefilefromblob);
            //     onDelete();
            // });
            // const duration = await getBlobDuration(mediaBlobUrl);// seconds we need to converted to milliseconds
            const mediaBlob = await fetch(mediaBlobUrl).then(response => response.blob());
            // ysFixWebmDuration(mediaBlob, 1000 * duration, function (fixedBlob) {
            const wavefilefromblob = new File([mediaBlob], 'filename.wav', { type: 'audio/wav' });
            onSend(wavefilefromblob);
            onDelete();
            // });

        }

    }
    return (
        <div className={"recorder-holder position-" + position} >
            <div className="audio green-audio-player" ref={audioPlayerRef}>
                <div>
                    <Icon icon={"close-circle-outline"} style={{ cursor: 'pointer', color: 'red' }} onClick={onDelete} />
                </div>
                <div className="loading" ref={loadingRef}>
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
                {/* <div className="green-audio-player-time">
                    {status}
                </div> */}
                <div >
                    {(status === 'stopped' || status === 'idle') && (<Icon icon={"mic-outline"} style={{ cursor: 'pointer', color: 'red' }} onClick={() => { startRecording(); currentTimeRef.current.textContent = totalTimeRef.current.textContent = '0.00' }} />)}
                    {/* {status === 'paused' && (<Icon icon={"mic-outline"} style={{ cursor: 'pointer', color: 'red' }} onClick={resumeRecording} />)} */}
                    {/* {status === 'recording' && (<Icon icon={"pause-circle-outline"} style={{ cursor: 'pointer', color: 'red' }} onClick={pauseRecording} />)} */}
                </div>
                <div >
                    {(status === 'recording' || status === 'paused') && (<Icon icon={"stop-circle-outline"} style={{ cursor: 'pointer', color: 'red' }} onClick={stopRecording} />)}
                </div>
                <div >
                    <Icon icon={"play-outline"} style={{ cursor: 'pointer' }} onClick={() => handleSendMedia(mediaBlobUrl)} />
                </div>
                <audio src={mediaBlobUrl} ref={audioRef}></audio>
            </div>

        </div >

    )
}
