import { useEffect, useState } from "react";
import { Form, Select, Button, Card, Input, message, Modal } from "antd";
import LayoutWrapper from "../layouts/layoutWrapper";

const { Option } = Select;

interface Course {
  id: number;
  name: string;
}

const AddQuestions = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const levels = ["UG", "PG"];
  const questionTypes = ["radio"];

  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [questionText, setQuestionText] = useState<string>("");
  const [questionType, setQuestionType] = useState<string>("");
  const [options, setOptions] = useState([
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
    { option_text: "", is_correct: false },
  ]);

  // ✅ Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/course/getCourses",
          {
            headers: {
              "Content-Type": "application/json",
              token: localStorage.getItem("token") || "",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch courses");

        const data: Course[] = await response.json();
        setCourses(data);
        console.log("Fetched Courses:", data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseChange = (value: string) => {
    const course = courses.find((course) => course.name === value);
    setSelectedCourse(value);
    setSelectedCourseId(course ? course.id : null);
  };

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
    if (!selectedCourseId || !questionText || !questionType) {
      message.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      name: questionText,
      type: questionType.toLowerCase().replace(" ", "_"),
      course_id: selectedCourseId,
      options: options.filter((opt) => opt.option_text.trim() !== ""),
    };

    try {
      const response = await fetch(
        "http://localhost:3001/api/question/createQuestion",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            token: localStorage.getItem("token") || "",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to submit question");

      message.success("Question added successfully!");
      setIsModalVisible(true); // ✅ Show Modal on Success
    } catch (error) {
      console.error("Error submitting question:", error);
      message.error("Failed to add question.");
    }
  };

  // ✅ Reset form after closing modal
  const handleModalOk = () => {
    setIsModalVisible(false);
    window.location.reload()
  };

  // ✅ Function to reset form fields
  const resetForm = () => {
    setSelectedCourse("");
    setSelectedCourseId(null);
    setSelectedLevel("");
    setQuestionText("");
    setQuestionType("");
    setOptions([
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
    ]);
  };

  return (
    <LayoutWrapper pageTitle="Add Question">
      <Card className="w-1/2 mx-auto p-6">
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Select Course:"
            name="course"
            rules={[{ required: true }]}
          >
            <Select onChange={handleCourseChange} value={selectedCourse} placeholder="Select">
              {courses.map((course) => (
                <Option key={course.id} value={course.name}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Select Level:" name="level">
            <Select onChange={setSelectedLevel} value={selectedLevel} placeholder="Select">
              {levels.map((level) => (
                <Option key={level} value={level}>
                  {level}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Add Question:"
            name="questionText"
            rules={[{ required: true }]}
          >
            <Input
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter your question"
            />
          </Form.Item>

          <Form.Item
            label="Select Question Type:"
            name="questionType"
            rules={[{ required: true }]}
          >
            <Select onChange={setQuestionType} value={questionType} placeholder="Select">
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

      {/* ✅ Success Modal */}
      <Modal
        title="Success"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        okText="OK"
      >
        <p>Question added successfully!</p>
      </Modal>
    </LayoutWrapper>
  );
};

export default AddQuestions;
