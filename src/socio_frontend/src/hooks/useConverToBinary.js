import { useState } from 'react';

export default function useConvertToBinary(image) {
    const [binary, setBinary] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    const convertToBinary = (file) => {

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Convert the ArrayBuffer to a Blob
                const photoBlob = new Blob([e.target.result], { type: file.type });

                // Create a URL for the Blob
                const imageUrl = URL.createObjectURL(photoBlob);
                setImageUrl(imageUrl);

                // Convert the ArrayBuffer to a Vec<Nat8>
                const arrayBuffer = new Uint8Array(e.target.result);
                const vecNat8 = Array.from(arrayBuffer);

                // Set the binary profile
                setBinary(vecNat8);
            };
            reader.readAsArrayBuffer(file);
        };

    }

    return { imageUrl, binary, convertToBinary };
}