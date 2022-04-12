import React from "react";
import {Spinner, Table} from 'react-bootstrap'
import { TableData } from "./data";
import className from './TransactionHistory.module.scss'
import moment from "moment";
import { useRouter } from "next/router";
export default function TransactionHistory(props) {
    const router = useRouter()
    return (
        <div style={{fontFamily:'Poppins',fontSize:'14px',color:'#264653'}}>  
            <Table responsive>
                <thead style={{backgroundColor:'rgba(0, 0, 0, 0.03)'}}>
                    <tr>
                        <th style={{borderTop:'none',borderBottom:'none'}}>Date</th>
                        <th style={{borderTop:'none',borderBottom:'none'}}>Amount</th>
                        <th style={{borderTop:'none',borderBottom:'none'}}>Updated Balance</th>
                        <th style={{borderTop:'none',borderBottom:'none'}}>Payment Mode</th>
                        <th style={{borderTop:'none',borderBottom:'none'}}>Status</th>
                        <th style={{borderTop:'none',borderBottom:'none'}}>Transaction Type</th>
                        <th style={{borderTop:'none',borderBottom:'none',maxWidth:'150px'}}>Remark</th>
                        <th style={{borderTop:'none',borderBottom:'none'}}>Action</th>
                    </tr>
                </thead>
                <tbody>  
                    {
                        props.loading 
                        ? 
                            (
                                <tr>
                                    <td colSpan={8} className="text-center mt-3">
                                        <Spinner animation="border" variant="primary"/> 
                                    </td>
                                </tr>
                            )
                        :
                        props?.data?.map((data,index)=>{
                            return (
                                <tr key={index}>
                                    <td><a style={{color:'#2A9D8F',fontFamily:'poppins'}} onClick={()=>{data.transaction_type === 'Offline' ? router.push(`/wallet/transaction-details?id=${data.id}&type=${data.transaction_type}&mode=${data.transaction_mode}`):''}}>{moment(data.transaction_date).format('ll')}</a></td>
                                    <td>{data.amount}</td>
                                    <td>{data.updated_balance?Number(data.updated_balance)?.toLocaleString('en-IN'):'--'}</td>
                                    <td>{data.transaction_mode?data.transaction_mode:'Deposit Account'}</td>
                                    <td>
                                        <div className="d-flex">
                                            <span className={'p-0 m-0 '+ (['Success','Corrected'].includes(data.status)?className.dotgreen:className.dotorange)}>
                                            </span>
                                            <span className={"flex-fill mx-1 p-0 m-0 "+className.top}>
                                                {data.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td>{data.transaction_type}</td>
                                    <td style={{maxWidth:'150px'}}>{data.corrected_amount?data?.remarks+', Corrected Amount Rs. '+data.corrected_amount: (data.remarks || '--')}</td>
                                    <td>
                                        {
                                            (data.transaction_type === "Offline" && data.status === 'Pending' )?<img src='/images/edit.png' style={{cursor:'pointer'}} onClick={()=>{router.push(`/wallet/home?tab=updateOffline&id=${data.id}`)}} />:''
                                        }
                                    </td>
                                </tr>
                            )
                        })
                    }  
                    {
                        props?.data?.length === 0 && (
                            <tr >
                                <td colSpan={8} className='text-center'>No record Found</td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        </div>
    )
} 