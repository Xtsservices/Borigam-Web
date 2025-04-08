import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpForm from "./components/signup.tsx";
import Login from "./components/login.tsx";
import ForgotPassword from "./components/forgotPassword.tsx";
import Dashboard from "./components/dashboard.tsx";
import ViewCourse from "./components/viewCourse.tsx";
import AddQuestions from "./components/addQuestion.tsx";
import AddTest from "./components/addTest.tsx";
import StudentDashoard from "./components/student/studentDashboard.tsx";
import AllStudents from "./components/pages/allStudents.tsx";
import CollageList from "./components/pages/noOfCollages.tsx";
import OngoingTest from "./components/pages/onGoingTests.tsx";
import VerifyTest from "./components/pages/verifyTests.tsx";
import CollageStudents from "./components/pages/noOfStudentsCollages.tsx";
import UnassignedStudents from "./components/pages/unassignedStudents.tsx";
import CompletedTest from "./components/pages/completedTest.tsx";
import TestScreen from "./components/student/pages/newtest.tsx";
import StudentCompletedTest from "./components/student/pages/completedTests.tsx";
import StudyMaterial from "./components/studyMaterial.tsx";
import ErrorHandling from "./components/settingsErrorBoundry.tsx";
import CollegeDashboard from "./components/college/collegeDashboard.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/settingscreen" element={<ErrorHandling/>} />
        <Route path="/study-material" element={<StudyMaterial />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/Addquestions" element={<AddQuestions />} />
        <Route path="/dashboard/Addtest" element={<AddTest />} />
        <Route path="/view-course/:courseId" element={<ViewCourse />} />

        {/* Dashboard Pages */}

        <Route path="/dashboard/AllStudents" element={<AllStudents />} />
        <Route path="/dashboard/CollageList" element={<CollageList />} />
        <Route path="/dashboard/OngoingTest" element={<OngoingTest />} />
        <Route path="/dashboard/VerifyTest" element={<VerifyTest />} />
        <Route path="/dashboard/CollageStudents" element={<CollageStudents />} />
        <Route path="/dashboard/unassigned" element={<UnassignedStudents />} />
        <Route path="/dashboard/CompletedTest" element={<CompletedTest />} />

        {/* Student */}

        <Route path="/student/dashboard" element={<StudentDashoard />} />
        <Route path="/student/TestScreen" element={<TestScreen />} />
        <Route path="/student/CompletedTest" element={<StudentCompletedTest />} />

        {/* Collage */}

        <Route path="/college/dashboard" element={<CollegeDashboard />} />

      </Routes>
    </Router>
  );
};

export default App;
