import fetch from "isomorphic-fetch";
import Cookies from "js-cookie";
import nextCookie from "next-cookies";

import {Router, useRouter} from 'next/router';
import  { getSessionToken, API_URL } from "./helper";

const authUser = "auth_test@byond.travel:12345";



export const fetchDataWithAuth = async (
  url,
  method,
  query,
  header,
  payload,
  token
) => {
  let fetchUrl = url;
  fetchUrl += query ? `?${query}` : "";
  const options = {
    method: method,
    headers: {
      ...header,
      Authorization: `Token ${token || getSessionToken()}`,
    },
    body: payload ? JSON.stringify(payload) : null,
  };

  try {
    const response = await fetch(fetchUrl, options);

    return await response.json();
  } catch (err) {
    console.error(`Fetch Error: ${JSON.stringify(err)}`);
    return { error: "Something went worng" };
  }
};

export const fetchgetServerSidePropsWithAuth = async (

  url,
  method,
  query,
  header,
  formData,
  context
) => {



  let fetchUrl = url;
  fetchUrl += query ? `?${query}` : "";
    
  const { token } = nextCookie(context);
  
  try {
    const response = await fetch(fetchUrl, {
      method: method,
      headers: { ...header, Authorization: `Token ${token}` },
      body: formData,
    });
    return await response.json();
  } catch (err) {
    console.error(JSON.stringify(err));
    return { error: "Something went worng" };
  }
};

export const fetchFormDataWithAuth = async (
  url,
  method,
  query,
  header,
  formData,
  signal
) => {

 
  let fetchUrl = url;
  fetchUrl += query ? `?${query}` : "";
  try {
    const response = await fetch(fetchUrl, {
      method: method,
      headers: { ...header, Authorization: `Token ${getSessionToken()}` },
      body: formData,
      signal: signal,
    });
    if(response.status<200 || response.status>300){
      throw(response.statusText)
    }

    return await response.json();
  } catch (err) {
    
    console.error(JSON.stringify(err));
    // window.location.replace("/login");
    return { error: "Something went wrong!"  };
  }
};

export const fetchDataWithoutToken = async (url, method, query, payload) => {
  let fetchUrl = url;
  fetchUrl += query ? `?${query}` : "";

  try {
    const response = await fetch(fetchUrl, {
      method: method,
      body: payload ? JSON.stringify(payload) : null,
    });

    return await response.json();
  } catch (err) {
    console.error(JSON.stringify(err));
    return { error: "Something went worng" };
  }
};

export const fetchDataWithoutAuth = async (
  url,
  method,
  query,
  header,
  payload,
  auth
) => {
  let fetchUrl = url;
  fetchUrl += query ? `?${query}` : "";

  try {
    const response = await fetch(fetchUrl, {
      method: method,
      headers: {
        ...header,
        Authorization: auth || `Basic ${btoa(authUser)}`,
      },
      body: payload ? JSON.stringify(payload) : null,
    });

    return await response.json();
  } catch (err) {
    console.error(JSON.stringify(err));
    return { error: "Something went wrong!" };
  }
};

export const fetchFormDataWithoutAuth = async (
  url,
  method,
  query,
  header,
  formData
) => {
  let fetchUrl = url;
  fetchUrl += query ? `?${query}` : "";

  try {
    const response = await fetch(fetchUrl, {
      method: method,
      headers: {
        ...header,
        // Authorization: `Basic ${btoa(authUser)}`,
        Authorization: `Token ${getSessionToken()}`,
      },
      body: formData,
    });

    return await response.json();
  } catch (err) {
    console.error(JSON.stringify(err));
    return { error: "Something went wrong!" };
  }
};

export const fetchBlobWithAuth = async (
  url,
  method,
  query,
  header,
  payload,
  token
) => {
  let fetchUrl = url;
  fetchUrl += query ? `?${query}` : "";

  const options = {
    method: method,
    headers: {
      ...header,
      Authorization: `Token ${token || getSessionToken()}`,
    },
    body: payload ? JSON.stringify(payload) : null,
  };

  try {
    const response = await fetch(fetchUrl, options);

    return await response.blob();
  } catch (err) {
    console.error(`Fetch Error: ${JSON.stringify(err)}`);
    return { error: "Something went wrong!" };
  }
};

export const getBookingFile = (id, type) => {

  return fetch(`${API_URL}/api/agent/bookings/fetch_document/${id}/${type}/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Token ${getSessionToken()}`,
    },
  });
};