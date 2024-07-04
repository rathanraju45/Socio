import React, {useContext, useEffect} from 'react';
import './LandingPage.css';
import socio_logo from "../../../public/images/large_logos/black_theme_full.png";
import socio_media_illustration from "../../../public/images/illustrations/Social media-amico.png";
import about_illustration from "../../../public/images/illustrations/About us.png";

import decentralisation_icon from "../../../public/images/illustrations/decentralized_icon.png";
import transparency_icon from "../../../public/images/illustrations/transparency_icon.png";
import security_icon from "../../../public/images/illustrations/security_icon.png";
import privacy_icon from "../../../public/images/illustrations/privacy_icon.png";
import trust_icon from "../../../public/images/illustrations/trust_icon.png";

import messaging_icon from "../../../public/images/features/Messaging-icon.png";
import content_creation_icon from "../../../public/images/features/content-creator-icon.png";
import privacy_feature_icon from "../../../public/images/features/privacy-icon.png";
import ai_ml_icon from "../../../public/images/features/ai-ml-icon.png";
import fair_monetization_icon from "../../../public/images/features/monetisation_icon.png";
import file_view_icon from "../../../public/images/features/file-viewing-icon.png";

import icp_global from "../../../public/images/icp_images/icp_global.png";
import crewsphere from "../../../public/images/icp_images/crewshpere.png";

import Login from "../Login/Login.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay} from "@fortawesome/free-solid-svg-icons";
import {GlobalStore} from "../../store/GlobalStore.jsx";

