import "../styles/globals.css";
import Layout from "../components/layout/Layout";
import { UserContext } from "../utils/context";
import { useUserData } from "../utils/hooks";

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContext.Provider>
  );
}

export default MyApp;
