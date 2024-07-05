import "./assets/css/style.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/home/Home";
import useStore from "./store/store";
import Loading from "./components/Loading";
import Signup from "./views/auth/Signup";
import Login from "./views/auth/Login";
import ForgetPassword from "./views/auth/ForgetPassword";
import ResetPassword from "./views/auth/ResetPassword";
import Activate from "./views/auth/Activate";
import Profile from "./views/user/Profile";
import Header from "./components/Header";
import ToastError from "./components/ToastError";
import ToastSuccess from "./components/ToastSuccess";
import ToastInfo from "./components/ToastInfo";
import Manage from "./views/user/Manage";
import ManageBooks from "./views/books/ManageBooks";
import { USER_TYPE } from "./utils/enums";
import Create from "./views/books/Create";
import Update from "./views/books/Update";
import Mine from "./views/home/Mine";
import Saved from "./views/home/Saved";
import ReviewAndRating from "./components/ReviewAndRating";
import Details from "./views/home/Details";
import Contact from "./views/home/Contact";
import Messages from "./views/books/Messages";
import Dashboard from "./views/books/Dashboard";

function App() {
  const {
    isLoading,
    user,
    token,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage,
    infoMessage,
    setInfoMessage,
  } = useStore((state) => state);
  return (
    <Router>
      {isLoading === true && <Loading />}
      <ToastError
        open={errorMessage?.length > 0}
        onClose={() => setErrorMessage("")}
        body={errorMessage}
      />
      <ToastSuccess
        open={successMessage?.length > 0}
        onClose={() => setSuccessMessage("")}
        body={successMessage}
      />
      <ToastInfo
        open={infoMessage?.length > 0}
        onClose={() => setInfoMessage("")}
        body={infoMessage}
      />
      <ReviewAndRating />
      <Header />
      <Routes>
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/fp" element={<ForgetPassword />} />
        <Route exact path="/rp" element={<ResetPassword />} />
        <Route exact path="/activate" element={<Activate />} />
        <Route
          exact
          path="/"
          element={
            !user || !token ? (
              <Login />
            ) : user?.type === USER_TYPE.USER ? (
              <Home />
            ) : (
              <Dashboard />
            )
          }
        />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/settings" element={<Manage />} />
        <Route exact path="/mine" element={<Mine />} />
        <Route exact path="/saved" element={<Saved />} />
        <Route exact path="/book/:id" element={<Details />} />
        <Route exact path="/contact" element={<Contact />} />
        {user?.type === USER_TYPE.ADMIN && (
          <>
            <Route exact path="/library" element={<Home />} />
            <Route exact path="/manage-books" element={<ManageBooks />} />
            <Route exact path="/create" element={<Create />} />
            <Route exact path="/edit/:id" element={<Update />} />
            <Route exact path="/messages" element={<Messages />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
