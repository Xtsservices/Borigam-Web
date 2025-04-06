import { useEffect, useState } from "react";
import { Card, Button, Typography, List, Tabs } from "antd";
import LayoutWrapper from "../layouts/layoutWrapper";

const { TabPane } = Tabs;

interface Course {
  id: number;
  name: string;
}

interface Option {
  id: number;
  is_correct: boolean;
  option_text: string;
}

interface Question {
  id: number;
  name: string;
  options: Option[];
}

interface Test {
  test_id: number;
  test_name: string;
  questions: Question[];
}

const Settings: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [tests, setTests] = useState<Test[]>([]);

  useEffect(() => {
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

    const fetchTests = async () => {
      try {
        const response = await fetch(
          "http://13.233.33.133/api/question/viewAllTests",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: localStorage.getItem("token") || "",
            },
          }
        );
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const { data }: { data: Test[] } = await response.json();
        setTests(data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
    };

    fetchCourses();
    fetchTests();
  }, []);

  const renderTests = (filteredTests: Test[]) =>
    filteredTests.map((test) => (
      <div key={test.test_id} style={{ marginBottom: "20px" }}>
        <Typography.Title level={5}>{test.test_name}</Typography.Title>
        <List
          bordered
          dataSource={test.questions}
          renderItem={(question) => (
            <List.Item>
              <div>
                <Typography.Text strong>{question.name}</Typography.Text>
                {question.options.length > 0 && (
                  <List
                    size="small"
                    dataSource={question.options}
                    renderItem={(option) => (
                      <List.Item>
                        {option.option_text}{" "}
                        {option.is_correct && <strong>(Correct Answer)</strong>}
                      </List.Item>
                    )}
                  />
                )}
              </div>
            </List.Item>
          )}
        />
      </div>
    ));

  return (
    <LayoutWrapper pageTitle="BORIGAM / Settings">
      <div
        className="settings"
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <Card
          style={{
            width: "49%",
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
            View Courses
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
            {courses.map((course) => (
              <Button
                key={course.id}
                style={{
                  width: "200px",
                  height: "100px",
                  fontSize: "22px",
                  padding: "0",
                }}
              >
                {course.name}
              </Button>
            ))}
          </div>
        </Card>

        <Card
          style={{
            width: "49%",
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
            Question & Answers
          </Button>
          <Tabs defaultActiveKey="1">
            <TabPane tab="All Tests" key="1">
              {renderTests(tests)}
            </TabPane>
            <TabPane tab="Mock Test" key="2">
              {renderTests(
                tests.filter((test) => test.test_name === "Mock Test")
              )}
            </TabPane>
            <TabPane tab="Regular Test" key="3">
              {renderTests(
                tests.filter((test) => test.test_name === "Regular Test")
              )}
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </LayoutWrapper>
  );
};

export default Settings;
