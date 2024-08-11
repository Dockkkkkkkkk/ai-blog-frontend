import React, { useEffect, useState } from 'react';
import { Avatar, Divider, List, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { requestConfig } from '../../requestConfig';
// import type { List } from 'lodash';
interface DataType {
  "id": number,
  "title": string,
  "description": string,
  "userId": number,
  "materials": string[],
  "generatedContent": string,
  "createdTime": string,
  "updatedTime": string
}

const BlogList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  // const requestBody = {
  //   "pageNum": 0,
  //   "pageSize": 20,
  //   "userId": 7
  // };
  // const loadMoreData = () => {
  //   if (loading) {
  //     return;
  //   }
  //   setLoading(true);
  //   fetch(`${BASE_URL}/blog/list`)
  //     .then((res) => res.json())
  //     .then((body) => {
  //       setData([...data, ...body.results]);
  //       setLoading(false);
  //     })
  //     .catch(() => {
  //       setLoading(false);
  //     });
  // };
  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    // const requestBody = {
    //   key1: 'value1',
    //   key2: 'value2',
    // }; // 这里是您想要设置的请求体
    const requestBody = {
      "pageNum": 1,
      "pageSize": 2,
      "userId": 7
    };
    fetch(`${requestConfig.baseURL}/blog/list`, {
      method: 'POST', // 指定请求方法为POST
      headers: {
        'Content-Type': 'application/json', // 指定请求头为JSON格式
      },
      body: JSON.stringify(requestBody), // 将请求体转换为JSON字符串
    })
      .then((res) => res.json())
      .then((body) => {
        setData([...data, ...body.data.list]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  

  useEffect(() => {
    loadMoreData();
  }, []);

  return (
    <div
      id="scrollableDiv"
      style={{
        height: 500,
        overflow: 'auto',
        padding: '0 16px',
        border: '1px solid rgba(140, 140, 140, 0.35)',
      }}
    >
      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        hasMore={data.length < 50}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={data}
          renderItem={(item) => (
            <List.Item key={item.id}
            actions={[
              <a key="list-loadmore-edit">Edit</a>,
              <a key="list-loadmore-delete" onClick={() => {}}>Delete</a>,
            ]}
            >
              <List.Item.Meta
                // avatar={<Avatar src={item.picture.large} />}
                title={<a href={`/add-idea?blogId=${item.id}`}>{item.title}</a>}
                description={item.description}
              />
              <div></div>
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
};

export default BlogList;