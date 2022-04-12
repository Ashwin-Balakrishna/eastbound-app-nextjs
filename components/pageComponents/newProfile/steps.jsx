const ProfileSteps = () => {
  return (
    <div className="profile-steps">
        <ul>
            <li className="done">
              <span>
                <img src="/images/tick.svg" />
              </span>
              <label>Basics Detail</label>
            </li>
            <li className="active">
              <span>
                <img src="/images/tick.svg" />
              </span>
              <label>Documents</label>
            </li>
            <li>
              <span>
                <img src="/images/tick.svg" />
              </span>
              <label>Others</label>
            </li>
        </ul>
    </div>
  );
};

export default ProfileSteps;
