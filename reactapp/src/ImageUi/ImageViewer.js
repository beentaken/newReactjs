import { useEffect, useState } from 'react';

function ImageViewer() {
    const [imageData, setImageData] = useState(null);

    const base64 = async () => {
        try {
            const response = await fetch(`https://localhost:44317/Image/get-image-base64`); // Include the id
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();

            return data;
        } catch (error) {
            console.error("Failed to fetch coordinates:", error);
            return null;
        }
    };


    useEffect(() => {
        const fetchDatas = async () => {
            const images = await base64();
            if (images) {

                setImageData(`data:image/jpeg;base64,${images.imageBase64}`);

            }
        };

        fetchDatas(); // Call the async function
    }, []);

    return (
        <div>
            {imageData ? <img src={imageData} alt="My Image" /> : <p>Loading...</p>}
            <img src="http://localhost:7048/Image/get-image" alt="My Image" />
        </div>

    );
}
export default ImageViewer;