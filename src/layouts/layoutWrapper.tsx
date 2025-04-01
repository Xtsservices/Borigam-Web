import { Layout } from 'antd';
import AppHeader from './header';
import AppSidebar from './sidebar';

const { Content } = Layout;

interface LayoutWrapperProps {
  children: React.ReactNode;
  pageTitle: string;
}

const LayoutWrapper = ({ children, pageTitle }: LayoutWrapperProps) => {
  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', overflowX: 'hidden' }}>
      <AppSidebar />
      <Layout>
        <AppHeader title={pageTitle} />
        <Content style={{ 
          padding: '20px', 
          background: '#F5F5F5',
          overflow: 'auto'
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutWrapper;