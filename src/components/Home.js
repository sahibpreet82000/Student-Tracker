import React, { useState } from "react";
import Papa from "papaparse";
import { Modal, Button, Form } from "react-bootstrap";
import "../components/Home.css"; // Import a separate CSS file for styling
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChartComponent from "./ChartComponent";

const Home = () => {
  const [csvData, setCsvData] = useState(() => {
    const storedData = localStorage.getItem("csvData");
    return storedData ? JSON.parse(storedData) : [];
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editedRecord, setEditedRecord] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const recordsPerPage = 10;
  const [newRecord, setNewRecord] = useState({});

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          // Assuming the CSV has headers
          const data = result.data;
          setCsvData(data);

          localStorage.setItem("csvData", JSON.stringify(data));
        },
        header: true, // Set to true if your CSV has headers
      });
    }
  };

  console.log("currentPage:", currentPage);
  console.log("recordsPerPage:", recordsPerPage);
  console.log("csvData:", csvData);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = csvData.slice(indexOfFirstRecord, indexOfLastRecord);

  console.log(currentRecords);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    // setEditedRecord({ ...csvData[indexOfFirstRecord + index] });
    setEditedRecord(currentRecords[index]);
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    // Update the state with the edited values
    const updatedRecords = [...csvData];
    updatedRecords[indexOfFirstRecord + editIndex] = editedRecord;
    setCsvData(updatedRecords);

    // Close the modal
    setShowEditModal(false);
  };

  const handleEditChange = (column, value) => {
    setEditedRecord((prevRecord) => ({
      ...prevRecord,
      [column]: value,
    }));
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    const updatedRecords = [...csvData];
    updatedRecords.splice(indexOfFirstRecord + deleteIndex, 1);
    setCsvData(updatedRecords);

    setShowDeleteModal(false);
  };

  const handleAdd = () => {
    setNewRecord({});
    setShowAddModal(true);
  };

  const handleAddSave = () => {
    const updatedRecords = [...csvData, newRecord];
    setCsvData(updatedRecords);

    // Save to localStorage
    localStorage.setItem("csvData", JSON.stringify(updatedRecords));

    setShowAddModal(false);
    toast.success("Student added successfully!");
  };

  const handleAddChange = (column, value) => {
    setNewRecord((prevRecord) => ({
      ...prevRecord,
      [column]: value,
    }));
  };

  const handleDownloadCSV = () => {
    const csvContent = csvData;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, "student_records.csv");
    } else {
      // Other browsers
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = "student_records.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="home-container">
      <h1>Student Score Tracker</h1>

      <div className="csv-container">
        <h2>Import CSV File</h2>
        <input
          className="upload-btn-wrapper btn"
          type="file"
          onChange={handleFileChange}
        />

        {csvData && csvData.length > 0 && (
          <div>
            <h3>CSV Data</h3>
            <div className="record">
              {" "}
              <Button
                classname="download"
                variant="success"
                onClick={handleAdd}
              >
                Add Record
              </Button>
              <Button
                className="download"
                variant="success"
                onClick={handleDownloadCSV}
              >
                Download CSV
              </Button>
            </div>
            <table className="csv-table table-responsive">
              <thead>
                <tr>
                  {Object.keys(csvData[0]).map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((row, index) => (
                  <tr key={index}>
                    {Object.keys(row).map((column) => (
                      <td key={column}>{row[column]}</td>
                    ))}
                    <td>
                      <button onClick={() => handleEdit(index)}>Edit</button>
                      <button onClick={() => handleDelete(index)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              {Array.from(
                { length: Math.ceil(csvData.length / recordsPerPage) },
                (_, index) => (
                  <button key={index} onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </button>
                )
              )}
            </div>

            {/* <ChartComponent data={csvData} labelColumn="Name" />{" "} */}
          </div>
        )}

        {/* Add Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Student</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {csvData[0] &&
                Object.keys(csvData[0]).map((column) => (
                  <Form.Group key={column} controlId={`add${column}`}>
                    <Form.Label>{column}</Form.Label>
                    <Form.Control
                      type="text"
                      value={newRecord[column] || ""}
                      onChange={(e) => handleAddChange(column, e.target.value)}
                    />
                  </Form.Group>
                ))}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddSave}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Modal */}

        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Record</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {Object.keys(editedRecord).map((column) => (
                <Form.Group key={column} controlId={`edit${column}`}>
                  <Form.Label>{column}</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedRecord[column]}
                    onChange={(e) => handleEditChange(column, e.target.value)}
                  />
                </Form.Group>
              ))}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleEditSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this record?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Home;
