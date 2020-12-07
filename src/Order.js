import moment from 'moment';
import React, { useState } from 'react';
import CurrencyFormat from 'react-currency-format';
import CheckoutProduct from './CheckoutProduct';
import './Order.css';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 500,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
}));

function Order({ order, admin }) {

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const [openKnowMore, setOpenKnowMore] = useState(false);

    return (
        <div className='order'>
            <h2>
                Order
            </h2>
            <p>
                {moment.unix(order.data.created).format("MMMM Do YYYY, h:mma")}
            </p>
            <p className="order__id">
                <small>
                    {order.id}
                </small>
            </p>

            {order.data.basket?.map(item => (
                <CheckoutProduct
                    id={item.id}
                    title={item.title}
                    image={item.image}
                    price={item.price}
                    rating={item.rating}
                    hideButton
                    reviewButton
                    admin
                />
            ))}

            <CurrencyFormat 
                renderText={(value) => (
                    <>
                        <h3 className="order__total">
                            Order Total: {value}
                        </h3>
                    </>
                )}
                decimalScale={2}
                value={order.data.amount}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"₹"}
            />

            <Modal
                className="modal"
                open={openKnowMore}
                onClose={() => setOpenKnowMore(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    {order.data.basket?.map(item => (
                        <CheckoutProduct
                            id={item.id}
                            title={item.title}
                            image={item.image}
                            price={item.price}
                            rating={item.rating}
                            hideButton
                            reviewButton
                            admin
                        />
                    ))}   

                    <CurrencyFormat 
                        renderText={(value) => (
                        <>
                            <h3 className="order__total">
                                Order Total: {value}
                            </h3>
                        </>
                        )}
                        decimalScale={2}
                        value={order.data.amount}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"₹"}
                    />

                    <strong>
                        Delivary Details:
                    </strong>
                    <p>
                        {order.data.address[0].name}
                    </p>
                    <p>
                        {order.data.address[0].phone}
                    </p>
                    <p>
                        {order.data.address[0].bldg}
                    </p>
                    <p>
                        {order.data.address[0].landmark}
                    </p>
                    <p>
                        {order.data.address[0].street}
                    </p>
                    <p>
                        {order.data.address[0].city}
                    </p>
                    <p>
                        {order.data.address[0].pincode}
                    </p>
                    <p>
                        {order.data.address[0].states}
                    </p>
                    <p>
                        {order.data.address[0].country}
                    </p>
                </div>
            </Modal>

            {admin && (<button onClick={() => setOpenKnowMore(true)} className="order__knowMore">Know More</button>)}
            
        </div>
    )
}

export default Order;
