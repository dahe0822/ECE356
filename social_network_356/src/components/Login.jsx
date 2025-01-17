import React, { useState } from 'react';
import { withRouter } from 'react-router';
import '../stylesheets/login.css';

const Login = ({ onLogin, history }) => {
    const [username, setUsername] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`/api/users/${username}`, {
                method: 'GET'
            });
            const body = await response.json();
            if (response.status !== 200) {
                throw Error(body.message);
            }
            if (body.length > 0) {
                const userInfo = body[0]
                onLogin(userInfo);
                history.push('/');
            } else {
                setErrorMsg("Username don't exist. Try again.");
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div className="wrapper">
            <div id="formContent">
                <div className="fadeIn first">
                    <h2>Enter user name</h2>
                </div>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        id="login"
                        name="login"
                        placeholder="username"
                        className="fadeIn second"
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                        value={username}
                    />
                    <p>{errorMsg}</p>
                    <input type="submit" className="fadeIn fourth" value="Log In" />
                </form>
            </div>
        </div>
    );
};

export default withRouter(Login);
