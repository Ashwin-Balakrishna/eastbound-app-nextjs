import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import styles from './HotelCarousels.module.scss';
import { Container } from 'react-bootstrap';


const HotelCarousel = () => {
    return (
        <Container>
             <Carousel className="w-100 h-100" autoPlay infiniteLoop swipeable>
                <div className={`${styles.carimg}`}>
                    <img src="/images/demo-img3.jpg" />  
                </div>

                <div className={`${styles.carimg}`}>
                    <img src="/images/demo-img2.jpg"/>  
                </div>
                
                <div className={`${styles.carimg}`}>
                    <img src="/images/demo-img3.jpg" />
                    
                </div>
                
                <div className={`${styles.carimg}`}>
                    <img src="/images/demo-img2.jpg" />
                    
                </div>
            </Carousel>
        </Container>
    )
}

export default HotelCarousel