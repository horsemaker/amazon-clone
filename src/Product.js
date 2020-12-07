import React, { useState, useEffect } from 'react';
import './Product.css';
import { useStateValue } from './StateProvider';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { db } from './firebase';
// import firebase from "firebase";

// 
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
// 

function Product({ id, title, image, price, rating }) {

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const [openSeeMore, setOpenSeeMore] = useState(false);

    const [reviews, setReviews] = useState([]);
    // const [review, setReview] = useState('');

    const [ { basket, user }, dispatch] = useStateValue();

    // console.log('this is the basket >>> ', basket);

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

    const addToBasket = () => {
        // dispatch the item into the data layer
        dispatch({
            type: 'ADD_TO_BASKET',
            item: {
                id: id,
                title: title,
                image: image,
                price: price,
                rating: rating
            }
        })
    };

    // const postReview = (event) => {
    //     event.preventDefault();

    //     db.collection("products").doc(id).collection("reviews").add({
    //         review: review,
    //         user_emailId: user.email,
    //         timestamp: firebase.firestore.FieldValue.serverTimestamp()
    //     });
    //     setReview('');
    // }

    return (
        <div className="product">
            
            <div className="product__info">

                <p>
                    {title}
                </p>

                <p className="product__price">
                    <small>₹</small>
                    <strong>{price}</strong>
                </p>

                <div className="product__rating">
                    {Array(rating).fill().map((_, i) => (
                        <p> 
                            <span role="img" aria-label="star1">⭐</span> 
                        </p>
                    ))}
                </div>
            
            </div>

            <img 
                src={image} 
                alt=""
            />

            <Modal
                className="modal"
                open={openSeeMore}
                onClose={() => setOpenSeeMore(false)}
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

                    <button className="modal__button" onClick={addToBasket}>
                        Add to Basket
                    </button>

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

                        {/* {user && (
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
                        )} */}
                    </div>
                    
                </div>
            </Modal>

            <button onClick={() => setOpenSeeMore(true)}>
                See More
            </button>
            <button onClick={addToBasket}>
                Add to Basket
            </button>
        
        </div>
    );
}

export default Product;
