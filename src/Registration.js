import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import './Registration.css';
import { Link, useHistory } from 'react-router-dom';
import { useStateValue } from './StateProvider';

function Registration() {

    const [{ userDetails, user }, dispatch] = useStateValue();

    const history = useHistory();

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // useEffect(() => {
    //     //will only run once when the app component loads...
  
    //     auth.onAuthStateChanged(authUser => {
    //     //   console.log('THE USER IS >>> ',authUser);
  
    //     //   if (authUser) {
    //     //     // the user just logged in / the user was logged in
  
    //     //     dispatch({
    //     //       type: 'SET_USER',
    //     //       user: authUser
    //     //     })
    //     //   } else {
    //     //     // the user is logged out
    //     //     dispatch({
    //     //       type: 'SET_USER',
    //     //       user: null
    //     //     })
    //     //   }
    //     })
    // }, []);

    const register = async e => {
        e.preventDefault();

        // 
        dispatch({
            type: "SET_USERDETAILS",
            item: {
                name: name,
                username: username,
                email: email,
                password: password
            }
        })
        // 

        // do some fancy firebase register shitttttttt...
        auth
            .createUserWithEmailAndPassword(email, password)
            .then((auth) => {
                // it successfully created a new user with email and password
                console.log(auth);
                if (auth) {
                    history.push('/');
                }

                return auth.user.updateProfile({
                    displayName: username
                })
            })
            .catch(error => alert(error.message));


        // db
        //     .collection('users')
        //     .doc(user?.uid)
        //     .set({
        //         userDetails: userDetails
        //     });
    }

    return (
        <div className="registration">
            <Link to='/'>
                <img 
                    className="registraion__logo"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png" 
                    alt=""
                />
            </Link>

            <div className="registration__container">
                <h1>
                    Registration
                </h1>
                <form>
                    <h5>
                        Name
                    </h5>
                    <input type="text" required pattern="[A-Z a-z]+" placeholder=" First Name     Middle Name       Last Name" value={name} onChange={e => setName(e.target.value)}/>
                    <h5>
                        Username
                    </h5>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)}/>
                    <h5>
                        E-mail
                    </h5>
                    <input type="text" placeholder=" helloworld@example.com" value={email} onChange={e => setEmail(e.target.value)}/>

                    <h5>
                        Password
                    </h5>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>

                    <button 
                        type='submit'
                        onClick={register}
                        className="registration__createAccountButton">
                        Create My Amazon Account
                    </button>
                </form>

                <div className="redirect__login">
                    <p>
                        Have an existing account?
                    </p>
                    <Link to="/login">
                        <p className="redirect__link">
                            Sign In
                        </p>
                    </Link>
                </div>

                <p>
                    By registering you agree to Amazon Fake Clone's Conditions of Use & Sale. Please see our Privacy Notice, our Cookies Notice and our Interest-Based Ads Notice.
                </p>
            </div>
        </div>
    )
}

export default Registration;
