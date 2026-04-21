import React, { useState } from 'react';
import axios from 'axios';

function AddSubject() {
    const [subject, setSubject] = useState({ subjectCode: '', subjectName: '', credits: '', semester: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/subjects', subject)
            .then(() => {
                alert("Subject Added Successfully!");
                setSubject({ subjectCode: '', subjectName: '', credits: '', semester: '' });
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="card-container">
            <h2>Admin: Add New Subject</h2>
            <form onSubmit={handleSubmit} className="form-group">
                <input type="text" placeholder="Subject Code (CS101)" value={subject.subjectCode} onChange={(e) => setSubject({...subject, subjectCode: e.target.value})} />
                <input type="text" placeholder="Subject Name" value={subject.subjectName} onChange={(e) => setSubject({...subject, subjectName: e.target.value})} />
                <input type="number" placeholder="Credits" value={subject.credits} onChange={(e) => setSubject({...subject, credits: e.target.value})} />
                <input type="number" placeholder="Semester" value={subject.semester} onChange={(e) => setSubject({...subject, semester: e.target.value})} />
                <button type="submit" className="btn-save">Create Subject</button>
            </form>
        </div>
    );
}

export default AddSubject;