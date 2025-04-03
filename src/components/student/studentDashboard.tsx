import React from "react";
import { Table, Button, Card, Row, Col } from "antd";
import StudentLayoutWrapper from "./layouts/studentlayoutWrapper";
import { useNavigate } from "react-router-dom";

type StudentData = {
  key: string;
  name: string;
  email: string;
  phone: string;
  courses: string;
  startDate: string;
  endDate: string;
};

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Enrolled Courses", dataIndex: "courses", key: "courses" },
    { title: "Start Date", dataIndex: "startDate", key: "startDate" },
    { title: "End Date", dataIndex: "endDate", key: "endDate" },
  ];

  const dataSource: StudentData[] = [
    {
      key: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      courses: "NIFT, CEED",
      startDate: "01 Jan 2024",
      endDate: "31 Dec 2024",
    },
  ];

  return (
    <StudentLayoutWrapper pageTitle={"BORIGAM / Student"}>
      <div
        style={{
          marginBottom: "20px",
        }}
      >
        {/* Welcome Card */}
        <Card
          style={{
            backgroundColor: "#FFD700",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontWeight: "bold", fontSize: "20px" }}>WELCOME</h2>
        </Card>

        <Row gutter={16}>
          <Col span={12}>
            <Card
              title="Student Details"
              bordered={false}
              headStyle={{ backgroundColor: "#FFD700", fontWeight: "bold" }}
            >
              <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                style={{ overflowX: "auto" }}
              />
            </Card>
          </Col>

          <Col span={12}>
            <Card
              title="Student Tests"
              bordered={false}
              headStyle={{ backgroundColor: "#FFD700", fontWeight: "bold" }}
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Button type="primary" block style={{ marginBottom: "10px" }}>
                    All Tests (10)
                  </Button>
                </Col>
                <Col span={12}>
                  <Button type="primary" block style={{ marginBottom: "10px" }}>
                    Completed Tests (6)
                  </Button>
                </Col>
                <Col span={12}>
                  <Button type="primary" block style={{ marginBottom: "10px" }}>
                    Ongoing Tests (3)
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    type="primary"
                    block
                    style={{ marginBottom: "10px" }}
                    onClick={() => navigate("/student/TestScreen")}
                  >
                    New Test (1)
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </StudentLayoutWrapper>
  );
};

export default StudentDashboard;