const LandingPage = ({setLoading}) => {

    const {setDarkMode} = useContext(GlobalStore);

    useEffect(() => {
        setDarkMode(true);
        window.onload = function () {
            document.getElementById("tagline").classList.add("typing-effect");
        };
    }, []);

    return (
        <div className="landing-page">

            <nav className="navbar">

                <img src={socio_logo} alt={"socio_logo"}/>

                <ul>
                    <li><a href="#Home">Home</a></li>
                    <li><a href="#about-us-text">About</a></li>
                    <li><a href="#features-text">Features</a></li>
                    <li><a href="#Team">Team</a></li>
                </ul>

            </nav>

            <section id="Home" className="middle-section">

                <div className="text-content">
                    <h1 id={"main-heading"}>Socio</h1>
                    <p id={"tagline"}>Privacy Even while Social.</p>
                    <div id="sign-options">
                        <Login setLoading={setLoading} />
                        <button id="Watch-tutorial">
                            How to <FontAwesomeIcon id={"watch-tutorial-icon"} icon={faPlay} />
                        </button>
                    </div>
                </div>

                <div className="illustration">
                    <img src={socio_media_illustration} alt={"social_media_illustration"}/>
                </div>

            </section>

            <h2 id={"about-us-text"}>About us</h2>

            <section id="About" className="text-content-section">

                <div className="illustration">
                    <img src={about_illustration} alt={"about-us"}/>
                </div>

                <div className="text-content">


                    <p>
                        Socio, powered by the ICP Blockchain, is a dynamic social media platform that prioritizes user
                        privacy and data security. Our robust feature set includes seamless messaging, content creation,
                        and easy content sharing. But Socio goes beyond the ordinary: we recognize that users form the
                        heartbeat of any social platform. That’s why we’ve built an ecosystem where both users and
                        creators are fairly monetized. Join us in shaping a community that values connections,
                        creativity, and empowerment.
                    </p>

                </div>

            </section>

            <h2 id={"features-text"}>Features</h2>

            <section id="Features" className="features-section">

                <div className="feature">
                    <img src={messaging_icon} alt="Feature-1"/>
                    <h3>Messaging and Content Sharing</h3>
                    <div>
                        <ul>
                            <li>Seamlessly connect with friends, family, and communities through our intuitive messaging
                                system.
                            </li>
                            <li>Create and share content effortlessly, whether it’s a photo, video, or thought-provoking
                                post.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="feature">
                    <img src={content_creation_icon} alt={"Feature-2"}/>
                    <h3>Content creation</h3>
                    <p>
                        Create and share content effortlessly, whether it’s a photo, video, or thought-provoking post.
                    </p>
                </div>

                <div className="feature">
                    <img src={privacy_feature_icon} alt={"Feature-3"}/>
                    <h3>Privacy & Security</h3>
                    <div>
                        <ul>
                            <li>The platform focuses on user privacy with end-to-end
                                encryption of messages.
                            </li>
                            <li>It also uses internet identity to avoid the
                                usage of passwords, enhancing the security of user accounts.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="feature">
                    <img src={ai_ml_icon} alt={"Feature-4"}/>
                    <h3>AI-ML Integration</h3>
                    <p>
                        AI & ML are integrated to detect violent messages and
                        cyberbullying. Users have the option to detect unethical content

                        like violence and explicit images, which are automatically
                        reported and blocked.
                    </p>
                </div>

                <div className="feature">
                    <img src={fair_monetization_icon} alt={"Feature-5"}/>
                    <h3>Fair Monetization</h3>
                    <div>
                        <ul>
                            <li>Socio recognizes that users and creators drive the platform. We’ve designed a fair
                                ecosystem where both thrive.
                            </li>
                            <li>Monetize your content, engage with your audience, and earn rewards.</li>
                        </ul>
                    </div>
                </div>

                <div className="feature">
                    <img src={file_view_icon} alt={"Feature-6"}/>
                    <h3>Secured file viewing</h3>
                    <div>
                        <ul>
                            <li>By preventing direct downloads, Socio shields users from accidentally importing
                                malicious files or harmful links.
                            </li>
                            <li>Instantly view documents, images, and web links without cluttering local storage.</li>
                            <li>
                                Users can confidently explore shared content without compromising their privacy.
                            </li>
                        </ul>
                    </div>
                </div>

            </section>

            <section id="Benefits" className="text-content-section">
                <div className="benefits-container">
                    <h3>Why Social media
                        <br/><span>on Blockchain?</span></h3>
                    <ul className="benefits-list">
                        <li>
                            <img src={decentralisation_icon} alt={"decentralised_icon"}/>
                            Decentralisation
                        </li>
                        <li>
                            <img src={transparency_icon} alt={"transparency_icon"}/>
                            Transparency
                        </li>
                        <li>
                            <img src={security_icon} alt={"security_icon"}/>
                            Security
                        </li>
                        <li>
                            <img src={privacy_icon} alt={"privacy_icon"}/>
                            Privacy
                        </li>
                        <li>
                            <img src={trust_icon} alt={"trust_icon"}/>
                            Trust
                        </li>
                    </ul>
                </div>
            </section>

            <section id="Team" className="founders-section">
                <h2>The Team</h2>
                <div id={"team-details"}>
                    <div className={"team-member"}>
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Random User 1"/>
                        <p>Rathan Raju</p>
                    </div>
                    <div className={"team-member"}>
                        <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="Random User 2"/>
                        <p>William</p>
                    </div>
                    <div className={"team-member"}>
                        <img src="https://randomuser.me/api/portraits/men/3.jpg" alt="Random User 3"/>
                        <p>Narasimha</p>
                    </div>
                    <div className={"team-member"}>
                        <img src="https://randomuser.me/api/portraits/men/4.jpg" alt="Random User 4"/>
                        <p>Mukesh</p>
                    </div>
                    <div className={"team-member"}>
                        <img src="https://randomuser.me/api/portraits/men/5.jpg" alt="Random User 5"/>
                        <p>Jhansi</p>
                    </div>
                    <div className={"team-member"}>
                        <img src="https://randomuser.me/api/portraits/men/6.jpg" alt="Random User 6"/>
                        <p>Meghana</p>
                    </div>
                </div>
            </section>

            <section id={"credits"}>
                <h2>Supported by</h2>
                <div id="support-logos">
                    <img src={icp_global} alt="icp_global"/>
                    <img src={crewsphere} alt="crewshpere"/>
                </div>
            </section>

            <footer className="footer">
                <p>© 2024 Socio</p>
            </footer>
        </div>
    );
};

export default LandingPage;