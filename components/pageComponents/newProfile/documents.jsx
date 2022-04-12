import Form from 'react-bootstrap/Form'

const ProfileDocuments = () => {
  return (
    <div className="profile-card-wrapper">
      <div className="profile-overview-top">
        <div className="profile-overview-heading">
          <img src="/images/profile-status.png" />
          <h4>Documents</h4>
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
        {/* pan wrapper */}
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
        {/* IATA wrapper */}
        <div className="doc-wrapper">
          <div className="form-question">
            <Form.Group>
              <Form.Label>Are your registered with IATA?</Form.Label>
              <Form.Check
                inline
                label="Yes"
                name="group1"
                type="radio"
                id="inline-radio1"
              />
              <Form.Check
                inline
                label="No"
                name="group1"
                type="radio"
                id="inline-radio2"
              />
            </Form.Group>
          </div>
          <div className="profile-form">
            <Form.Group>
              <Form.Label>IATA code</Form.Label>
              <Form.Control type="text" placeholder="Enter IATA Code" />
            </Form.Group>
            <div className="upload-wrapper h-120">
              <img src="/images/upload.png" />
              <h5>Upload IATA</h5>
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
        {/* GST wrapper */}
        <div className="doc-wrapper">
          <div className="form-question">
            <Form.Group>
              <Form.Label>Are your registered for GST?</Form.Label>
              <Form.Check
                inline
                label="Yes"
                name="group1"
                type="radio"
                id="inline-radio1"
              />
              <Form.Check
                inline
                label="No"
                name="group1"
                type="radio"
                id="inline-radio2"
              />
            </Form.Group>
          </div>
          <div className="profile-form">
            <Form.Group>
              <Form.Label>Supporting documents</Form.Label>
              <select class="form-select">
                <option selected>Open this select menu</option>
                <option value="1">Electricity Bill</option>
                <option value="2">Water Bill</option>
              </select>
            </Form.Group>
            <div className="upload-wrapper h-120">
              <img src="/images/upload.png" />
              <h5>Upload Electric bill</h5>
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
      <div className="profile-action-button">
        <div>
          <button class="btn btn__outline">Previous Step</button>
        </div>
        <div>
          <button class="btn btn__primary" type="submit">Next Step</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDocuments;
