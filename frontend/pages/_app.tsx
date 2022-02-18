import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../app/store";
import { BrowserRouter as Router, HashRouter } from "react-router-dom";
import { ReactNode } from "react";

const Protecter: React.FC = ({ children }) => {
  return (
    <div suppressHydrationWarning>
      {typeof window === "undefined" ? null : children}
    </div>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Protecter>
      <Provider store={store}>
        <HashRouter>
          {typeof window === "undefined" ? null : <Component {...pageProps} />}
        </HashRouter>
      </Provider>
    </Protecter>
  );
}

export default MyApp;
