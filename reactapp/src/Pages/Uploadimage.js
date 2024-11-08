
const Uploadimage = () => {

    const readFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const binaryData = reader.result;
                const fileType = file.type;
                resolve({ binaryData, fileType });
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsBinaryString(file);
        });
    };

    const handleFileInput = async (event) => {
        const { binaryData, fileType } = await readFile(event.target.files[0]);
        const data = btoa(binaryData);

        const byteCharacters = atob(data);
        const byteArray = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteArray[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([byteArray], { type: fileType });

        // Handle the blob further if needed
    };

    return (
        <div>
            <h1 id="tabelLabel">Upload image</h1>
            <input
                accept="*/*"
                id="input-file"
                onChange={handleFileInput}
                type="file"
            />
            <input
                accept="video/*"
                id="input-file"
                onChange={handleFileInput}
                type="file"
            />
            <input
                accept="audio/*"
                id="input-file"
                onChange={handleFileInput}
                type="file"
            />
        </div>
    );
};

export default Uploadimage;

