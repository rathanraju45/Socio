import { useState,useEffect } from 'react';

export default function useConvertToImage() {
    const [image, setImage] = useState(null);

    const convertToImage = (binaryData) => {
        //Convert the Vec<Nat8> back to an ArrayBuffer
        const arrayBuffer = new Uint8Array(binaryData).buffer;

        // Convert the ArrayBuffer to a Blob
        const imageBlob = new Blob([arrayBuffer], { type: 'image/jpeg' });

        // Create a URL for the Blob
        const imageUrl = URL.createObjectURL(imageBlob);

        setImage(imageUrl);
    };

    return { image, convertToImage };
}