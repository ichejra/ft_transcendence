import Footer from "./Footer";
import Header from "./Header";
import { Provider } from "react-redux";
import { store } from "../state";

const Layout: React.FC = ({ children }) => {
  return (
    <Provider store={store}>
      <Header />
      <main>{children}</main>
      <Footer />
    </Provider>
  );
};

export default Layout;
