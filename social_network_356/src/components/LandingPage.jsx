import React, { Component } from 'react';
import "../stylesheets/login.css";

class LandingPage extends Component {
    state = { 
        // count: 1
     }
    render() { 
        return (  
        <>

        <div class="wrapper">

            <div id="formContent">

                <div class="fadeIn first">
                    <h2>Enter user name</h2>
                </div>
                <form>
                    <input type="text" id="login" class="fadeIn second" name="login" placeholder="username" />
                    <input type="submit" class="fadeIn fourth" value="Log In" />
                </form>

            </div>

        </div>

        </>
        
        );
    }
}
 
export default LandingPage;