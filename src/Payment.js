import React, { useState, useEffect } from 'react';
import './Payment.css';
import { useStateValue } from './StateProvider';
import CheckoutProduct from './CheckoutProduct';
import { Link, useHistory } from 'react-router-dom';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './reducer';
import axios from './axios';
import { db } from './firebase';

function Payment() {

    const history = useHistory();

    const [{ basket, user, address }, dispatch] = useStateValue();

    const stripe = useStripe();
    const elements = useElements();

    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState(true);

    const [country, setCountry] = useState(''); // new
    const [name, setName] = useState(''); // new
    const [phone, setPhone] = useState(''); // new
    const [pincode, setPincode] = useState(''); // new
    const [bldg, setBldg] = useState(''); // new
    const [street, setStreet] = useState(''); // new
    const [landmark, setLandmark] = useState(''); // new
    const [city, setCity] = useState(''); // new
    const [states, setStates] = useState(''); // new

    const Submit = () => { //new
        // dispatch the item into the data layer
        dispatch({
            type: 'ADD_ADDRESS',
            item: {
                 country: country,
                 name: name,
                 phone: phone,
                 pincode: pincode,
                 bldg: bldg,
                 street: street,
                 landmark: landmark,
                 city: city,
                 states: states
            }
        })
    };

    useEffect(() => {
        // generate the special stripe secret which allows us to charge a customer

        const getClientSecret = async () => {
            const response = await axios({
                method: 'post',
                // Stripe expects the total in a currencies subumit
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`
            });
            setClientSecret(response.data.clientSecret);
        }

        getClientSecret();

    }, [basket]);

    console.log('THE SECRET IS >>>',clientSecret);

    const handleSubmit = async event => {
        // do all the fancy stripe stuff...

        event.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then(({ paymentIntent }) => {
            // paymentIntent = payment confirmation

            db
                .collection('users')
                .doc(user?.uid)
                .collection('orders')
                .doc(paymentIntent.id)
                .set({
                    basket: basket,
                    address: address,
                    amount: paymentIntent.amount / 100,
                    created: paymentIntent.created
                });

            setSucceeded(true);
            setError(null);
            setProcessing(false);

            dispatch({
                type: 'EMPTY_BASKET'
            })

            history.replace('/orders');
        })

    }

    // const AddressSubmit = async event => {
    //     // do all the fancy stripe stuff...

    //     event.preventDefault();
    //     setProcessing(true);

    //     db
    //         .collection('users')
    //         .doc(user?.uid)
    //         .collection('orders')
    //         // .doc(paymentIntent.id)
    //         .set({
    //             basket: basket,
    //             // amount: paymentIntent.amount,
    //             // created: paymentIntent.created
    //         });
    // }

    const handleChange = event => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    }

    return (
        <div className="payment">
            <div className="payment__container">

                <h1>
                    Checkout (
                        <Link to="/checkout">{basket?.length} items</Link>
                        )
                </h1>

                {/* Payment Section => Delivery Address */}
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>
                            Delivery Address
                        </h3>
                    </div>
                    <div className="payment__address">
                        {/* <p>
                            {user?.email}
                        </p> */}
                        {/* <p>
                            Kholi No. 420, Prem Gali
                        </p>
                        <p>
                            Roop Mahal
                        </p> */}
                        <h5>
                                    Country
                                </h5>
                                <input type="text" value={country} className="form__fix" onChange={e => setCountry(e.target.value)}/>

                                <h5>
                                    Name
                                </h5>
                                <input type="text" required pattern="[A-Z a-z]+" placeholder=" First Name     Middle Name       Last Name" value={name} className="form__fix" onChange={e => setName(e.target.value)}/>

                                <h5>
                                    Phone
                                </h5>
                                <input type="tel" pattern="[0-9]{10}" placeholder="10-digit mobile number without prefixes" maxLength="10" value={phone} className="form__fix" onChange={e => setPhone(e.target.value)}/>
                                
                                <h5>
                                    Pincode
                                </h5>
                                <input type="tel" pattern="[0-9]{6}" placeholder="6 digits[0-9] PIN code" maxLength="6"  value={pincode} className="form__fix" onChange={e => setPincode(e.target.value)}/>
                                
                                <h5>
                                    Flat, House no., Building, Apartment
                                </h5>
                                <input type="text" value={bldg} className="form__fix" onChange={e => setBldg(e.target.value)}/>

                                <h5>
                                    Street
                                </h5>
                                <input type="text" value={street} className="form__fix" onChange={e => setStreet(e.target.value)}/>

                                <h5>
                                    Landmark
                                </h5>
                                <input type="text" value={landmark} className="form__fix" onChange={e => setLandmark(e.target.value)}/>

                                <h5>
                                    City
                                </h5>
                                <input type="text" required pattern="[A-Za-z]+" value={city} className="form__fix" onChange={e => setCity(e.target.value)}/>

                                <h5>
                                    State
                                </h5>
                                <input type="text" required pattern="[A-Za-z]+" value={states} className="form__fix" onChange={e => setStates(e.target.value)}/>
                    </div>
                </div>

                {/* Payment Section => Review Items */}
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>
                            Review items &<br/>Delivery
                        </h3>
                    </div>
                    <div className="payment__items">
                        {basket.map(item => (
                            <CheckoutProduct 
                                id={item.id}
                                title={item.title}
                                image={item.image}
                                price={item.price}
                                rating={item.rating}
                            />
                        ))}
                    </div>
                </div>
                
                {/* Payment Section => Payment Metod */}
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>
                            Payment Method
                        </h3>
                    </div>
                    <div className="payment__details">
                        {/* Stripe Magic Will Go Here */}
                        
                        <form onSubmit={handleSubmit}>

                                {/* <h5>
                                    Country
                                </h5>
                                <input type="text" value={country} className="form__fix" onChange={e => setCountry(e.target.value)}/>

                                <h5>
                                    Name
                                </h5>
                                <input type="text" required pattern="[A-Z a-z]+" placeholder=" First Name     Middle Name       Last Name" value={name} className="form__fix" onChange={e => setName(e.target.value)}/>

                                <h5>
                                    Phone
                                </h5>
                                <input type="tel" pattern="[0-9]{10}" placeholder="10-digit mobile number without prefixes" maxLength="10" value={phone} className="form__fix" onChange={e => setPhone(e.target.value)}/>
                                
                                <h5>
                                    Pincode
                                </h5>
                                <input type="tel" pattern="[0-9]{6}" placeholder="6 digits[0-9] PIN code" maxLength="6"  value={pincode} className="form__fix" onChange={e => setPincode(e.target.value)}/>
                                
                                <h5>
                                    Flat, House no., Building, Apartment
                                </h5>
                                <input type="text" value={bldg} className="form__fix" onChange={e => setBldg(e.target.value)}/>

                                <h5>
                                    Street
                                </h5>
                                <input type="text" value={street} className="form__fix" onChange={e => setStreet(e.target.value)}/>

                                <h5>
                                    Landmark
                                </h5>
                                <input type="text" value={landmark} className="form__fix" onChange={e => setLandmark(e.target.value)}/>

                                <h5>
                                    City
                                </h5>
                                <input type="text" required pattern="[A-Za-z]+" value={city} className="form__fix" onChange={e => setCity(e.target.value)}/>

                                <h5>
                                    State
                                </h5>
                                <input type="text" required pattern="[A-Za-z]+" value={states} className="form__fix" onChange={e => setStates(e.target.value)}/> */}

                            <CardElement onChange={handleChange} className="card__fix" />

                            <div className="payment__priceContainer">
                                <CurrencyFormat 
                                    renderText = {(value) => (
                                        <>
                                            <h3>
                                                Order Total : {value}
                                            </h3>
                                        </>
                                    )}
                                    decimalScale={2}
                                    value={getBasketTotal(basket)}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"₹"}
                                />
                                <button disabled={processing || disabled || succeeded} onClick={Submit}>
                                    <span>
                                        {processing ? <p>Processing</p> : "Buy Now"}
                                    </span>
                                </button>
                            </div>

                            {/* Errors */}
                            {error && <div>{error}</div>}
                        </form>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default Payment;
