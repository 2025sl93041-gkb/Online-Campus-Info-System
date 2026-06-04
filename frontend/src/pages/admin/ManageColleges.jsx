import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collegeApi } from '../../api/collegeApi';
import { fileApi } from '../../api/fileApi';

const ManageColleges = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', location: '', city: '', state: '',
    establishedYear: '', strength: '', website: '', contactEmail: '', contactPhone: ''
  });
  const [error, setError] = useState('');
  const [uploadingFor, setUploadingFor] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageCaption, setImageCaption] = useState('');
  const [uploadMsg, setUploadMsg] = useState('');
  const [addingCourseFor, setAddingCourseFor] = useState(null);
  const [courseData, setCourseData] = useState({ name: '', department: '', duration: '4 years', degreeType: 'B.Tech', eligibilityCriteria: '', totalSeats: '', fee: '', description: '' });
  const [courseMsg, setCourseMsg] = useState('');

  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async () => {
    try {
      const response = await collegeApi.getMyColleges();
      setColleges(response.data);
    } catch (error) {
      console.error('Failed to load colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', location: '', city: '', state: '',
      establishedYear: '', strength: '', website: '', contactEmail: '', contactPhone: '' });
    setEditingCollege(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (college) => {
    setFormData({
      name: college.name || '',
      description: college.description || '',
      location: college.location || '',
      city: college.city || '',
      state: college.state || '',
      establishedYear: college.establishedYear || '',
      strength: college.strength || '',
      website: college.website || '',
      contactEmail: college.contactEmail || '',
      contactPhone: college.contactPhone || '',
    });
    setEditingCollege(college);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...formData,
      establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : null,
      strength: formData.strength ? parseInt(formData.strength) : null,
    };

    try {
      if (editingCollege) {
        await collegeApi.updateCollege(editingCollege.id, payload);
      } else {
        await collegeApi.createCollege(payload);
      }
      resetForm();
      loadColleges();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this college?')) return;
    try {
      await collegeApi.deleteCollege(id);
      loadColleges();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleImageUpload = async (collegeId) => {
    if (!imageFile) {
      setUploadMsg('Please select a file first');
      return;
    }
    setUploadMsg('Uploading...');
    try {
      await fileApi.uploadImage(imageFile, collegeId, imageCaption, '');
      setUploadMsg('Image uploaded successfully!');
      setImageFile(null);
      setImageCaption('');
      setTimeout(() => {
        setUploadingFor(null);
        setUploadMsg('');
      }, 2000);
    } catch (err) {
      setUploadMsg(err.response?.data?.message || 'Upload failed');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="manage-colleges">
      <div className="page-header">
        <h1>Manage Colleges</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add College'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>{editingCollege ? 'Edit College' : 'Add New College'}</h2>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>College Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Location/Address</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Established Year</label>
                <input type="number" name="establishedYear" value={formData.establishedYear} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Student Strength</label>
                <input type="number" name="strength" value={formData.strength} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Website</label>
                <input type="url" name="website" value={formData.website} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Contact Email</label>
                <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label>Contact Phone</label>
              <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingCollege ? 'Update College' : 'Create College'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {colleges.length === 0 ? (
        <div className="no-results">
          <p>You haven't added any colleges yet. Click "Add College" to get started.</p>
        </div>
      ) : (
        <div className="college-list">
          {colleges.map((college) => (
            <div key={college.id} className="college-card">
              <div className="college-card-header">
                <h3>{college.name}</h3>
                <div className="card-actions">
                  <button onClick={() => { setAddingCourseFor(addingCourseFor === college.id ? null : college.id); setCourseMsg(''); }} className="btn-edit">📚 Add Course</button>
                  <button onClick={() => setUploadingFor(uploadingFor === college.id ? null : college.id)} className="btn-edit">📷 Upload Image</button>
                  <button onClick={() => handleEdit(college)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(college.id)} className="btn-delete">Delete</button>
                </div>
              </div>
              <p className="college-location">📍 {college.city}, {college.state}</p>
              <div className="college-meta">
                {college.establishedYear && <span>Est. {college.establishedYear}</span>}
                {college.strength && <span>👥 {college.strength}</span>}
              </div>

              {addingCourseFor === college.id && (
                <div className="upload-section">
                  <h4>Add New Course</h4>
                  {courseMsg && <div className={courseMsg.includes('success') ? 'success-msg' : 'error-msg'}>{courseMsg}</div>}
                  <div className="form-row">
                    <div className="form-group">
                      <label>Course Name *</label>
                      <input type="text" value={courseData.name} onChange={(e) => setCourseData({...courseData, name: e.target.value})} placeholder="e.g., B.Tech Computer Science" required />
                    </div>
                    <div className="form-group">
                      <label>Department</label>
                      <input type="text" value={courseData.department} onChange={(e) => setCourseData({...courseData, department: e.target.value})} placeholder="e.g., CSE, ECE, ME" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Duration</label>
                      <select value={courseData.duration} onChange={(e) => setCourseData({...courseData, duration: e.target.value})}>
                        <option value="4 years">4 years</option>
                        <option value="3 years">3 years</option>
                        <option value="2 years">2 years</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Degree Type</label>
                      <select value={courseData.degreeType} onChange={(e) => setCourseData({...courseData, degreeType: e.target.value})}>
                        <option value="B.Tech">B.Tech</option>
                        <option value="M.Tech">M.Tech</option>
                        <option value="MCA">MCA</option>
                        <option value="BCA">BCA</option>
                        <option value="MBA">MBA</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Total Seats</label>
                      <input type="number" value={courseData.totalSeats} onChange={(e) => setCourseData({...courseData, totalSeats: e.target.value})} placeholder="60" />
                    </div>
                    <div className="form-group">
                      <label>Fee (per year)</label>
                      <input type="number" value={courseData.fee} onChange={(e) => setCourseData({...courseData, fee: e.target.value})} placeholder="85000" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Eligibility Criteria</label>
                    <input type="text" value={courseData.eligibilityCriteria} onChange={(e) => setCourseData({...courseData, eligibilityCriteria: e.target.value})} placeholder="e.g., 60% in 12th with PCM" />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input type="text" value={courseData.description} onChange={(e) => setCourseData({...courseData, description: e.target.value})} placeholder="Brief about the course" />
                  </div>
                  <button onClick={async () => {
                    if (!courseData.name) { setCourseMsg('Course name is required'); return; }
                    setCourseMsg('Adding...');
                    try {
                      await collegeApi.addCourse(college.id, { ...courseData, totalSeats: courseData.totalSeats ? parseInt(courseData.totalSeats) : null, fee: courseData.fee ? parseFloat(courseData.fee) : null });
                      setCourseMsg('Course added successfully!');
                      setCourseData({ name: '', department: '', duration: '4 years', degreeType: 'B.Tech', eligibilityCriteria: '', totalSeats: '', fee: '', description: '' });
                      setTimeout(() => { setAddingCourseFor(null); setCourseMsg(''); }, 2000);
                    } catch (err) { setCourseMsg(err.response?.data?.message || 'Failed to add course'); }
                  }} className="btn-primary">Add Course</button>
                </div>
              )}

              {uploadingFor === college.id && (
                <div className="upload-section">
                  <h4>Upload Facility Image</h4>
                  {uploadMsg && <div className={uploadMsg.includes('success') ? 'success-msg' : 'error-msg'}>{uploadMsg}</div>}
                  <div className="form-group">
                    <label>Select Image</label>
                    <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                  </div>
                  <div className="form-group">
                    <label>Caption (optional)</label>
                    <input type="text" value={imageCaption} onChange={(e) => setImageCaption(e.target.value)} placeholder="e.g., Computer Lab, Library" />
                  </div>
                  <button onClick={() => handleImageUpload(college.id)} className="btn-primary">Upload</button>
                </div>
              )}

              <Link to={`/colleges/${college.id}`} className="btn-secondary">View Details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageColleges;