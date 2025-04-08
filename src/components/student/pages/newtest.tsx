import React, { useState, useEffect } from "react";
import {
  Card,
  Radio,
  Button,
  Typography,
  Modal,
  Table,
  message,
  List,
  Row,
  Col,
  Space,
  Tag,
} from "antd";
import StudentLayoutWrapper from "../layouts/studentlayoutWrapper";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

interface Option {
  id: number;
  option_text: string;
  is_correct: boolean;
}

interface Question {
  image: string | undefined;
  id: number;
  name: string;
  type: string;
  options: Option[];
}

interface Test {
  test_id: number;
  test_name: string;
  duration: number;
  created_at: string;
  start_date: string;
  end_date: string;
  course_id: number | null;
  course_name: string | null;
  result_id: number | null;
  total_questions: number | null;
  attempted: number | null;
  correct: number | null;
  wrong: number | null;
  final_score: string | null;
  final_result: string | null;
}

const TestScreen: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: { optionId: number | null; text: string | null };
  }>({});
  const [loading, setLoading] = useState(true);
  const [testId, setTestId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [openTests, setOpenTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [showTestList, setShowTestList] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { token: token } };

  useEffect(() => {
    fetchTestStatus();
  }, []);

  const fetchTestStatus = () => {
    setLoading(true);
    axios
      .get(
        "http://localhost:3001/api/studentdashbaord/getStudentTestStatus",
        axiosConfig
      )
      .then((response) => {
        console.log("Test status response:", response.data);
        const openTestsData = response.data?.data?.tests?.openTests || [];
        setOpenTests(openTestsData);

        if (openTestsData.length === 1) {
          // If only one open test, load it directly
          handleTestSelect(openTestsData[0]);
        } else if (openTestsData.length > 1) {
          // If multiple open tests, show the list
          setShowTestList(true);
        } else {
          // No open tests
          message.info("No open tests available at this time");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching test status:", error);
        setLoading(false);
      });
  };

  const handleTestSelect = (test: Test) => {
    setSelectedTest(test);
    setTestId(test.test_id);
    setLoading(true);
    setShowTestList(false);

    axios
      .get(
        `http://localhost:3001/api/question/viewTestByID?id=${test.test_id}`,
        axiosConfig
      )
      .then((response) => {
        setQuestions(response.data.data.questions || []);
        // Set timer based on test duration (convert minutes to seconds)
        setTimeLeft(test.duration * 60);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setLoading(false);
      });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleNext = async () => {
    if (!currentQuestion) return;

    const payload = {
      test_id: testId,
      answers: [
        {
          question_id: currentQuestion.id,
          option_id: selectedAnswers[currentQuestion.id]?.optionId || null,
          text: selectedAnswers[currentQuestion.id]?.text || null,
        },
      ],
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/api/testsubmission/submitTest",
        payload,
        axiosConfig
      );

      if (currentQuestionIndex === questions.length - 1) {
        setTestResult(response.data.finalSummary);
        setIsModalVisible(true);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } catch (error) {
      message.error("Error submitting answer");
      console.error("Submission error:", error);
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate("/student/dashboard");
  };

  const formatDate = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
  };

  const currentQuestion: Question | undefined = questions[currentQuestionIndex];

  if (loading) {
    return (
      <StudentLayoutWrapper pageTitle="Test">
        <div style={{ padding: "20px", textAlign: "center" }}>
          <Text>Loading...</Text>
        </div>
      </StudentLayoutWrapper>
    );
  }

  if (showTestList) {
    return (
      <StudentLayoutWrapper pageTitle="Available Tests">
        <div style={{ padding: "20px" }}>
          <Title
            level={2}
            style={{ textAlign: "center", marginBottom: "24px" }}
          >
            Available Tests
          </Title>
          <Row gutter={[16, 16]}>
            {openTests.map((test) => (
              <Col xs={24} sm={12} md={8} lg={6} key={test.test_id}>
                <Card
                  title={test.test_name}
                  bordered={true}
                  hoverable
                  style={{ height: "100%" }}
                  actions={[
                    <Button
                      type="primary"
                      onClick={() => handleTestSelect(test)}
                    >
                      Start Test
                    </Button>,
                  ]}
                >
                  <Space direction="vertical" size="middle">
                    <div>
                      <Text strong>Duration: </Text>
                      <Text>{test.duration} minutes</Text>
                    </div>
                    <div>
                      <Text strong>Course: </Text>
                      <Text>{test.course_name || "General"}</Text>
                    </div>
                    <div>
                      <Text strong>Available Until: </Text>
                      <Text>{formatDate(test.end_date)}</Text>
                    </div>
                    {test.total_questions && (
                      <div>
                        <Text strong>Questions: </Text>
                        <Text>{test.total_questions}</Text>
                      </div>
                    )}
                    {test.final_result && (
                      <Tag
                        color={
                          test.final_result === "Pass" ? "green" : "volcano"
                        }
                      >
                        {test.final_result}
                      </Tag>
                    )}
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </StudentLayoutWrapper>
    );
  }

  if (openTests.length === 0) {
    return (
      <StudentLayoutWrapper pageTitle="Test">
        <div
          style={{
            height: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Card
            style={{
              textAlign: "center",
              padding: "40px",
              border: "2px dashed #FFA500",
              borderRadius: "16px",
              backgroundColor: "#fffbe6",
            }}
          >
            <Title level={2} style={{ color: "#fa8c16" }}>
              No Open Tests Available
            </Title>
            <Text type="secondary">
              Please check back later or contact your instructor.
            </Text>
          </Card>
        </div>
      </StudentLayoutWrapper>
    );
  }

  if (!testId || questions.length === 0) {
    return (
      <StudentLayoutWrapper pageTitle="Test">
        <div style={{ padding: "20px", textAlign: "center" }}>
          <Text>No questions available for this test</Text>
        </div>
      </StudentLayoutWrapper>
    );
  }

  return (
    <StudentLayoutWrapper pageTitle="Test">
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Card style={{ border: "2px solid #FFD700", borderRadius: "10px" }}>
          <Title level={1} style={{ color: "#6A0DAD" }}>
            {selectedTest?.test_name || "TEST"}
          </Title>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
            }}
          >
            <Text
              style={{ color: "#FFA500", fontWeight: "bold", fontSize: "20px" }}
            >
              Total Questions: {questions.length}
            </Text>
            <Text
              style={{ color: "#6A0DAD", fontWeight: "bold", fontSize: "20px" }}
            >
              Attempted: {currentQuestionIndex + 1}/{questions.length}
            </Text>
            <Text
              style={{ color: "#FFA500", fontWeight: "bold", fontSize: "20px" }}
            >
              Timer: {formatTime(timeLeft)}
            </Text>
          </div>
        </Card>

        <Card
          style={{ marginTop: "20px", borderRadius: "10px", textAlign: "left" }}
        >
          <Title level={2} style={{ textAlign: "left" }}>
            {currentQuestionIndex + 1}. {currentQuestion.name}
          </Title>
          {currentQuestion.image && (
            <img
              src={currentQuestion.image}
              style={{ width: "100%", height: "200px", objectFit: "contain" }}
              alt="Question visual"
            />
          )}
          <Radio.Group
            onChange={(e) =>
              setSelectedAnswers({
                ...selectedAnswers,
                [currentQuestion.id]: { optionId: e.target.value, text: null },
              })
            }
            value={selectedAnswers[currentQuestion.id]?.optionId || null}
          >
            {currentQuestion.options.map((option) => (
              <Radio
                key={option.id}
                value={option.id}
                style={{
                  display: "block",
                  margin: "10px 0",
                  fontSize: "18px",
                  textAlign: "left",
                }}
              >
                {option.option_text}
              </Radio>
            ))}
          </Radio.Group>
        </Card>

        <Button
          type="primary"
          size="large"
          onClick={handleNext}
          style={{ marginTop: "20px" }}
        >
          {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
        </Button>

        {/* Result Modal */}
        <Modal
          title="Test Result"
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalOk}
          okText="OK"
          width={800}
        >
          {testResult && (
            <Table
              dataSource={[
                {
                  key: "1",
                  label: "Total Questions",
                  value: testResult.totalQuestions,
                },
                { key: "2", label: "Attempted", value: testResult.attempted },
                { key: "3", label: "Correct", value: testResult.correct },
                { key: "4", label: "Wrong", value: testResult.wrong },
                {
                  key: "5",
                  label: "Final Score",
                  value: `${testResult.finalScore}%`,
                },
                {
                  key: "6",
                  label: "Final Result",
                  value: testResult.finalResult,
                },
              ]}
              columns={[
                { title: "Details", dataIndex: "label", key: "label" },
                { title: "Result", dataIndex: "value", key: "value" },
              ]}
              pagination={false}
              bordered
            />
          )}
        </Modal>
      </div>
    </StudentLayoutWrapper>
  );
};

export default TestScreen;
