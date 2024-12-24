import {
    MDBCarousel,
    MDBCarouselItem,
} from 'mdb-react-ui-kit';
import Image3 from "../../assets/image-k-3.jpg";
import Image4 from "../../assets/DSC_0105.jpg";
import Image6 from "../../assets/IMG_20240323_125518.jpg";
import './Slider.css';

function Slider() {
    const items = [
        {
            img: Image6,
            title: "Educate a Child. Empower a Society",
            description: "Young readers are future leaders!"
        },
        {
            img: Image3,
            title: "Towards an educated India",
            description: "Dedicated to all-round development of children with academics, sports, and culture."
        },
        {
            img: Image4,
            title: "Educate and Empower Young Girls and Women",
            description: "The progress of a community is measured by the degree of progress of both men and women."
        }
    ];

    return (
        <MDBCarousel
            showIndicators
            interval={5000}
            touch={true}
            className="carousel"
        >
            {items.map((item, index) => (
                <MDBCarouselItem
                    key={index}
                    className="carousel-item"
                    itemId={index + 1}
                >
                    <img
                        src={item.img}
                        className="d-block w-100 slider-image"
                        alt={`Slide ${index + 1}`}
                        loading="eager"
                    />
                    <div className="carousel-caption">
                        <h2 className="slide-title">{item.title}</h2>
                        <p className="slide-description">{item.description}</p>
                    </div>
                </MDBCarouselItem>
            ))}
        </MDBCarousel>
    );
}

export default Slider;