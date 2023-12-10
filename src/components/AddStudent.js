// AddStudent.js
import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    className: "",
    gender: "",
    dob: "",
    pinCode: "",
    subjectScores: [{ subject: "", score: "" }],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubject = () => {
    setFormData({
      ...formData,
      subjectScores: [...formData.subjectScores, { subject: "", score: "" }],
    });
  };

  const handleSubjectChange = (index, e) => {
    const updatedScores = [...formData.subjectScores];
    updatedScores[index][e.target.name] = e.target.value;
    setFormData({ ...formData, subjectScores: updatedScores });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to save the student data
    console.log("Form submitted:", formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formClass">
        <Form.Label>Class</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter class"
          name="className"
          value={formData.className}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formGender">
        <Form.Label>Gender</Form.Label>
        <Form.Control
          as="select"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formDOB">
        <Form.Label>Date of Birth</Form.Label>
        <Form.Control
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formPinCode">
        <Form.Label>PIN Code</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter PIN code"
          name="pinCode"
          value={formData.pinCode}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="formSubjectScores">
        <Form.Label>Subject Scores</Form.Label>
        {formData.subjectScores.map((subject, index) => (
          <Row key={index}>
            <Col>
              <Form.Control
                type="text"
                placeholder="Enter subject"
                name="subject"
                value={subject.subject}
                onChange={(e) => handleSubjectChange(index, e)}
              />
            </Col>
            <Col>
              <Form.Control
                type="number"
                placeholder="Enter score"
                name="score"
                value={subject.score}
                onChange={(e) => handleSubjectChange(index, e)}
              />
            </Col>
          </Row>
        ))}
        <Button type="button" onClick={handleAddSubject}>
          Add Student
        </Button>
      </Form.Group>
    </Form>
  );
};

export default AddStudent;
