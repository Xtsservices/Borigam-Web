import { useEffect, useState } from "react";
import {
  Card,
  Checkbox,
  Button,
  Select,
  message,
  Modal,
  DatePicker,
  Form,
  Tag,
} from "antd";
import LayoutWrapper from "../layouts/layoutWrapper";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

interface OptionType {
  option_id: number;
  option_text: string;
}

interface Question {
  image: any;
  id: number;
  name: string;
  start_date: string;
  options: OptionType[];
  subject_id: number;
}

interface Course {
  id: number;
  name: string;
  status: string;
}

interface Batch {
  batch_id: number;
  name: string;
  course_id: number;
  course_name: string;
  college_id: number;
  college_name: string;
  start_date: string;
  end_date: string;
  status: string;
}

const AddTest = () => {
  const [, setAllQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<Batch[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [testType, setTestType] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedBatches, setSelectedBatches] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
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
        setAllQuestions(data.data);
        setFilteredQuestions(data.data); // Initially show all questions
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "http://13.233.33.133:3001/api/course/getCourses",
          {
            headers: {
              "Content-Type": "application/json",
              token: localStorage.getItem("token") || "",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch courses");

        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const fetchBatches = async () => {
      try {
        const response = await fetch(
          "http://13.233.33.133:3001/api/course/viewAllBatches",
          {
            headers: {
              "Content-Type": "application/json",
              token: localStorage.getItem("token") || "",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch batches");

        const data = await response.json();
        setBatches(data.data);
        setFilteredBatches(data.data); // Initially show all batches
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };

    fetchQuestions();
    fetchCourses();
    fetchBatches();
  }, []);

  // Filter batches when course changes
  useEffect(() => {
    if (selectedCourse) {
      const filtered = batches.filter(
        (batch) => batch.course_id === selectedCourse
      );
      setFilteredBatches(filtered);
      // Reset selected batches if they don't belong to the selected course
      setSelectedBatches((prev) =>
        prev.filter((batchId) =>
          filtered.some((batch) => batch.batch_id === batchId)
        )
      ); // Added missing closing parenthesis here
    } else {
      setFilteredBatches(batches); // Show all batches if no course selected
    }
  }, [selectedCourse, batches]);

  const handleCheckboxChange = (questionId: number, checked: boolean) => {
    setSelectedQuestions((prev) =>
      checked ? [...prev, questionId] : prev.filter((id) => id !== questionId)
    );
  };

  const formatDate = (date: any) => {
    if (!date) return "";
    const day = String(date.date()).padStart(2, "0");
    const month = String(date.month() + 1).padStart(2, "0");
    const year = date.year();
    return `${day}-${month}-${year}`;
  };

  const handleBatchChange = (selectedBatchIds: number[]) => {
    setSelectedBatches(selectedBatchIds);
  };

  const handleSubmit = async () => {
    if (!testType) {
      message.error("Please select a test type");
      return;
    }
    if (!selectedCourse) {
      message.error("Please select a course");
      return;
    }
    if (selectedBatches.length === 0) {
      message.error("Please select at least one batch");
      return;
    }
    if (!startDate || !endDate) {
      message.error("Please select both start and end dates");
      return;
    }
    if (selectedQuestions.length === 0) {
      message.error("Please select at least one question");
      return;
    }

    const duration = testType === "Mock Test" ? 180 : 30;

    const payload = {
      name: testType,
      duration,
      course_id: selectedCourse,
      questions: selectedQuestions,
      batch_ids: selectedBatches,
      start_date: startDate,
      end_date: endDate,
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

      setIsModalVisible(true);
    } catch (error) {
      console.error("Error creating test:", error);
      message.error("Failed to create test");
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    navigate("/dashboard");
  };

  const handleStartDateChange = (date: any) => {
    setStartDate(formatDate(date));
  };

  const handleEndDateChange = (date: any) => {
    setEndDate(formatDate(date));
  };

  return (
    <LayoutWrapper pageTitle="BORIGAM / Add Test">
      <Card
        className="w-3/4 mx-auto p-6"
        style={{ backgroundColor: "#f7f7f7" }}
      >
        <h2 className="text-2xl font-bold mb-4">Add Test</h2>

        <Form layout="vertical">
          <Form.Item label="Select Test Type:" required>
            <Select
              placeholder="Select Test Type"
              onChange={setTestType}
              value={testType}
              style={{ width: "100%", marginBottom: "20px" }}
            >
              <Option value="Mock Test">Mock Test (180 mins)</Option>
              <Option value="Regular Test">Regular Test (30 mins)</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Select Course:" required>
            <Select
              placeholder="Select Course"
              onChange={(value) => setSelectedCourse(Number(value))}
              value={selectedCourse}
              style={{ width: "100%", marginBottom: "20px" }}
            >
              {Array.isArray(courses) &&
                courses.map((course) => (
                  <Option key={course.id} value={course.id}>
                    {course.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item label="Select Batch(es):" required>
            <Select
              mode="multiple"
              placeholder="Select Batches"
              onChange={handleBatchChange}
              value={selectedBatches}
              style={{ width: "100%", marginBottom: "20px" }}
              tagRender={({ label, value, closable, onClose }) => {
                const batch = filteredBatches.find((b) => b.batch_id === value);
                return (
                  <Tag
                    closable={closable}
                    onClose={onClose}
                    style={{ marginRight: 3 }}
                  >
                    {batch ? `${batch.name} (${batch.course_name})` : label}
                  </Tag>
                );
              }}
            >
              {Array.isArray(filteredBatches) &&
                filteredBatches.map((batch) => (
                  <Option key={batch.batch_id} value={batch.batch_id}>
                    {batch.name} ({batch.course_name})
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item label="Start Date:" required>
            <DatePicker
              onChange={handleStartDateChange}
              style={{ width: "100%", marginBottom: "20px" }}
              format="DD-MM-YYYY"
            />
          </Form.Item>

          <Form.Item label="End Date:" required>
            <DatePicker
              onChange={handleEndDateChange}
              style={{ width: "100%", marginBottom: "20px" }}
              format="DD-MM-YYYY"
            />
          </Form.Item>

          <h3 className="text-lg font-semibold mb-2">Select Questions:</h3>
          {filteredQuestions.length === 0 ? (
            <p>No questions available</p>
          ) : (
            filteredQuestions.map((question) => (
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

                  {question.image && (
                    <img
                      src={question.image}
                      alt="Question"
                      style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "cover",
                        marginLeft: "20px",
                        marginTop: "10px",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                      }}
                    />
                  )}

                  {Array.isArray(question.options) &&
                    question.options.map((option) => (
                      <p
                        style={{ marginLeft: "20px", fontSize: "15px" }}
                        key={option.option_id}
                      >
                        {option.option_text}
                      </p>
                    ))}
                </Checkbox>
              </Card>
            ))
          )}

          <Button
            style={{ marginTop: "20px" }}
            type="primary"
            onClick={handleSubmit}
            className="mt-4"
          >
            Add Questions to Test
          </Button>
        </Form>
      </Card>

      <Modal
        title="Success"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
      >
        <p>Test created successfully!</p>
      </Modal>
    </LayoutWrapper>
  );
};

export default AddTest;
