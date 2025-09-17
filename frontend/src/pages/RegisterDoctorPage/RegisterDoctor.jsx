import MyNavbar from "../../components/Navbar/MyNavbar.jsx";
import DoctorFeatures from "../../components/DoctorFeatures/DoctorFeatures.jsx";
import SignInDoc1 from "../../components/SignInDoc1/SignInDoc1.jsx";

import "./RegisterDoctor.css";

export default function RegisterDoctor() {
  return (
    <>
      <div className="container">
        <MyNavbar variant={"minimal"} type={"light"} />
      </div>
      <div className="container-fluid">
        <div className="row">
          <SignInDoc1 />
          <DoctorFeatures />
        </div>
      </div>
    </>
  );
}
