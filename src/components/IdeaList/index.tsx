import React, { useEffect, useState } from 'react';
import { Avatar, Divider, List, message, Skeleton, Modal } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { requestConfig } from '../../requestConfig';
// import type { List } from 'lodash';
interface DataType {
  "id": number,
  "blogId": number,
  "content": string,
  "createdAt": string,
  "updatedAt": string
};

interface IdeaListProps {
  refresh: boolean; // 父组件传递的状态
}

const IdeaList: React.FC<IdeaListProps> = ({ refresh }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  const [blogId, setBlogId] = useState<number | null>(null);
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
  const loadMoreData = (clearData = false) => {
    if (loading) {
      return;
    }
    if (clearData) {
      setData([]); // 清空已有数据
    }
    setLoading(true);
    const requestBody = {
      "blogId": blogId
    };
    fetch(`${requestConfig.baseURL}/idea/searchByBlogId`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((body) => {
        setData(clearData ? body.data : [...data, ...body.data]); // 根据是否清除数据来决定数据的处理方式
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };


  useEffect(() => {
    const { search } = window.location;
    const params = new URLSearchParams(search);
    const blogIdFromUrl = params.get('blogId');
    if (blogIdFromUrl) {
      setBlogId(Number(blogIdFromUrl));
    }
  }, []);

  useEffect(() => {
    if (blogId) {
      loadMoreData(true); // 刷新时清空数据
    }
  }, [blogId, refresh]);

  const deleteIdea=(ideaId:number)=>{
    const requestBody = {
      "ideaId": ideaId
    };
    fetch(`${requestConfig.baseURL}/idea/removeById`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((body) => {
        loadMoreData(true)
        setLoading(false);
        if(body.message === 'success'){
          message.success('删除成功');
        }else{
          message.error('删除失败');
        }   
      })
      .catch(() => {
        setLoading(false);
      });
  }

  const showDeleteConfirm = (ideaId: number) => {
    if(confirm("确认删除该素材吗？")){
      deleteIdea(ideaId);
    }
  };

  



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
                <a key="list-loadmore-delete" onClick={() => showDeleteConfirm(item.id)}>Delete</a>,
              ]}
            >
              <List.Item.Meta
              // avatar={<Avatar src={item.picture.large} />}
              // title={<a href="https://ant.design">{item.id}</a>}
              // description={item.updatedAt}
              />
              <div>
                {item.updatedAt}
                <br />
                {
                  item?.content?.length > 10 ? `${item?.content.substring(0, 10)}...` : item?.content
                }

              </div>
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
};

export default IdeaList;