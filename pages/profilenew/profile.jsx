import PageLayout from "../../components/layouts/pageLayout";
import Footer from "../../components/pageComponents/footer/footer";
import ProfileBasic from "../../components/pageComponents/newProfile/profileBasic";
import PanDocuments from "../../components/pageComponents/newProfile/panDocuments";
import IATADocuments from "../../components/pageComponents/newProfile/iataDocuments";
import GSTDocuments from "../../components/pageComponents/newProfile/gstDocuments";
import OtherDocuments from "../../components/pageComponents/newProfile/otherDocuments";


const Profile = () => {
  return (
    <PageLayout title="2hub | Hotels">
      <div className="profile_container">
        {/* profile complete status */}
        <div className="profile-status-card">
          <div className="profile-status-text">
            <h4>Complete Surjith</h4>
            <p>
              Lorem ipsum dolor sti amte dolor sit
            </p>
          </div>
          <div className="profile-status-bar">

          </div>
        </div>
        <div className="manager-profile">
          <h2>2Hub Account Manager</h2>
          <div className="contacting_ways">
            <img src="/images/contact.png" alt="contact" />
            <label>Gulraze</label>
          </div>
          <div className="contacting_ways">
            <img src="/images/email.svg" alt="email" />
            <label>gulraze@2hub.co</label>
          </div>
          <div className="contacting_ways">
            <img src="/images/phone.svg" alt="phone" />
            <label>+91 9876543210</label>
          </div>
        </div>
        <ProfileBasic/>
        <PanDocuments/>
        <IATADocuments/>
        <GSTDocuments/>
        <OtherDocuments/>
      </div>
      <Footer id="footer" />
    </PageLayout>
  );
};

export default Profile;
