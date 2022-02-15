import Footer from "./Footer";
import Header from "./Header";
import AuthWrapper from "./auth/AuthWrapper";

const Layout: React.FC = ({ children }) => {
  return (
    <AuthWrapper>
      {/* <AuthWrapper> */}
      <Header />
      <main>{children}</main>
      <Footer />
      {/* </AuthWrapper> */}
    </AuthWrapper>
  );
};

export default Layout;
