import React, { useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Home from './components/Home';

function App() {
    //if userId null, then it's not yet authenticated
    const [userId, setUserId] = useState(null);
    //if not authenticated, then route to /login
    const PrivateRoute = ({ component: Component, ...rest }) => (
        <Route
            {...rest}
            render={(props) =>
                userId != null ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login" component={LandingPage}>
                    <LandingPage
                        onLogin={(userId) => {
                            setUserId(userId);
                        }}
                    />
                </Route>
                <PrivateRoute path="/" component={Home}></PrivateRoute>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
