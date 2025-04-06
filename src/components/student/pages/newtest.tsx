import React, { useState, useEffect } from "react";
import { Card, Radio, Button, Typography, Modal, Table, message } from "antd";
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
  id: number;
  name: string;
  type: string;
  options: Option[];
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

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { token: token } };

  useEffect(() => {
    axios
      .get("http://13.233.33.133/api/question/viewAllTests", axiosConfig)
      .then((response) => {
        if (response.data.data.length > 0) {
          setTestId(response.data.data[0].test_id);
        }
      })
      .catch((error) => console.error("Error fetching test ID:", error));
  }, []);

  useEffect(() => {
    if (testId) {
      axios
        .get(
          `http://13.233.33.133/api/question/viewTestByID?id=${testId}`,
          axiosConfig
        )
        .then((response) => {
          setQuestions(response.data.data.questions || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching questions:", error);
          setLoading(false);
        });
    }
  }, [testId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
        "http://13.233.33.133/api/testsubmission/submitTest",
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

  if (loading) return <Text>Loading test...</Text>;
  if (!testId || questions.length === 0) return <Text>No questions available</Text>;

  const currentQuestion: Question | undefined = questions[currentQuestionIndex];
  if (!currentQuestion) return <Text>No questions available</Text>;

  return (
    <StudentLayoutWrapper pageTitle="Test">
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Card style={{ border: "2px solid #FFD700", borderRadius: "10px" }}>
          <Title level={1} style={{ color: "#6A0DAD" }}>REGULAR TEST</Title>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
            <Text style={{ color: "#FFA500", fontWeight: "bold", fontSize: "20px" }}>
              Total Questions: {questions.length}
            </Text>
            <Text style={{ color: "#6A0DAD", fontWeight: "bold", fontSize: "20px" }}>
              Attempted: {currentQuestionIndex + 1}/{questions.length}
            </Text>
            <Text style={{ color: "#FFA500", fontWeight: "bold", fontSize: "20px" }}>
              Timer: {formatTime(timeLeft)}
            </Text>
          </div>
        </Card>

        <Card style={{ marginTop: "20px", borderRadius: "10px", textAlign: "left" }}>
          <Title level={2} style={{ textAlign: "left" }}>
            {currentQuestionIndex + 1}. {currentQuestion.name}
          </Title>
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
              <Radio key={option.id} value={option.id} style={{ display: "block", margin: "10px 0", fontSize: "18px", textAlign: "left" }}>
                {option.option_text}
              </Radio>
            ))}
          </Radio.Group>
        </Card>

        <Button type="primary" size="large" onClick={handleNext} style={{ marginTop: "20px" }}>
          {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
        </Button>

        {/* Result Modal */}
        <Modal title="Test Result" visible={isModalVisible} onOk={handleModalOk} onCancel={handleModalOk} okText="OK">
          {testResult && (
            <Table
              dataSource={[
                { key: "1", label: "Total Questions", value: testResult.totalQuestions },
                { key: "2", label: "Attempted", value: testResult.attempted },
                { key: "3", label: "Correct", value: testResult.correct },
                { key: "4", label: "Wrong", value: testResult.wrong },
                { key: "5", label: "Final Score", value: `${testResult.finalScore}%` },
                { key: "6", label: "Final Result", value: testResult.finalResult },
              ]}
              columns={[
                { title: "Details", dataIndex: "label", key: "label" },
                { title: "Result", dataIndex: "value", key: "value" },
              ]}
              pagination={false}
            />
          )}
        </Modal>
      </div>
    </StudentLayoutWrapper>
  );
};

export default TestScreen;
