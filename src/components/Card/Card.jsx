import "./Card.css";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const Card = (props) => {
    return (
        <div className="card" style={{ background: props.bg, borderRadius: "0" }}>
            <img className="card-img" src={props.image} alt="img1" />
            <p>{props.title}</p>
            <Link to={props.to}>
                <button className="blue-btn">Support Us</button>
            </Link>
        </div>
    );
};
Card.propTypes = {
    title: PropTypes.string.isRequired,
    bg: PropTypes.string,
    image: PropTypes.string,
    to: PropTypes.string
};

export default Card;