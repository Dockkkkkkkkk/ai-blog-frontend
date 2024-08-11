import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme, Form, message, Flex, Layout, Avatar, List, Divider, Button, Drawer, Descriptions } from 'antd';
import { useState } from 'react';
import React from 'react';
import {
  ProForm,
} from '@ant-design/pro-components';
import { Input } from 'antd';
import VirtualList from 'rc-virtual-list';
import type { DescriptionsProps } from 'antd';
import BlogList from '@/components/BlogList';
import IdeaList from '@/components/IdeaList';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { currentUser } from '@/services/ant-design-pro/api';
import { requestConfig } from '../../requestConfig';
const { TextArea } = Input;

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
  href: string;
}> = ({ title, href, index, desc }) => {
  const { useToken } = theme;

  const { token } = useToken();

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
            backgroundImage:
              "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontSize: '16px',
            color: token.colorText,
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          color: token.colorTextSecondary,
          textAlign: 'justify',
          lineHeight: '22px',
          marginBottom: 8,
        }}
      >
        {desc}
      </div>
      <a href={href} target="_blank" rel="noreferrer">
        了解更多 {'>'}
      </a>
    </div>
  );
};
interface DescriptionType {
  "id": number,
  "title": string,
  "description": string,
  "userId": string,
  "materials": string[],
  "generatedContent": string,
  "createdTime": string,
  "updatedTime": string
}

const initialDescription: DescriptionType = {
  id: 0,
  title: '',
  description: '',
  userId: '',
  materials: [],
  generatedContent: '',
  createdTime: '',
  updatedTime: '',
};


const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const [value, setValue] = useState('');
  const [blogIdList, setblogIdList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState<DescriptionType>(initialDescription);
  const [blogId, setBlogId] = useState<number | null>(null);
  const [refreshBlogList, setRefreshBlogList] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    const { search } = window.location;
    const params = new URLSearchParams(search);
    const blogId = params.get('blogId');
    if (blogId) {
      setBlogId(Number(blogId));
    }
  }, []);

  useEffect(() => {
    if (blogId !== null) {
      const getDescription = () => {
        const requestBody = {
          blogId: blogId,
        };
        fetch(`${requestConfig.baseURL}/blog/getDescription`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })
          .then((res) => res.json())
          .then((body) => {
            setDescription(body.data);
          })
          .catch(() => {
            console.error('Failed to fetch description');
          });
      };

      getDescription();
    }
  }, [blogId]);

  const onFinish = (values: any) => {
    const requestBody = {
      blogId: blogId,
      content: value
    };
    fetch(`${requestConfig.baseURL}/idea/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((body) => {
        setRefreshBlogList(prev => !prev);
        message.success('添加成功');
      })
      .catch(() => {
        console.error('Failed to fetch description');
      });
    console.log(values);
  };
  const onReset = () => {
    form.resetFields();
  };
  const { Header, Footer, Sider, Content } = Layout;

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#4096ff',
  };

  const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    width: '100%',
    backgroundColor: '#FFFFFF',
  };

  const siderStyle: React.CSSProperties = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#A6DBFF',
  };

  const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#fff',
  };

  const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    width: 'calc(100% - 8px)',
    maxWidth: 'calc(100%)',
  };

  const ContainerHeight = 400;
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  return (

    <PageContainer>
      <Flex gap="middle" wrap>
        <Layout style={layoutStyle}>
          <Layout>
            <Content style={contentStyle}>
              <div>
                <Card
                  style={{
                    borderRadius: 8,
                  }}
                  bodyStyle={{
                    backgroundImage:
                      initialState?.settings?.navTheme === 'realDark'
                        ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
                        : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
                  }}
                >
                  <div
                    style={{
                      backgroundPosition: '100% -30%',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '274px auto',
                      backgroundImage:
                        "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
                    }}
                  >
                    <ProForm
                      form={form}
                      onFinish={onFinish}
                      onReset={onReset}
                      initialValues={{
                        autoComplete: 'off',
                      }}
                    >
                      <Form.Item name="resource" label="" rules={[{ required: true }]}>
                        <TextArea
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          placeholder="请输入您的素材"
                          autoSize={{ minRows: 10, maxRows: 500 }}
                        />
                      </Form.Item>
                      <div style={{ textAlign: 'right', float: 'right' }}>
                        <Button type="primary" onClick={showDrawer}>
                          素材列表
                        </Button>
                      </div>

                      <Drawer title="素材列表" onClose={onClose} open={open}>
                        <IdeaList refresh={refreshBlogList}></IdeaList>
                      </Drawer>
                    </ProForm>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 16,
                      }}
                    >
                    </div>
                  </div>
                </Card>
                <Footer style={footerStyle}>
                  <Descriptions title="博客信息" layout="vertical">
                    <Descriptions.Item label="序号">
                      {description.id !== undefined && description.id !== null ? description.id : 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="标题">
                      {description.title ? description.title : 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="描述">
                      {description.description
                        ? description.description.length > 10
                          ? `${description.description.substring(0, 10)}...`
                          : description.description
                        : 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="内容">
                      {description.generatedContent !== undefined
                        && description.generatedContent !== null
                        && description.generatedContent.length > 0 ? '有' : '无'}
                    </Descriptions.Item>
                    <Descriptions.Item label="最近更新时间">
                      {description.updatedTime ? description.updatedTime : 'N/A'}
                    </Descriptions.Item>
                    <Descriptions.Item label="素材数量">
                      {description.materials && description.materials.length > 0
                        ? description.materials.length
                        : '0'}
                    </Descriptions.Item>
                  </Descriptions>
                </Footer>
              </div>
            </Content>
            <Sider width="30%" style={siderStyle}>
              <div
                style={{
                  color: '#1E1E1E',
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 5,
                }}
              >
                我的博客
              </div>
              <BlogList></BlogList>
            </Sider>
          </Layout>
        </Layout>
      </Flex>



    </PageContainer>
  );
};

export default Welcome;
