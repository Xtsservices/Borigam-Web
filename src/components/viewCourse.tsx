// src/pages/ViewCourse.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Typography, List, Divider, Image } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import LayoutWrapper from '../layouts/layoutWrapper';
import { courses } from './types/course';

const { Title, Text, Paragraph } = Typography;

const ViewCourse = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  // Find the course by ID
  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <LayoutWrapper pageTitle="Course Not Found">
        <Card style={{ textAlign: 'center', margin: '20px' }}>
          <Title level={4}>Course not found</Title>
          <Button type="primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </Card>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper pageTitle={`${course.name} Details`}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)}
        style={{ marginBottom: '20px' }}
      >
        Back
      </Button>

      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Image
            width={300}
            src={course.image}
            alt={course.name}
            preview={false}
          />
          <Title level={2} style={{ marginTop: '20px' }}>{course.name}</Title>
        </div>

        <Divider orientation="left">Course Details</Divider>
        
        <Paragraph>
          <Text strong>Description: </Text>
          {course.description}
        </Paragraph>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', margin: '20px 0' }}>
          <Card size="small" title="Duration" style={{ width: 200 }}>
            {course.duration}
          </Card>
          <Card size="small" title="Fee" style={{ width: 200 }}>
            {course.fee}
          </Card>
          <Card size="small" title="Eligibility" style={{ width: 200 }}>
            {course.eligibility}
          </Card>
        </div>

        <Divider orientation="left">Syllabus</Divider>
        <List
          bordered
          dataSource={course.syllabus}
          renderItem={(item) => (
            <List.Item>
              <Text>{item}</Text>
            </List.Item>
          )}
        />

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Button 
            type="primary" 
            size="large"
            onClick={() => alert(`Enrollment for ${course.name} started!`)}
          >
            Enroll Now
          </Button>
        </div>
      </Card>
    </LayoutWrapper>
  );
};

export default ViewCourse;