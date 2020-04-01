import React, { useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login';
import SearchPage from './components/SearchPage';
import Home from './components/Home';
import NavigationBar from './components/NavigationBar'

function App() {
    //if userId null, then it's not yet authenticated
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user'))||null);
    //if not authenticated, then route to /login
    const PrivateRoute = ({ component: Component, ...rest }) => (
        <Route
            {...rest}
            render={(props) =>
                user != null ? (
                  <>
                    <NavigationBar
                      username={user.username}
                    />
                    <Component 
                    {...props}
                    user={user} />
                  </>
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
                            localStorage.setItem('user', JSON.stringify(user));
                        }}
                    />
                </Route>
                <PrivateRoute path="/search" component={SearchPage} />
                <PrivateRoute path="/" component={Home} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
