import {
    MDBCarousel,
    MDBCarouselItem,
} from 'mdb-react-ui-kit';
import './Slider.css';


function Slider() {
    const content = {
        "settings": {
            "interval": "5000",
            "showIndicators": "true",
            "touch": "true",
            "className": "carousel"
        },
        "items": [
            {
                "img": "/src/assets/IMG_20240323_125518.jpg",
                "title": "Educate a Child. Empower a Society",
                "description": "Young readers are future leaders!",
                "alt": "Slide 1"
            },
            {
                "img": "/src/assets/image-k-3.jpg",
                "title": "Towards an educated India",
                "description": "Dedicated to all-round development of children with academics, sports, and culture.",
                "alt": "Slide 2"
            },
            {
                "img": "/src/assets/DSC_0105.jpg",
                "title": "Educate and Empower Young Girls and Women",
                "description": "The progress of a community is measured by the degree of progress of both men and women.",
                "alt": "Slide 3"
            }
        ]
    }

    const { settings, items } = content;

    return (
        <MDBCarousel
            showIndicators={settings.showIndicators}
            interval={settings.interval}
            touch={settings.touch}
            className={settings.className}
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
                        alt={item.alt || `Slide ${index + 1}`}
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