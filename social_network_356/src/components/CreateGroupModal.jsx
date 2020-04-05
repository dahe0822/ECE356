import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, FormControl } from 'react-bootstrap';
import { withRouter } from 'react-router';

const CreateGroupModal = (props) => {
  const [show, setShow] = useState(false);
  const [groupSize, setGroupSize] = useState(2);
  const [groupName, setGroupName] = useState("");


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //follow and unfollow
  const handleCreate = async () => {
    if(groupName.length==0) return;
    const data = { admin_id: props.userId, name: groupName, memberSizeLimit: groupSize };
    try {
      const response = await fetch('/api/group/', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(data)
      });
      const body = await response.json();
      if (response.status !== 200) {
          throw Error(body.message);
      }
      
      //re-route
      console.log(body);
      if(body && body.insertedId){
        props.history.push(`/group/${body.insertedId}`);
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Create Group
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create a Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicRangeCustom">
              <Form.Label>Group Name:</Form.Label>
              <Form.Control value={groupName} onChange={(e)=>{setGroupName(e.target.value)}} size="lg" type="text" placeholder="Group Name" required />
            </Form.Group>
            <Form.Group controlId="formBasicRangeCustom">
              <Form.Label>Group Size: {groupSize}</Form.Label>
              <Form.Control value={groupSize} onChange={(e)=>{setGroupSize(e.target.value)}} type="range" min="2" max="20" custom />
            </Form.Group>
          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreate}>
            Create Group
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default withRouter(CreateGroupModal);
