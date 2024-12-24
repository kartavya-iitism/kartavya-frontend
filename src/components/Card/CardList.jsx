import Card from "./Card";
import education from "../../assets/book.png";
import training from "../../assets/training.png";
import health from "../../assets/health.png";
import environment from "../../assets/environment.png";

import "./Card.css";

const CardList = () => {
    return (
        <div className="cardPile">
            <Card
                image={education}
                title="Providing Free Education and Evening Tutions"
                bg="#92d05b"
            />
            <Card
                image={training}
                title="Training and Providing Financial Supports"
                bg="#3da76e"
            />
            <Card
                image={health}
                title="Organising Health-camps Regularly"
                bg="#0da8a7"
            />
            <Card
                image={environment}
                title="Creating Environmental and Social Awareness"
                bg="#13628c"
            />
        </div>
    );
};

export default CardList;