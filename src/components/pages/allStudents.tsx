import React, { useEffect, useState } from "react";
import { Table, Spin } from "antd";
import LayoutWrapper from "../../layouts/layoutWrapper";

// Define TypeScript interface for Student
interface Student {
  student_id: number;
  firstname: string;
  lastname: string;
  email: string;
  countrycode: string;
  mobileno: string;
  college_name: string;
}

const AllStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch student data from API
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3001/api/student/getAllStudents", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token") || "",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setStudents(data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        setLoading(false);
      });
  }, []);

  // Define table columns
  const columns = [
    {
      title: "Student Name",
      key: "studentName",
      render: (_: unknown, record: Student) => `${record.firstname} ${record.lastname}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      key: "phoneNumber",
      render: (_: unknown, record: Student) => `${record.countrycode} ${record.mobileno}`,
    },
    {
      title: "College Name",
      dataIndex: "college_name",
      key: "collegeName",
    },
  ];

  return (
    <LayoutWrapper pageTitle="BORIGAM / All Students ">
      <div
        className="enrolled-students-container"
        style={{
          borderRadius: "10px",
          overflow: "hidden",
          background: "#f0f0f0",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          padding: "10px",
        }}
      >
        <div
          className="header"
          style={{
            backgroundColor: "gold",
            color: "black",
            fontSize: "18px",
            fontWeight: "bold",
            padding: "10px",
            textAlign: "center",
          }}
        >
          All Students
        </div>
        {loading ? (
          <Spin
            size="large"
            className="loading-spinner"
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "20px",
            }}
          />
        ) : (
          <Table
            dataSource={students}
            columns={columns}
            rowKey="student_id"
            bordered
            pagination={{ pageSize: 5 }}
          />
        )}
      </div>
    </LayoutWrapper>
  );
};

export default AllStudents;
