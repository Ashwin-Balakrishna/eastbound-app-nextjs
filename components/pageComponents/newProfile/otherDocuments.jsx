import Form from 'react-bootstrap/Form'

const OtherDocuments = () => {
  return (
    <div className="profile-card-wrapper">
      <div className="profile-overview-top">
        <div className="profile-overview-heading">
          <img src="/images/profile-status.png" />
          <h4>Other documents</h4>
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
        {/* IATA wrapper */}
        <div className="doc-wrapper">
          <div className="form-question">
            <Form.Group className="other-modes">
              <Form.Label>Guarantee mode</Form.Label>
              <Form.Check
                inline
                label="No guarantee"
                name="group1"
                type="radio"
                id="inline-radio1"
              />
              <Form.Check
                inline
                label="Bank guarantee"
                name="group1"
                type="radio"
                id="inline-radio2"
              />
              <Form.Check
                inline
                label="Post dated cheque"
                name="group1"
                type="radio"
                id="inline-radio3"
              />
            </Form.Group>
          </div>
          <div className="profile-form mb-20">
            <div className="upload-wrapper h-120">
              <img src="/images/upload.png" />
              <h5>Upload documents</h5>
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
          <Form.Group>
            <Form.Label>Accreditation</Form.Label>
            <select class="form-select">
              <option selected>Select accreditation</option>
              <option value="1">Electricity Bill</option>
              <option value="2">Water Bill</option>
            </select>
          </Form.Group>
        </div>
      </div>
      <div className="profile-action-button">
        <div>
          <button class="btn btn__outline">Previous Step</button>
        </div>
        <div>
          <button class="btn btn__primary" type="submit">Submit KYC</button>
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

export default OtherDocuments;
