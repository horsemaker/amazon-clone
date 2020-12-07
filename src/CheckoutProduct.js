import React, { useState, useEffect } from 'react';
import './CheckoutProduct.css';
import './Product.css';
import { useStateValue } from './StateProvider';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { db } from './firebase';
import firebase from "firebase";

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

function CheckoutProduct({ id, image, title, price, rating, hideButton, reviewButton, admin }) {

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const [openReviewItem, setOpenReviewItem] = useState(false);

    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState('');

    const [{ basket, user }, dispatch] = useStateValue();

    useEffect(() => {
        let unsubscribe;
        if (id) {
            unsubscribe = db
                .collection("products")
                .doc(id)
                .collection("reviews")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setReviews(snapshot.docs.map((doc) => doc.data()));
                });
        }
        return () => {
            unsubscribe();
        };
    }, [id]);

    const removeFromBasket = () => {
        // remove the item from the basket
        dispatch({
            type: 'REMOVE_FROM_BASKET',
            id: id,
        })
    }

    const postReview = (event) => {
        event.preventDefault();

        db.collection("products").doc(id).collection("reviews").add({
            review: review,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setReview('');
    }

    return (
        <div className="checkoutProduct">

            <Modal
                className="modal"
                open={openReviewItem}
                onClose={() => setOpenReviewItem(false)}
            >
                <div style={modalStyle} className={classes.paper}>
                    <div className="modal__productInfo">
                        <p>
                            {title}
                        </p>

                        <p className="modal__productPrice">
                            <small>₹</small>
                            <strong>{price}</strong>
                        </p>

                        <div className="modal__productRating">
                            {Array(rating).fill().map((_, i) => (
                                <p> 
                                    <span role="img" aria-label="star1">⭐</span> 
                                </p>
                            ))}
                        </div>
                    </div>

                    <img 
                        className="modal__productImage"
                        src={image} 
                        alt=""
                    />

                    <div className="reviews">
                        <strong>
                            Reviews:
                        </strong>

                        <div className="product__reviews">
                            {reviews.map((review) => (
                                <p>
                                    <strong className="user__emailId">{review.username}</strong>{review.review}
                                </p>         
                            ))}
                        </div>

                        {user && (
                            <form className="product__reviewBox">
                                <input
                                    className="product__input"
                                    type="text"
                                    placeholder="Add a review..."
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)} 
                                />

                                <button
                                    disabled={!review}
                                    className="post__button"
                                    type="submit"
                                    onClick={postReview}
                                >
                                    Post
                                </button>
                            </form>
                        )}
                    </div>
                    
                </div>
            </Modal>

            <img 
                className="checkoutProduct__image"
                src={image}
                alt=""
            />

            <div className="checkoutProduct__info">
                <p
                    className="checkoutProduct__title"
                >
                    {title}
                </p>
                <p className="checkoutProduct__price">
                    <small>₹</small>
                    <strong>{price}</strong>
                </p>
                <div className="checkoutProduct__rating">
                    {Array(rating).fill().map((_, i) => (
                        <p> 
                            <span role="img" aria-label="star1">⭐</span> 
                        </p>
                    ))}
                </div>
                {!hideButton && (
                    <button onClick={removeFromBasket}>
                    Remove from basket
                </button>
                )}

                {/* if admin then no review this button */}

                {reviewButton && user?.email!=="horsemaker@gmail.com" && (
                    <button onClick={() => setOpenReviewItem(true)}>
                        Review this item
                    </button>
                )}
               
            </div>
        </div>
    )
}

export default CheckoutProduct;
