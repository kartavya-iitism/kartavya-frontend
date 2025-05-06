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
                "image": environment,
                "title": "Creating Environmental and Social Awareness",
                "backgroundColor": "#13628c",
                "to": "/contact"
            },
            {
                "image": health,
                "title": "Organising Health-camps Regularly",
                "backgroundColor": "#0da8a7",
                "to": "/contact"
            },
            {

                "image": training,
                "title": "Donate Essential Goods!",
                "backgroundColor": "#3da76e",
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