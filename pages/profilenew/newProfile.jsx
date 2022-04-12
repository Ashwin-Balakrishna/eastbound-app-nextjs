import PageLayout from "../../components/layouts/pageLayout";
import Footer from "../../components/pageComponents/footer/footer";
import ProfileSteps from "../../components/pageComponents/newProfile/steps";
import ProfileBasic from "../../components/pageComponents/newProfile/profileBasic";
import ProfileDocuments from "../../components/pageComponents/newProfile/documents";
import OtherDocuments from "../../components/pageComponents/newProfile/otherDocuments";

const HotelInfo = () => {
  return (
    <PageLayout title="2hub | Hotels">
      <div className="profile_container">
        <ProfileSteps/>
        <ProfileBasic/>
        <ProfileDocuments/>
        <OtherDocuments/>
      </div> 
      <Footer id="footer" />
    </PageLayout>
  );
};

export default HotelInfo;
