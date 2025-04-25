import { Image, Text, View } from "@tarojs/components";
import "./thread.css";
import { format } from "timeago.js";
import Taro, { eventCenter } from "@tarojs/taro";
import { Thread_DETAIL_NAVIGATE } from "../utils";

export default function Thread(props) {
  const { title, member, last_modified, replies, node, tid, not_navi } = props;
  const time = format(last_modified * 1000, "zh");
  const usernameCls = `author ${not_navi ? "bold" : ""}`;

  const handleNavigate = () => {
    if (not_navi) return;
    eventCenter.trigger(Thread_DETAIL_NAVIGATE, props);
    Taro.navigateTo({
      url: "/pages/thread_detail/thread_detail",
    });
  };

  return (
    <View className="thread" onClick={handleNavigate}>
      <View className="info">
        <View>
          <Image src={member.avatar_large} className="avatar" />
        </View>
        <View className="middle">
          <View className={usernameCls}>{member.username}</View>
          <View className="replies">
            <Text className="mr10">{time}</Text>
            <Text>评论 {replies}</Text>
          </View>
        </View>
        <View className="node">
          <Text className="tag">{node.title}</Text>
        </View>
      </View>
      <Text className="title">{title}</Text>
    </View>
  );
}
