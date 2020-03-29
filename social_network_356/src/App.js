import React, { useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';

function App() {
    //if userId null, then it's not yet authenticated
    const [user, setUser] = useState(null);
    //if not authenticated, then route to /login
    const PrivateRoute = ({ component: Component, ...rest }) => (
        <Route
            {...rest}
            render={(props) =>
                user != null ? (
                    <Component 
                    {...props}
                    user={user} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login" component={Login}>
                    <Login
                        onLogin={(user) => {
                            setUser(user);
                        }}
                    />
                </Route>
                <PrivateRoute path="/" component={Home} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
