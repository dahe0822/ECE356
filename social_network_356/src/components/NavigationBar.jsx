import React, {useState} from 'react';
import { withRouter } from 'react-router';
import { Nav, Navbar, Button, Form, FormControl } from 'react-bootstrap';
import {
  Link
} from "react-router-dom"
import '../stylesheets/navigationBar.css';

const NavigationBar = props => {
  const [searchMode,setSearchMode] = useState("0");
  const [searchVal,setSearchVal] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    const queryType = {
      "0": "user",
      "1": "hashtag",
      "2": "group"
    };
    props.history.push({ pathname:"/search", search:`?${queryType[searchMode]}=${searchVal}`, state:{searchVal, searchMode}});
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">Social Network 356</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="centerGroup justify-content-center">
        <Form inline onSubmit={handleSearch}>
          <Form.Control as="select" value={searchMode} onChange={(e)=>{setSearchMode(e.target.value)}}>
            <option value="0">People</option>
            <option value="1">Hashtags</option>
            <option value="2">Groups</option>
          </Form.Control>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" value={searchVal} onChange={(e)=>{setSearchVal(e.target.value)}}/>
          <Button variant="outline-info" type="submit">Search</Button>
        </Form>
      </Navbar.Collapse>
      <Navbar.Collapse className="rightGroup justify-content-end">
        <Navbar.Text>
          Signed in as: {props.user.username}
        </Navbar.Text>
        <Nav>
          <Nav.Link href="/login">Logout</Nav.Link>
        </Nav>
      </Navbar.Collapse>
      </Navbar>
    </>
  );
};
  
export default withRouter(NavigationBar);