import { useEffect, useState } from "react";
import { Card, Checkbox, Button, Select, message, Modal } from "antd";
import LayoutWrapper from "../layouts/layoutWrapper";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

interface OptionType {
  option_id: number;
  option_text: string;
}

interface Question {
  id: number;
  name: string;
  options: OptionType[];
}

const AddTest = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [testType, setTestType] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "http://13.233.33.133:3001/api/question/getAllQuestions",
          {
            headers: {
              "Content-Type": "application/json",
              token: localStorage.getItem("token") || "",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch questions");

        const data = await response.json();
        setQuestions(data.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleCheckboxChange = (questionId: number, checked: boolean) => {
    setSelectedQuestions((prev) =>
      checked ? [...prev, questionId] : prev.filter((id) => id !== questionId)
    );
  };

  const handleSubmit = async () => {
    if (!testType) {
      message.error("Please select a test type");
      return;
    }
    if (selectedQuestions.length === 0) {
      message.error("Please select at least one question");
      return;
    }
    const duration = testType === "Mock Test" ? 60 : 180;
    const payload = {
      name: `${testType}`,
      duration,
      questions: selectedQuestions,
    };
  
    try {
      const response = await fetch(
        "http://13.233.33.133:3001/api/question/createTest",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token") || "",
          },
          body: JSON.stringify(payload),
        }
      );
  
      if (!response.ok) throw new Error("Failed to create test");
  
      setIsModalVisible(true); // Show modal on success
    } catch (error) {
      console.error("Error creating test:", error);
      message.error("Failed to create test");
    }
  };  

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate("/dashboard");
  };

  return (
    <LayoutWrapper pageTitle="BORIGAM / Add Test">
      <Card
        className="w-3/4 mx-auto p-6"
        style={{ backgroundColor: "#f7f7f7" }}
      >
        <h2 className="text-2xl font-bold mb-4">Add Test</h2>
        <div>
          Select test Type:<span style={{ color: "red" }}>*</span>
        </div>
        <Select
          placeholder="Select Test Type"
          onChange={setTestType}
          value={testType}
          style={{ width: "100%", marginBottom: "20px"}}
           >
          <Option value="Mock Test">Mock Test (180 mins)</Option>
          <Option value="Regular Test">Regular Test (30 mins)</Option>
        </Select>

        {questions.map((question) => (
          <Card
            key={question.id}
            className="mb-4"
            style={{
              marginBottom: "10px",
              borderColor: "gold",
              borderWidth: "1px",
            }}
          >
            <Checkbox
              onChange={(e) =>
                handleCheckboxChange(question.id, e.target.checked)
              }
              checked={selectedQuestions.includes(question.id)}
            >
              <div style={{ marginLeft: "20px", fontSize: "20px" }}>
                {question.name}
              </div>
              {question.options.map((option) => (
                <p
                  style={{ marginLeft: "20px", fontSize: "15px" }}
                  key={option.option_id}
                >
                  {option.option_text}
                </p>
              ))}
            </Checkbox>
          </Card>
        ))}

        <Button
          style={{ marginTop: "20px" }}
          type="primary"
          onClick={handleSubmit}
          className="mt-4"
        >
          Add Questions to Test
        </Button>
      </Card>
      <Modal
        title="Success"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
      >
        <p>Questions added successfully!</p>
      </Modal>
    </LayoutWrapper>
  );
};

export default AddTest;
