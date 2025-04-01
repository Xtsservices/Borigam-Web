import { Layout, Menu } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const AppSidebar = () => {
  return (
    <Sider width={80} style={{ background: '#EFE4F0', paddingTop: '20px' }}>
      <Menu 
        mode="vertical" 
        theme="light" 
        style={{ borderRight: 0 }}
        items={[
          {
            key: 'home',
            icon: <HomeOutlined style={{ fontSize: '20px' }} />,
            style: { textAlign: 'center', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
          },
          {
            key: 'profile',
            icon: <UserOutlined style={{ fontSize: '20px' }} />,
            style: { textAlign: 'center', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }
          }
        ]}
      />
    </Sider>
  );
};

export default AppSidebar;