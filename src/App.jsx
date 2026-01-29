
import { useEffect, useState } from "react";
import domtoimage from 'dom-to-image';

const App = () => {
    const [userName, setUserName] = useState('');
    const [query, setQuery] = useState('');
    const [userData, setUserData] = useState({});
    const [error, setError] = useState('');

    const downloadCard = () => {
        const node = document.getElementById("github-profile-card");
        if (!node) return;

        domtoimage.toPng(node)
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = 'profile_card.png';
                link.href = dataUrl;
                link.click();
            })
            .catch((error) => {
                console.error('Error generating image:', error);
            });
    };

    const openGit = () => {
        if (userData.html_url) {
            window.open(userData.html_url, "_blank");
        }
    };

    useEffect(() => {
        if (!query) return;

        const fetchData = async () => {
            const res = await fetch(`https://api.github.com/users/${query}`);
            if (!res.ok) {
                setUserData({});
                setError(" GitHub user not found. Please try again.");
                return;
            }

            const data = await res.json();
            setUserData(data);
            setError('');
        };

        fetchData();
    }, [query]);


    return (
        <div className="page-wrapper d-flex align-items-center justify-content-center p-4">
            <div className="glass-card container p-4 p-md-5">

                <h1 className="text-center fw-bold mb-4">
                    Enter GitHub User Name
                </h1>

                <div className="d-flex flex-column flex-sm-row gap-3 mb-3">
                    <input
                        id="github-input"
                        type="text"
                        className="form-control glass-input"
                        placeholder="Enter GitHub username"
                        onChange={(e) => setUserName(e.target.value)}
                    />

                    <button
                        type="button"
                        className="btn btn-success px-4"
                        onClick={() => {
                            const trimmedName = userName.trim();
                            if (trimmedName === "") {
                                setError(" Please enter a GitHub username.");
                                return;
                            }
                            if (trimmedName.toLowerCase() === query.toLowerCase()) {
                                setError(" This user is already shown.");
                                return;
                            }

                            setQuery(trimmedName);
                            setUserName("");
                            setError("");

                            const input = document.getElementById("github-input");
                            if (input) input.value = "";
                        }}
                    >
                        Search
                    </button>
                </div>

                {error && (
                    <p className="text-danger fw-semibold text-center">
                        {error}
                    </p>
                )}

                {userData && userData.login && (
                    <div >
                        <div
                            id="github-profile-card"
                            className="glass-inner-card text-center p-4 mt-4"
                        >
                            <img
                                src={userData.avatar_url}
                                alt={userData.login}
                                className="avatar-img mb-3"
                            />

                            <h2 className="fw-bold text-success">
                                {userData.name || userData.login}
                            </h2>

                            {userData.bio && (
                                <p className="fst-italic">
                                    "{userData.bio}"
                                </p>
                            )}

                            {userData.email && (
                                <p className="fst-italic">
                                    Rich Me : {userData.email}
                                </p>
                            )}

                            <hr />

                            <div className="row text-center mt-3">
                                <div className="col">
                                    <h5 className="text-success fw-bold">
                                        {userData.followers}
                                    </h5>
                                    Followers
                                </div>
                                <div className="col">
                                    <h5 className="text-success fw-bold">
                                        {userData.following}
                                    </h5>
                                    Following
                                </div>
                                <div className="col">
                                    <h5 className="text-success fw-bold">
                                        {userData.public_repos}
                                    </h5>
                                    Repos
                                </div>
                            </div>
                        </div>

                        <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
                            <button
                                onClick={downloadCard}
                                className="btn btn-success w-100"
                            >
                                Download Card 📥
                            </button>

                            <button
                                onClick={openGit}
                                className="btn btn-dark w-100"
                            >
                                Open GitHub
                                <i className="fa-brands fa-github ms-1"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App