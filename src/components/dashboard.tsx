import { Card, Button, Typography } from "antd";
import LayoutWrapper from "../layouts/layoutWrapper";
import { useNavigate } from "react-router-dom";
import { courses } from "./types/course";

const { Title } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <LayoutWrapper pageTitle="BORIGAM">
      {/* Welcome Card */}
      <Card
        style={{
          width: "90%",
          textAlign: "center",
          background: "#FFD439",
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "20px",
          borderRadius: "8px",
        }}
      >
        WELCOME
      </Card>

      {/* Rest of your dashboard content */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "20px",
          justifyContent: "center",
          width: "90%",
        }}
      >
        {/* Courses Section */}
        <Card
          style={{
            width: "300px",
            borderRadius: "10px",
            borderColor: "#8B5EAB",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Title level={5} style={{ marginBottom: "16px" }}>
            Courses:
          </Title>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            {courses.map((course) => (
              <Button
                key={course.id}
                style={{
                  width: "80px",
                  height: "32px",
                  fontSize: "12px",
                  padding: "0",
                }}
                onClick={() => navigate(`/view-course/${course.id}`)}
              >
                {course.name}
              </Button>
            ))}
          </div>
          <Button
            type="primary"
            style={{
              background: "#8B5EAB",
              borderColor: "#8B5EAB",
              width: "100%",
              fontWeight: "bold",
            }}
          >
            All Courses
          </Button>
        </Card>

        {/* Students Section */}
        <Card
          style={{
            width: "300px",
            borderRadius: "10px",
            borderColor: "#8B5EAB",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Title level={5} style={{ marginBottom: "16px" }}>
            Students:
          </Title>
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
              style={{ width: "120px", height: "32px", fontSize: "12px" }}
            >
              Total 50
            </Button>
            <Button
              style={{ width: "120px", height: "32px", fontSize: "12px" }}
            >
              Active 40
            </Button>
            <Button
              style={{ width: "120px", height: "32px", fontSize: "12px" }}
            >
              Pending 5
            </Button>
            <Button
              style={{ width: "120px", height: "32px", fontSize: "12px" }}
            >
              Inactive 5
            </Button>
          </div>
          <Button
            type="primary"
            style={{
              background: "#8B5EAB",
              borderColor: "#8B5EAB",
              width: "100%",
              fontWeight: "bold",
            }}
          >
            All Students List
          </Button>
        </Card>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          width: "90%",
          marginBottom: "20px",
        }}
      >
        <Button
          type="primary"
          style={{
            background: "#FFD439",
            borderColor: "#FFD439",
            width: "200px",
            height: "40px",
            fontWeight: "bold",
          }}
        >
          ADD COURSES
        </Button>
        <Button
          type="primary"
          style={{
            background: "#8B5EAB",
            borderColor: "#8B5EAB",
            width: "200px",
            height: "40px",
            fontWeight: "bold",
          }}
        >
          ADD QUESTIONS
        </Button>
      </div>
    </LayoutWrapper>
  );
};

export default Dashboard;
