import React, { useEffect, useState } from "react";
import { Table, Spin, Button, Modal, Select, DatePicker, message } from "antd";
import LayoutWrapper from "../../layouts/layoutWrapper";
import axios from "axios";

const { Option } = Select;

interface Student {
  student_id: number;
  firstname: string;
  lastname: string;
  email: string;
  countrycode: string;
  mobileno: string;
  college_name: string;
}

interface Course {
  id: number;
  name: string;
}

const UnassignedStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    fetch("http://13.233.33.133/api/student/getUnassignedStudentsList", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token || "",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setStudents(data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        setLoading(false);
      });

      fetchCourses()
  }, []);

    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, authentication required");
        return;
      }
      try {
        const response = await fetch(
          "http://13.233.33.133/api/course/getCourses",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          }
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data: Course[] = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };


  const openModal = (student: Student) => {
    setSelectedStudent(student);
    setModalVisible(true);
  };

  const formatDate = (date: Date | null): string | null => {
    return date ? date.toISOString().split("T")[0] : null;
  };

  const handleAssignCourse = async () => {
    if (!selectedStudent || !selectedCourse || !startDate || !endDate) {
      message.error("Please fill all fields.");
      return;
    }

    const payload = {
      studentId: selectedStudent.student_id,
      courseId: selectedCourse,
      startDate,
      endDate,
    };

    try {
      await axios.post(
        "http://13.233.33.133/api/student/assignStudentToCourse",
        payload,
        { headers: { token: token || "" } }
      );
      alert("Course assigned successfully!");
      setModalVisible(false);
      window.location.reload()
    } catch (error) {
      message.error("Error assigning course.");
      console.error("Error:", error);
    }
  };

  const columns = [
    {
      title: "Student Name",
      key: "studentName",
      render: (_: unknown, record: Student) =>
        `${record.firstname} ${record.lastname}`,
    },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Phone Number",
      key: "phoneNumber",
      render: (_: unknown, record: Student) =>
        `${record.countrycode} ${record.mobileno}`,
    },
    {
      title: "College Name",
      dataIndex: "college_name",
      key: "collegeName",
      render: (_: unknown, record: Student) => record.college_name || "",
    },
    {
      title: "Assign Course",
      key: "assignCourse",
      render: (_: unknown, record: Student) => (
        <Button type="primary" onClick={() => openModal(record)}>
          Assign Course
        </Button>
      ),
    },
  ];

  return (
    <LayoutWrapper pageTitle="BORIGAM / Unassigned Students">
      <div className="enrolled-students-container" style={containerStyle}>
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
          Unassigned Students
        </div>
        {loading ? (
          <Spin size="large" style={spinnerStyle} />
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

      {/* Modal for Assigning Course */}
      <Modal
        title="Assign Course"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleAssignCourse}
        okText="Assign"
      >
        <p>
          <strong>Student:</strong> {selectedStudent?.firstname}{" "}
          {selectedStudent?.lastname}
        </p>
        {courses.length === 0 && <p>No courses available</p>}{" "}
        {/* Debugging message */}
        <Select
          placeholder="Select Course"
          style={{ width: "100%" }}
          onChange={(value) => setSelectedCourse(value)}
        >
          {courses.map((course) => (
            <Option key={course.id} value={course.id}>
              {course.name}
            </Option>
          ))}
        </Select>
        <DatePicker
          style={{ width: "100%", marginTop: 10 }}
          placeholder="Start Date"
          onChange={(date) => setStartDate(formatDate(date?.toDate() || null))}
        />
        <DatePicker
          style={{ width: "100%", marginTop: 10 }}
          placeholder="End Date"
          onChange={(date) => setEndDate(formatDate(date?.toDate() || null))}
        />
      </Modal>
    </LayoutWrapper>
  );
};

export default UnassignedStudents;

// Styles
const containerStyle = {
  borderRadius: "10px",
  overflow: "hidden",
  background: "#f0f0f0",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  padding: "10px",
};

const spinnerStyle = {
  display: "flex",
  justifyContent: "center",
  padding: "20px",
};
