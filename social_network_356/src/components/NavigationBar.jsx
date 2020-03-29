import React from 'react';
import { Navbar } from 'react-bootstrap';
import '../stylesheets/navigationBar.css';

const NavigationBar = props => {
    return (
        
        <>
        <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="">Social Network 356</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
            Signed in as: {props.username}
            </Navbar.Text>
        </Navbar.Collapse>
        </Navbar>
        </>
    );
  };
  
export default NavigationBar;