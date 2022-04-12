import React from 'react'
import Styles from './usermanagement.module.scss'
import { Row, Col } from 'react-bootstrap';

const index = () => {
  return (
    <>
      <div className={`${Styles.middle}`}>
      
        <Row>
          <Col>
            <div className='align-self-center d-flex justify-content-center' style={{width:"100%", height:"90vh"}}>
              Col 1
            </div>
          </Col>
          <Col>
            Col 2
            
          </Col>
        </Row>
    </div>
    </>
  )
}

export default index