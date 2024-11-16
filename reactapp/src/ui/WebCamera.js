import React, { useEffect, useRef } from 'react';
import 'main.css'; // Import CSS
import 'https://vjs.zencdn.net/7.14.3/video-js.css';

const WebCamera = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const inputRef = useRef(null);
    const audioRef = useRef(null);
    const videoPreviewRef = useRef(null);
    const cctvStreamRef = useRef(null);
    const photoRef = useRef(null);

    // Load external scripts on component mount
    useEffect(() => {
        const captureScript = document.createElement("script");
        captureScript.src = "capture.js";
        captureScript.async = true;
        document.body.appendChild(captureScript);

        const videoJSScript = document.createElement("script");
        videoJSScript.src = "https://vjs.zencdn.net/7.14.3/video.js";
        videoJSScript.async = true;
        document.body.appendChild(videoJSScript);

        const hlsScript = document.createElement("script");
        hlsScript.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
        hlsScript.async = true;
        document.body.appendChild(hlsScript);

        return () => {
            document.body.removeChild(captureScript);
            document.body.removeChild(videoJSScript);
            document.body.removeChild(hlsScript);
        };
    }, []);

    // Define event handlers
    const handleFileInput = (event) => {
        const file = event.target.files[0];
        const fileURL = URL.createObjectURL(file);

        switch (file.type.split('/')[0]) {
            case 'image':
                photoRef.current.src = fileURL;
                break;
            case 'audio':
                audioRef.current.src = fileURL;
                break;
            case 'video':
                videoPreviewRef.current.src = fileURL;
                break;
            default:
                console.error('Unsupported file type');
        }
    };

    return (
        <div className="contentarea">
            <h1>MDN - WebRTC: Still photo capture demo</h1>
            <p>
                This example demonstrates how to set up a media stream using your built-in webcam,
                fetch an image from that stream, and create a PNG using that image.
            </p>
            <p>
                <label htmlFor="filetypes">
                    Choose an image file type:
                    <a href="https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#avif_image">
                        Visit article
                    </a>
                </label>
                <select name="filetypes" id="filetypes">
                    <option value="image/png">png</option>
                    <option value="image/jpeg">jpeg</option>
                    <option value="image/webp">webp</option>
                    <option value="image/avif">avif</option>
                </select>
            </p>
            <div className="camera">
                <video id="video" ref={videoRef}>Video stream not available.</video>
                <canvas id="canvas" ref={canvasRef} />
            </div>
            <div className="output">
                <button id="startButton">Start Recording</button>
                <button id="stopButton" disabled>Stop Recording</button>
                <button id="takeButton">Take photo</button>
                <button id="saveAsFile">Save As File</button>
                <button id="asArrayBuffer">ArrayBuffer</button>

                <input
                    accept="image/*"
                    id="input-file"
                    className="custom-file-input"
                    type="file"
                    onChange={handleFileInput}
                    ref={inputRef}
                />
                <span id="file-name" className="file-name"></span>
                <label htmlFor="input-file" className="custom-button">
                    Choose Image
                </label>
                <img id="image-preview" alt="Uploaded Image" style={{ maxWidth: '100%', maxHeight: '300px' }} />

                <input accept="audio/*" id="audio-file" type="file" onChange={handleFileInput} />
                <audio id="audio-preview" ref={audioRef} controls>
                    Your browser does not support the audio element.
                </audio>

                <input accept="video/*" id="video-file" type="file" onChange={handleFileInput} />
                <video id="video-preview" ref={videoPreviewRef} controls>
                    Your browser does not support the video element.
                </video>

                <video
                    id="cctv-stream"
                    ref={cctvStreamRef}
                    className="video-js vjs-default-skin"
                    controls
                    autoPlay
                    preload="auto"
                    width="640"
                    height="360"
                >
                    Your browser does not support the video tag.
                </video>

                <img id="photo" ref={photoRef} alt="The screen capture will appear in this box." />

                <p>
                    <label htmlFor="fname">File name:</label>
                    <input type="text" id="fname" name="fname" />
                </p>
            </div>
            <p>
                Visit article
                <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos">
                    Taking still photos with WebRTC
                </a>
                to learn more about the technologies used here.
            </p>
        </div>
    );
};

export default WebCamera;