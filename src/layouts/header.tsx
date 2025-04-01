import { Layout, Typography, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  metaInfo?: string;
}

const AppHeader = ({ title, subtitle = "INSTRUCTIONS", metaInfo = "MET INFO: NANI, BARCH CEED YOUD" }: AppHeaderProps) => {
  return (
    <Header style={{ 
      background: '#C6A2D4', 
      padding: '0 20px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      height: '64px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Title level={4} style={{ color: 'white', margin: 0 }}>{title}</Title>
        <Title level={5} style={{ color: 'white', margin: 0, fontWeight: 'normal' }}>{subtitle}</Title>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: 'white', fontSize: '12px' }}>{metaInfo}</span>
        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
      </div>
    </Header>
  );
};

export default AppHeader;