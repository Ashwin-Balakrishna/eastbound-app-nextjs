import Form from 'react-bootstrap/Form'

const ProfileBasic = () => {
  return (
    <div className="profile-card-wrapper">
      <div className="profile-overview-top">
        <div className="profile-overview-heading">
          <img src="/images/profile-status.png" />
          <h4>Basic</h4>
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
        <div className="profile-form">
          <div className="profile-divider">
            <div className="width-60">
              <Form.Group>
                <Form.Label>Agency name</Form.Label>
                <Form.Control type="text" placeholder="Enter agency name" />
              </Form.Group>
              <Form.Group>
                <Form.Label>Phone number</Form.Label>
                <Form.Control type="text" placeholder="Enter your mobile number" />
              </Form.Group>
            </div>
            <div className="width-32">
              <div className="upload-wrapper">
                <img src="/images/upload.png" />
                <h5>Upload Agent Logo</h5>
                <span>(Max size 5mb)</span>
              </div>
            </div>
          </div>
          <Form.Group>
            <Form.Label>Agency address</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Enter your agency address" />
          </Form.Group>
          <div className="profile-divider">
            <div className="width-48">
              <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control type="text" placeholder="Enter City" />
              </Form.Group>
            </div>
            <div className="width-48">
              <Form.Group>
                <Form.Label>Pincode</Form.Label>
                <Form.Control type="text" placeholder="Enter your pincode" />
              </Form.Group>
            </div>
          </div>
          <div className="profile-divider">
            <div className="width-48">
              <Form.Group>
                <Form.Label>Years in Business</Form.Label>
                <Form.Control type="text" placeholder="Enter Year of business" />
              </Form.Group>
            </div>
          </div>
        </div>
      </div>
      <div className="profile-action-button justify-end">
        <div className="btwn-btn">
          <button class="btn btn__link">I’ll do it later</button>
          <button class="btn btn__primary" type="submit">Next Step</button>
        </div>
      </div>
      <div className="profile-action-button justify-end">
        <div className="btwn-btn">
          <button class="btn btn__link">Discard Changes</button>
          <button class="btn btn__primary" type="submit">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileBasic;
