const ProfileSteps = (props) => {
    return (
      <div className="profile-steps">
          <ul>
              <li className={props.steps==0?"active":"done"}>
                <span>
                  <img src="/images/tick.svg" />
                </span>
                <label>Basics Detail</label>
              </li>
              <li className={props.steps==1?"active":props.steps==2?"done":""}>
                <span>
                  <img src="/images/tick.svg" />
                </span>
                <label>Documents</label>
              </li>
              <li className={props.steps==2?"active":""}>
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
  