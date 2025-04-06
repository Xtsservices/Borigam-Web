import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Typography,
  Image,
  Modal,
  Input,
  Form,
  message,
} from "antd";
import LayoutWrapper from "../layouts/layoutWrapper";
import { useNavigate } from "react-router-dom";
import add_dashboard from "../assets/add_dashboard.png";

const { Title } = Typography;

// Define TypeScript Interface for Course
interface Course {
  id: number;
  name: string;
  status: string;
}

interface User {
  userId: number;
  firstname: string;
  lastname: string;
  email: string;
  countrycode: string;
  mobileno: string;
  status: number;
  role: string;
}

interface College {
  collegeId: number;
  collegeName: string;
  collegeAddress: string;
  collegeStatus: number;
  users: User[];
}

interface Students {
  mobileno: string;
  email: string;
  studentId: number;
  firstname: string;
  lastname: string;
  role: string;
  countrycode: string;
  status: number;
}

interface UnassignedStudents {
  count: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [, setCourses] = useState<Course[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [students, setStudents] = useState<Students[]>([]);
  const [unassignedStudents, setunassignedStudents] =
    useState<UnassignedStudents>({ count: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found, authentication required");
        return;
      }

      try {
        const response = await fetch(
          "http://13.233.33.133:3001/api/course/getCourses",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: Course[] = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchColleges();
    fetchCourses();
    fetchStudents();
    fetchUnassignedStudentsCount();
  }, []);

  const fetchColleges = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, authentication required");
      return;
    }

    try {
      const response = await fetch(
        "http://13.233.33.133:3001/api/college/viewAllCollegesAndUsers",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setColleges(result.data);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }
  };

  const fetchUnassignedStudentsCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, authentication required");
      return;
    }

    try {
      const response = await fetch(
        "http://13.233.33.133:3001/api/student/getUnassignedStudentsCount",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (result.data) {
        setunassignedStudents({ count: result.data.count });
      } else {
        console.error("Unexpected response format:", result);
      }
    } catch (error) {
      console.error("Error fetching unassigned students count:", error);
    }
  };

