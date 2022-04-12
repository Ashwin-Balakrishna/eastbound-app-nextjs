import Form from 'react-bootstrap/Form'

const panDocuments = () => {
  return (
    
    <div className="profile-card-wrapper">
      <div className="profile-overview-top">
        <div className="profile-overview-heading">
          <img src="/images/profile-status.png" />
          <h4>PAN Details</h4>
        </div>
        <div className="profile-overview-action">
          <ul>
            <li>
              <img src="/images/edit.png" />
            </li>
            <li>
              <img src="/images/collapse.png" />
            </li>
          </ul>
        </div>
      </div>
      <div className="profile-overview-bottom">
        <div className="doc-wrapper">
          <div className="profile-form">
            <Form.Group>
              <Form.Label>PAN Number</Form.Label>
              <Form.Control type="text" placeholder="Enter your PAN number" />
            </Form.Group>
            <div className="upload-wrapper h-120">
              <img src="/images/upload.png" />
              <h5>Upload PAN card</h5>
              <span>Drag & drop pdf, jpg or png file here (Max size 5mb)</span>
            </div>
            {/* show upload data */}
            <div className="upload-show-wrapper">
              <div className="upload-show">
                <div className="upload-img-wraper">
                  <div className="upload-img">
                    <img src="/images/aadhar.png" />
                  </div>
                </div>
                <div className="upload-img-text">
                  <h3>Scanpdf20210823.pdf Scanpdf20210823.pdf</h3>
                  <span>1.3mb</span>
                  <div className="upload-show-action action-mobile">
                    <div className="btwn-btn">
                      <button class="btn btn__primary" type="submit">Change</button>
                      <button class="btn btn__outline">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="upload-show-action action-desktop">
                <div className="btwn-btn">
                  <button class="btn btn__primary" type="submit">Change</button>
                  <button class="btn btn__outline">Remove</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="profile-action-button justify-end">
        <div className="btwn-btn">
          <button class="btn btn__primary" type="submit">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default panDocuments;
