import Footer from "./Footer";
import Header from "./Header";
import { HeaderProvider } from "./Header/context";

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <HeaderProvider>
        <Header />
      </HeaderProvider>
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
