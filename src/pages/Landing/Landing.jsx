import React from "react";
import CardList from "../../components/Card/CardList";
import AboutMission from "../../components/ImpactStory/AboutMission";
import ImpactStory from "../../components/ImpactStory/ImpactStory";
import Slider from "../../components/Slider/Slider";
import Features from "../../components/Features/Features";

const LandingPage = () => {
    return (
        <React.Fragment>
            <Slider />
            <AboutMission />
            <CardList />
            <ImpactStory />
            <Features />
        </React.Fragment>
    );
}

export default LandingPage;
