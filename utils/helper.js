import Cookies from "js-cookie";
import Router from "next/router";
import * as countriesJson from "../public/json/output.json";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
export const getCountryList = () => {
  return countriesJson.countries.map((country) => country.country);
};

export const getStateList = (country) => {
  const filteredCountry = countriesJson.countries.filter(
    (c) => c.country.toLowerCase() === (country ? country.toLowerCase() : "")
  );
  return filteredCountry.length > 0 ? filteredCountry[0].states : [];
};

export const getCountriesOptions = () => {
  return getCountryList().map((country) => {
    return { value: country, label: country };
  });
};

export const getStatesOptions = (country) => {
  return getStateList(country).map((state) => {
    return { value: state.state_code, label: state.state };
  });
};

export const getSessionToken = () => {
  const token = Cookies.get("token");
  return token || "";
};

export const getProfileStatus = () => {
  const status = Cookies.get("profileStatus");
  return status || "";
};

export const ifIsManuallyAdded = () => {
  const isManuallyAdded = Cookies.get("isManuallyAdded");
  return isManuallyAdded || "";
};

export const getLoggedInUser = () => {
  const user = Cookies.get("firstName");
  return user || "";
};

export const getLoggedInUserEmail = () => {
  const user = Cookies.get("email");
  return user || "";
};

export const getRejectReason = () => {
  const user = Cookies.get("rejectReason");
  return user || "";
};

export const reloadPage = () => {
  Router.reload();
};

export const reloadPageWithUrl = (url) => {
  window.location.href = url;
};

export const clearStorage = () => {
  Cookies.remove("token");
  Cookies.remove("email");
  Cookies.remove("firstName");
  Cookies.remove("profileStatus");
  Cookies.remove("rejectReason");
  Cookies.remove("isManuallyAdded");
  Cookies.remove("logo");
  Cookies.remove("user_type");
  Cookies.remove("role");
  Cookies.remove("accesses");
  localStorage.removeItem("email");
  localStorage.removeItem("firstName");
  localStorage.removeItem("profileStatus");
  localStorage.removeItem("rejectReason");
  localStorage.removeItem("isManuallyAdded");
};

export const authenticateUser = (
  token,
  email,
  firstName,
  status,
  rejectReason,
  isManuallyAdded
) => {
  clearStorage();
  Cookies.set("token", token, { expires: 30 });
  Cookies.set("email", email, { expires: 30 });
  Cookies.set("firstName", firstName, { expires: 30 });
  Cookies.set("profileStatus", status, { expires: 30 });
  Cookies.set("rejectReason", rejectReason, { expires: 30 });
  Cookies.set("isManualyAdded", isManuallyAdded, { expires: 30 });
  localStorage.setItem("email", email);
  localStorage.setItem("firstName", firstName);
  localStorage.setItem("profileStatus", status);
  localStorage.setItem("rejectReason", rejectReason);
  localStorage.setItem("isManuallyAdded", isManuallyAdded);
};

export const logout = () => {
  clearStorage();
  reloadPageWithUrl("/");
};

export const scrollPageTo = (id, offset) => {
  const element = document.getElementById(id);
  const pos = element.offsetTop;

  const params = {
    top: pos + offset,
    left: 0,
    behavior: "smooth",
  };

  window.scrollTo(params);
};

/**
 * @desc Convert a number to currency
 * @param  {number} number
 * @param  {string} locale="en-IN"
 * @param  {string} currency="INR"
 * @param  {boolean} showCurrency=true
 * @param  {number} maximumFractionDigits=2
 * @return  {string} currency string
 */
export const getCurrency = (
  number,
  {
    locale = "en-IN",
    currency = "INR",
    showCurrency = true,
    maximumFractionDigits = 2,
  } = {}
) => {
  return new Intl.NumberFormat(locale, {
    style: showCurrency ? "currency" : undefined,
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: maximumFractionDigits,
  }).format(number);
};

export const flickityCellHeight100Per = (flickityRef) => {
  flickityRef.on("ready", () => {
    flickityRef.cells.forEach((cell) => (cell.element.style.height = "100%"));
  });
};

export const capitalizeText = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const removeHTMLTags = (string) => {
  if (!string) return false;

  return string.toString().replace(/(<([^>]+)>)/gi, "");
};

export const liToArray = (string) => {
  const splitedString = string.split("</li>");

  return splitedString
    .map((str) => removeHTMLTags(str))
    .filter((e) => {
      if (e) return e;
    });
};

export const maskMobile = (data) => {
  let mobile = data.toString();
  let result = '+' + mobile.slice(0, 2) + '-' + 'xxxxx' + mobile.slice(mobile.length - 3);
  return result;
}

export const maskEmail = (data) => {
  let email = data.toString();
  var breakEmail = email.indexOf('@');

  if (breakEmail > 2) {
    return 'x' + 'x' + 'x...' + email.slice(breakEmail - 3, breakEmail) + '@' + email.slice(breakEmail + 1, email.length)
  }
  else {
    var breakEmail = email.indexOf('@');
    // console.log("free", breakEmail)
    if (breakEmail > 2) {
      return 'x' + 'x' + email.charAt(0) + email.charAt(1) + email.charAt(2) + '@' + email.slice(breakEmail + 1, email.length)
    }
    else {
      return email.charAt(0) + 'x' + '@' + email.slice(breakEmail + 1, email.length)
    }
  }
}

export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const replaceImageUrls = (array, value) => {

  return array.images.map((images, index) => {
    return images.replace('http://photos.hotelbeds.com/giata/', 'http://photos.hotelbeds.com/giata/' + value)
  })

}

export const setLogo = (logo) => {
  Cookies.set('logo', logo, { expires: 30 })
}

export const setUserType = (type) => {
  Cookies.set('user_type', type, { expires: 30 })
}

export const setRole = (role) => {
  Cookies.set('role', role, { expires: 30 })
}

export const setAccess = (access) => {
  
  Cookies.set('accesses', JSON.stringify(access), { expires: 30 })
  // console.log('accesss',JSON.parse(Cookies.get('accesses')))
}

export const getUrlParameter = (name) => { 
  if (typeof window !== "undefined") {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  let results = regex.exec(window.location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
};



// eslint-disable-next-line no-undef
export const API_URL = process.env.global_url;
export const NODE_API_URL = process.env.customNodeUrl;
export const ADMIN_API_URL = process.env.customAdminUrl;
export const CUSTOM_API_URL = process.env.customUrl;
// eslint-disable-next-line no-undef
export const IMAGE_URL = process.env.cdn_url;
export const S3_URL = process.env.customS3Url;
