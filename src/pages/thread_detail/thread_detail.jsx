import Thread from "../../components/thread";
import { useState, useEffect } from "react";
import { GlobalState } from "../../utils";
import Taro from "@tarojs/taro";
import api from "../../utils/api";
import { format } from "timeago.js";
import Loading from "../../components/loading";
import { View, RichText, Image } from "@tarojs/components";

import "./thread_detail.css";

export default function ThreadDetail() {
  const [state, setState] = useState({
    loading: true,
    replies: [],
    content: "",
    thread: {},
  });

  useEffect(() => {
    setState((state) => ({
      ...state,
      thread: GlobalState.thread,
    }));

    const fetchData = async () => {
      try {
        const id = GlobalState.thread.tid;
        const [
          { data: replies },
          {
            data: [{ content_rendered }],
          },
        ] = await Promise.all([
          Taro.request({
            url: api.getReplies({
              topic_id: id,
            }),
          }),
          Taro.request({
            url: api.getTopics({
              id: id,
            }),
          }),
        ]);
        setState((state) => ({
          ...state,
          loading: false,
          replies,
          content: prettyHTML(content_rendered),
        }));
      } catch {
        Taro.showToast({
          title: "加载数据出错",
        });
      }
    };

    fetchData();
  }, []);

  const { loading, replies, content, thread } = state;

  const replieEL = replies.map((reply, index) => {
    const time = format(reply.last_modified * 1000, "zh");
    return (
      <View className="reply" key={reply.id}>
        <Image src={reply.member.avatar_large} className="avatar" />
        <View className="main">
          <View className="author">{reply.member.username}</View>
          <View className="time">{time}</View>
          <RichText nodes={reply.content} className="content"></RichText>
          <View className="floor">{index + 1} 楼</View>
        </View>
      </View>
    );
  });

  const contentEL = loading ? (
    <Loading />
  ) : (
    <View>
      <View className="main-content">
        <RichText nodes={content}></RichText>
      </View>
      <View className="replies">{replieEL}</View>
    </View>
  );

  return loading ? (
    <Loading />
  ) : (
    <View className="detail">
      <Thread
        node={thread.node}
        title={thread.title}
        last_modified={thread.last_modified}
        replies={thread.replies}
        tid={thread.id}
        member={thread.member}
        not_navi={true}
      />
      {contentEL}
    </View>
  );
}

function prettyHTML(str) {
  const lines = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];

  lines.forEach((line) => {
    const regex = new RegExp(`<${line}`, "gi");

    str = str.replace(regex, `<${line} class="line"`);
  });

  return str.replace(/<img/gi, '<img class="img"');
}
