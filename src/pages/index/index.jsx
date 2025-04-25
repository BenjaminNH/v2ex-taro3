import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { useEffect, useState } from "react";
import ThreadList from "../../components/thread_list";
import api from "../../utils/api";
import "./index.css";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      try {
        Taro.request({
          url: api.getLatestTopic(),
          success: (res) => {
            if (res.statusCode === 200) {
              setLoading(false);
              setThreads(res.data);
            }
          },
        });
      } catch (error) {
        Taro.showToast({
          title: "网络请求出错",
        });
      }
    };

    fetchData();
  });

  return (
    <View>
      <ThreadList loading={loading} threads={threads} />
    </View>
  );
}
