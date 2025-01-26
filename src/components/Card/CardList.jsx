import Card from "./Card";
import "./Card.css";


const CardList = () => {
    const content = {
        "cards": [
            {
                "image": "/src/assets/book.png",
                "title": "Providing Free Education and Evening Tutions",
                "backgroundColor": "#92d05b",
                "to": "/donate"
            },
            {
                "image": "/src/assets/training.png",
                "title": "Training and Providing Financial Supports",
                "backgroundColor": "#3da76e",
                "to": "/contact"
            },
            {
                "image": "/src/assets/health.png",
                "title": "Organising Health-camps Regularly",
                "backgroundColor": "#0da8a7",
                "to": "/contact"
            },
            {
                "image": "/src/assets/environment.png",
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