  const fetchStudents = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, authentication required");
      return;
    }
    try {
      const response = await fetch(
        "http://13.233.33.133:3001/api/student/getAllStudents",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Fetched Students:", result);
      setStudents(result.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleCollegeSubmit = async (values: any) => {
    try {
      const response = await fetch(
        "http://13.233.33.133:3001/api/college/registerCollege",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token") || "",
          },
          body: JSON.stringify(values),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to register college");
      }
      alert("College registered successfully!");
      setModalVisible(false);
      form.resetFields();
      window.location.reload();
    } catch (error) {
      console.error("Error registering college:", error);
      message.error("Failed to register college");
    }
  };

  const handleStudentSubmit = async (values: any) => {
    try {
      const response = await fetch(
        "http://13.233.33.133:3001/api/student/createStudent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token") || "",
          },
          body: JSON.stringify(values),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create student");
      }
      alert("Student created successfully!");
      setModalVisible1(false);
      form1.resetFields();
      window.location.reload();
    } catch (error) {
      console.error("Error creating student:", error);
      message.error("Failed to create student");
    }
  };

  const handleCollegeClick = () => {
    setModalVisible(true);
  };

  const handleStudentClick = () => {
    setModalVisible1(true);
  };

  const navigateToColleges = () => {
    navigate("/dashboard/CollageList");
  };

  const navigateToStudents = () => {
    navigate("/dashboard/AllStudents");
  };

  return (
    <LayoutWrapper pageTitle="BORIGAM">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <Card
          style={{
            width: "30%",
            borderRadius: "10px",
            borderColor: "#8B5EAB",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Button
            type="primary"
            style={{
              background: "#8B5EAB",
              borderColor: "#8B5EAB",
              width: "100%",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
            onClick={handleStudentClick}
          >
            Students +
          </Button>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <Button
              style={{ width: "180px", height: "80px", fontSize: "21px" }}
              onClick={navigateToStudents}
            >
              All Students : <span>{students.length}</span>
            </Button>
            <Button
              style={{ width: "180px", height: "80px", fontSize: "21px" }}
              onClick={() => navigate("/dashboard/unassigned")}
            >
              Unassigned : <span>{unassignedStudents.count}</span>
            </Button>
          </div>
        </Card>
        {/* Test Screen */}
        <Card
          style={{
            width: "30%",
            borderRadius: "10px",
            borderColor: "#8B5EAB",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Button
            type="primary"
            style={{
              background: "#8B5EAB",
              borderColor: "#8B5EAB",
              width: "100%",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            Tests
          </Button>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <Button
              style={{
                width: "180px",
                height: "80px",
                fontSize: "21px",
                padding: "0",
              }}
              onClick={() => navigate("/dashboard/OngoingTest")}
            >
              Ongoing : <span>10</span>
            </Button>
            <Button
              style={{
                width: "180px",
                height: "80px",
                fontSize: "21px",
                padding: "0",
              }}
              onClick={() => navigate("/dashboard/CompletedTest")}
            >
              Completed : <span>20</span>
            </Button>
            <Button
              style={{
                width: "180px",
                height: "80px",
                fontSize: "21px",
                padding: "0",
              }}
              onClick={() => navigate("/dashboard/VerifyTest")}
            >
              Verification : <span>30</span>
            </Button>
          </div>
        </Card>
        {/* Collages */}
        <Card
          style={{
            width: "30%",
            borderRadius: "10px",
            borderColor: "#8B5EAB",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Button
            type="primary"
            style={{
              background: "#8B5EAB",
              borderColor: "#8B5EAB",
              width: "100%",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
            onClick={handleCollegeClick}
          >
            Collages +
          </Button>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            <Button
              onClick={navigateToColleges}
              style={{ width: "180px", height: "80px", fontSize: "21px" }}
            >
              No of Collages : <span>{colleges.length}</span>
            </Button>
            <Button
              style={{ width: "180px", height: "80px", fontSize: "21px" }}
              onClick={() => navigate("/dashboard/CollageStudents")}
            >
              No of Students: <span>20</span>
            </Button>
          </div>
        </Card>
      </div>
      <Card
        style={{
          width: "100%",
          textAlign: "center",
          borderRadius: "10px",
          borderColor: "#8B5EAB",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: "10px",
        }}
      >
        <Image
          src={add_dashboard}
          alt="Dashboard Illustration"
          preview={false}
          style={{ height: "300px", width: "400px" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <Button
            type="primary"
            style={{
              background: "#FFD439",
              borderColor: "#FFD439",
              fontWeight: "bold",
              width: "200px",
            }}
            onClick={() => navigate("addtest")}
          >
            Add Test +
          </Button>

          <Button
            type="primary"
            style={{
              background: "#8B5EAB",
              borderColor: "#8B5EAB",
              fontWeight: "bold",
              width: "200px",
            }}
            onClick={() => navigate("addquestions")}
          >
            Add Questions +
          </Button>
        </div>
      </Card>
      <Modal
        title="Register College"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCollegeSubmit}>
          <Form.Item
            name="name"
            label="College Name"
            rules={[{ required: true, message: "Please enter college name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input />
          </Form.Item>
          <Title level={5}>Contact Information</Title>
          <Form.Item
            name={["contact", "firstname"]}
            label="First Name"
            rules={[{ required: true, message: "Enter first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["contact", "lastname"]}
            label="Last Name"
            rules={[{ required: true, message: "Enter last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["contact", "email"]}
            label="Email"
            rules={[
              { required: true, type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["contact", "countrycode"]}
            label="Country Code"
            initialValue="+91"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["contact", "mobileno"]}
            label="Mobile Number"
            rules={[{ required: true, message: "Enter mobile number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Register Student"
        open={modalVisible1}
        onCancel={() => setModalVisible1(false)}
        footer={null}
      >
        <Form form={form1} layout="vertical" onFinish={handleStudentSubmit}>
          <Form.Item
            name={["firstname"]}
            label="First Name"
            rules={[{ required: true, message: "Enter first name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={["lastname"]}
            label="Last Name"
            rules={[{ required: true, message: "Enter last name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={["email"]}
            label="Email"
            rules={[
              { required: true, type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={["countrycode"]}
            label="Country Code"
            initialValue="+91"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name={["mobileno"]}
            label="Mobile Number"
            rules={[{ required: true, message: "Enter mobile number" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </LayoutWrapper>
  );
};

export default Dashboard;
