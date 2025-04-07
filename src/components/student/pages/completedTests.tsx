import React, { useEffect, useState } from "react";
import { Table, Card, Typography, Spin, Alert, Tag, Space } from "antd";
import StudentLayoutWrapper from "../layouts/studentlayoutWrapper";

const { Title, Text } = Typography;

interface Option {
  option_id: number;
  option_text: string;
  is_correct: boolean;
}

interface Answer {
  question_id: number;
  question_text: string;
  submitted_option_id: number;
  is_correct: boolean;
  options: Option[];
}

interface TestResult {
  test_id: number;
  test_name: string;
  total_questions: number;
  attempted: number;
  correct: number;
  wrong: number;
  final_score: string;
  final_result: string;
}

const StudentCompletedTest = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<TestResult | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTestResult();
  }, []);

  const fetchTestResult = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        "http://13.233.33.133:3001/api/testsubmission/getTestResultById?test_id=2",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token || "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch test result");
      }

      const data = await response.json();
      setResult(data.result);
      setAnswers(data.answers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const renderOptions = (record: Answer) => {
    return (
      <Space direction="vertical" size={4}>
        {record.options.map((option) => {
          let tagColor = 'default';
          let tagStyle: React.CSSProperties = {};
          
          // Student's selected answer
          if (option.option_id === record.submitted_option_id) {
            tagColor = record.is_correct ? 'green' : 'red';
            tagStyle = { fontWeight: 'bold' };
          } 
          // Correct answer (if not selected by student)
          else if (option.is_correct) {
            tagColor = 'blue';
          }

          return (
            <Tag 
              color={tagColor}
              style={tagStyle}
              key={option.option_id}
            >
              {option.option_text}
              {option.option_id === record.submitted_option_id && " (Your Answer)"}
              {option.is_correct && option.option_id !== record.submitted_option_id && " (Correct Answer)"}
            </Tag>
          );
        })}
      </Space>
    );
  };

  const columns = [
    {
      title: 'Question',
      dataIndex: 'question_text',
      key: 'question',
      render: (text: string, _record: Answer, index: number) => (
        <Text strong>{index + 1}. {text}</Text>
      ),
      width: '40%',
    },
    {
      title: 'Options',
      key: 'options',
      render: renderOptions,
      width: '50%',
    },
    {
      title: 'Result',
      key: 'result',
      render: (record: Answer) => (
        <Tag color={record.is_correct ? 'green' : 'red'}>
          {record.is_correct ? 'Correct' : 'Incorrect'}
        </Tag>
      ),
      width: '10%',
      align: 'center' as const,
    },
  ];

  return (
    <StudentLayoutWrapper pageTitle="BORIGAM / Test Result">
      <div style={{ padding: "24px" }}>
        <Title level={2}>Test Result</Title>

        {error && (
          <Alert 
            message="Error" 
            description={error} 
            type="error" 
            showIcon 
            style={{ marginBottom: 24 }} 
          />
        )}

        {loading ? (
          <Spin 
            size="large" 
            style={{ 
              display: "flex", 
              justifyContent: "center", 
              marginTop: "40px" 
            }} 
          />
        ) : (
          <>
            {result && (
              <Card 
                title="Test Summary" 
                style={{ marginBottom: 24 }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <Text strong>Total Questions:</Text> {result.total_questions}
                  </div>
                  <div>
                    <Text strong>Attempted:</Text> {result.attempted}
                  </div>
                  <div>
                    <Text strong>Correct:</Text> {result.correct}
                  </div>
                  <div>
                    <Text strong>Wrong:</Text> {result.wrong}
                  </div>
                  <div>
                    <Text strong>Score:</Text> {result.final_score}%
                  </div>
                  <div>
                    <Text strong>Result:</Text>{" "}
                    <Tag color={result.final_result === "Pass" ? "green" : "red"}>
                      {result.final_result}
                    </Tag>
                  </div>
                </div>
              </Card>
            )}

            <Card title="Question Details">
              <Table
                dataSource={answers}
                columns={columns}
                rowKey="question_id"
                pagination={false}
                bordered
              />
            </Card>
          </>
        )}
      </div>
    </StudentLayoutWrapper>
  );
};

export default StudentCompletedTest;