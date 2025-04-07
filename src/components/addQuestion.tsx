import { useEffect, useState } from "react";
import {
  Form,
  Select,
  Button,
  Card,
  Input,
  message,
  Modal,
  Typography,
} from "antd";
import LayoutWrapper from "../layouts/layoutWrapper";

const { Option } = Select;
const { Text } = Typography;

interface Subject {
  id: number;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface QuestionPayload {
  name: string;
  type: string;
  subject_id: number;
  options: Array<{
    option_text: string;
    is_correct: boolean;
  }>;
}

// Utility function to format dates
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const AddQuestions = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const questionTypes = ["radio"];

  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(
    null
  );
  const [questionText, setQuestionText] = useState<string>("");
  const [questionType, setQuestionType] = useState<string>("");
  const [options, setOptions] = useState([
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(
          "http://13.233.33.133:3001/api/course/getSubjects",
          {
            headers: {
              "Content-Type": "application/json",
              token: localStorage.getItem("token") || "",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch subjects");

        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        message.error("Failed to load subjects");
      }
    };

    fetchSubjects();
  }, []);

  const handleOptionChange = (index: number, text: string) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, option_text: text } : opt))
    );
  };

  const handleCorrectOptionChange = (index: number) => {
    setOptions((prev) =>
      prev.map((opt, i) => ({ ...opt, is_correct: i === index }))
    );
  };

  const handleSubmit = async () => {
    if (!questionText || !selectedSubjectId || !questionType) {
      message.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", questionText);
    formData.append("type", questionType.toLowerCase().replace(" ", "_"));
    formData.append("subject_id", selectedSubjectId.toString());
    formData.append(
      "options",
      JSON.stringify(options.filter((opt) => opt.option_text.trim() !== ""))
    );

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch(
        "http://13.233.33.133:3001/api/question/createQuestion",
        {
          method: "POST",
          headers: {
            token: localStorage.getItem("token") || "",
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to submit question");

      message.success("Question added successfully!");
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error submitting question:", error);
      message.error("Failed to add question.");
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    window.location.reload();
  };

  return (
    <LayoutWrapper pageTitle="BORIGAM / Add Question">
      <Card className="w-1/2 mx-auto p-6">
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Select Subject:"
            name="subject"
            rules={[{ required: true }]}
          >
            <Select
              onChange={(value) => {
                const selectedSubject = subjects.find(
                  (sub) => sub.name === value
                );
                setSelectedSubject(selectedSubject?.name || "");
                setSelectedSubjectId(selectedSubject?.id || null);
              }}
              value={selectedSubject}
              placeholder="Select Subject"
            >
              {subjects.map((subject) => (
                <Option key={subject.id} value={subject.name}>
                  {subject.name} (Created: {formatDate(subject.created_at)})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Add Question:" required>
            <Input
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter your question"
            />
          </Form.Item>
          <Form.Item label="Upload Question Image (optional)">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </Form.Item>

          <Form.Item
            label="Select Question Type:"
            name="questionType"
            rules={[{ required: true }]}
          >
            <Select
              onChange={setQuestionType}
              value={questionType}
              placeholder="Select"
            >
              {questionTypes.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {questionType === "radio" && (
            <>
              {options.map((option, index) => (
                <Form.Item key={index} label={`Answer Option ${index + 1}:`}>
                  <Input
                    value={option.option_text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Enter option ${index + 1}`}
                  />
                  <input
                    type="radio"
                    name="correctOption"
                    checked={option.is_correct}
                    onChange={() => handleCorrectOptionChange(index)}
                  />
                  Correct Answer
                </Form.Item>
              ))}
            </>
          )}

          <Button type="primary" htmlType="submit" className="mt-4">
            Submit
          </Button>
        </Form>
      </Card>

      <Modal
        title="Success"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        okText="OK"
      >
        <p>Question added successfully!</p>
        {subjects.find((sub) => sub.id === selectedSubjectId) && (
          <Text type="secondary">
            Subject: {selectedSubject} (Last updated:{" "}
            {formatDate(
              subjects.find((sub) => sub.id === selectedSubjectId)
                ?.updated_at || ""
            )}
            )
          </Text>
        )}
      </Modal>
    </LayoutWrapper>
  );
};

export default AddQuestions;
