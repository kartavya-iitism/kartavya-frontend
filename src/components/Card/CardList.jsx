import Card from "./Card";
import "./Card.css";
import book from "../../assets/book.png"
import training from "../../assets/training.png"
import health from "../../assets/health.png"
import environment from "../../assets/environment.png"

const CardList = () => {
    const content = {
        "cards": [
            {
                "image": book,
                "title": "Providing Free Education and Evening Tutions",
                "backgroundColor": "#92d05b",
                "to": "/donate"
            },
            {
                "image": training,
                "title": "Training and Providing Financial Supports",
                "backgroundColor": "#3da76e",
                "to": "/contact"
            },
            {
                "image": health,
                "title": "Organising Health-camps Regularly",
                "backgroundColor": "#0da8a7",
                "to": "/contact"
            },
            {
                "image": environment,
                "title": "Creating Environmental and Social Awareness",
                "backgroundColor": "#13628c",
                "to": "/donate-item"
            }
        ]
    }

    return (
        <div className="cardPile">
            {content.cards.map((card, index) => (
                <Card
                    key={index}
                    image={card.image}
                    title={card.title}
                    to={card.to}
                    bg={card.backgroundColor}
                />
            ))}
        </div>
    );
};

export default CardList;