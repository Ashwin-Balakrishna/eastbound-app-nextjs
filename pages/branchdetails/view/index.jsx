import React from "react";
import PageLayout from "../../../components/layouts/pageLayout";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Container } from "react-bootstrap";

import {useRouter} from "next/router";

import AddBranch from "../../../components/pageComponents/branch/addBranchForm";
import BaseLayout from '../../../components/layouts/baseLayout';
const index = () => {
  const router=useRouter()
  return (
    <>
      <PageLayout title="2hub | View Branch">
        <BaseLayout title="2hub | View Branch">
        <div className="pageLayout">
          <Container>
            <br />
            <br />
            <div className="breadcrumb-wrapper">
              <Breadcrumb>
                <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
                

                <Breadcrumb.Item active>View Branch</Breadcrumb.Item>
              </Breadcrumb>
            </div>

            <section className="addbranch__titlebranch">
              <div className="d-flex ">
                  <div style={{width:"78%"}}><h5>View Branch</h5></div>

                  <div  onClick={()=>{router.push(`/branchdetails`)}}><button style={{background:"none"}}>Back</button></div>
              </div>
            </section>
            <section className="mt-2 d-flex justify-content-center">
              {/* AddBranchForm */}
              <AddBranch operation='view'/>
            </section>
          </Container>
          </div>
          </BaseLayout>
      </PageLayout>
    </>
  );
};

export default index;
