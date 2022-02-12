import "../styles/globals.css";
import Layout from "../components/Layout";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../state";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
