import React from 'react';
import './Home.css';
import Product from './Product';

function Home() {
    return (
        <div className="home">
            <div className="home__container">
                
                <img 
                    className="home__image"
                    src="https://images-eu.ssl-images-amazon.com/images/G/02/digital/video/merch2016/Hero/Covid19/Generic/GWBleedingHero_ENG_COVIDUPDATE__XSite_1500x600_PV_en-GB._CB28684220_.jpg" 
                    alt=""
                />

                <div className="home__row">
                    <Product 
                        id="12341234"
                        title="Zero to One: Notes on Start Ups, or How to Build the Future"
                        image="https://images-na.ssl-images-amazon.com/images/I/71uAI28kJuL.jpg"
                        price={399}
                        rating={5}
                    />
                    <Product 
                        id="23452345"
                        title="Apple MacBook Pro (16-inch, 16GB RAM, 512GB Storage, 2.6GHz 9th Gen Intel Core i7) - Space Grey"
                        image="https://images-na.ssl-images-amazon.com/images/I/71L2iBSyyOL._SL1500_.jpg"
                        price={179990.00}
                        rating={4}
                    />
                </div>

                <div className="home__row">
                    <Product
                        id="34563456"
                        title="Apple iPhone 11 Pro Max (64GB) - Space Grey"
                        image="https://images-na.ssl-images-amazon.com/images/I/61tuQdl2yLL._SL1024_.jpg"
                        price={107100.00}
                        rating={4}
                    />
                    <Product
                        id="45674567"
                        title="Apple Watch Series 3"
                        image="https://images-na.ssl-images-amazon.com/images/I/7171gCRU7QL._SL1500_.jpg"
                        price={37073.00}
                        rating={4}
                    />
                    <Product
                        id="56785678"
                        title="Apple iPad Pro"
                        image="https://images-na.ssl-images-amazon.com/images/I/81uZx3TL29L._SL1500_.jpg"
                        price={130900.00}
                        rating={4} 
                    />
                </div>

                <div className="home__row">
                    <Product
                        id="67896789"
                        title="Samsung 189 cm (75 inches) 7 Series 75NU7100 4K LED Smart TV (Black)"
                        image="https://images-na.ssl-images-amazon.com/images/I/91jzADbYVnL._SL1500_.jpg"
                        price={239990.00}
                        rating={4} 
                    />
                </div>

            </div>
        </div>
    )
}

export default Home;
