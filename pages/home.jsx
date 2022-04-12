// import withAuth from "../utils/withAuth";
import Hotels from "./hotels";
import nextCookie from "next-cookies";
import { fetchgetServerSidePropsWithAuth } from "../utils/apiHelper";

const PAGE_STEPS = {
  LOADING: "loading",
  LOADED: "loaded",
  FAILED: "failed",
  DEFAULT: "default",
};

const Home = (props) => {
  return <Hotels {...props} />;
};

export const getServerSideProps = async (context) => {
  const { search } = context.query;

  if (!search) {
    return {
      props: {
        isLoggedIn: true,
        hotel_data: [],
        query_data: {},
        error: "",
        page: PAGE_STEPS.DEFAULT,
      },
    };
  }

  const query_data = JSON.parse(search);
  const { token } = nextCookie(context);

  if (!token) {
    return {
      props: {
        isLoggedIn: false,
        hotel_data: [],
        query_data: query_data,
        error: "",
        page: PAGE_STEPS.DEFAULT,
      },
    };
  }

  const payload = {
    ...query_data,
    ...query_data["hotels"],
  };

  try {
    const data = await fetchgetServerSidePropsWithAuth(
      `${process.env.global_url}/api/agent/hotel/search`,
      "POST",
      null,
      null,
      JSON.stringify(payload),
      context
    );

    if (data.error || data.Error) {
      return {
        props: {
          isLoggedIn: true,
          hotel_data: [],
          query_data: query_data,
          error: "Something went wrong",
          page: PAGE_STEPS.FAILED,
        },
      };
    }
    return {
      props: {
        isLoggedIn: true,
        hotel_data: data.response,
        query_data: query_data,
        error: "",
        page: PAGE_STEPS.LOADED,
      },
    };
  } catch (err) {
    console.error(`Error: ${JSON.stringify(err)}`);
    return {
      props: {
        isLoggedIn: true,
        hotel_data: [],
        query_data: query_data,
        error: JSON.stringify(err),
        page: PAGE_STEPS.FAILED,
      },
    };
  }
};

export default Home;
