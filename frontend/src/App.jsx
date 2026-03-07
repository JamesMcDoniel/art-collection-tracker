import { useState } from 'react';

const App = () => {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [paths, setPaths] = useState([]);
    const exampleArtworkId = 1; // For testing purposes

    const submitArtwork = async (e) => {
        e.preventDefault();

        if (title.length === 0) return;

        try {
            const res = await fetch('/api/artwork', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title
                })
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            console.log(data);
        } catch (err) {
            console.error(err);
        }
    };

    const submitImage = async (e) => {
        e.preventDefault();

        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('artwork_id', exampleArtworkId);

            const res = await fetch('/api/image', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            console.log(data.message);
            setFile(null);
        } catch (err) {
            console.error(err);
        }
    };

    const getImages = async () => {
        try {
            const res = await fetch('/api/image');
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            console.log(data);

            setPaths([
                data.image,
                ...data.recommendations.map(
                    (recommendation) => recommendation.path
                )
            ]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <main>
            <form onSubmit={submitArtwork}>
                <label htmlFor="artwork-title">Title:</label>
                <input
                    id="artwork-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
            <hr />
            <form onSubmit={submitImage}>
                <label htmlFor="image-upload">Upload:</label>
                <input
                    id="image-upload"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <button type="submit">Submit</button>
            </form>
            {file ? (
                <img
                    src={URL.createObjectURL(file)}
                    alt="Upload Preview"
                />
            ) : null}
            <hr />
            <button
                type="button"
                onClick={getImages}
            >
                Generate Random + Similar Image
            </button>
            {paths.length > 0
                ? paths.map((path) => (
                      <img
                          key={path}
                          src={path}
                          alt=""
                          style={{
                              display: 'block',
                              height: '100%',
                              width: '100px'
                          }}
                      />
                  ))
                : null}
        </main>
    );
};

export default App;
