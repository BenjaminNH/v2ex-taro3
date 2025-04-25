import { View } from "@tarojs/components";
import Loading from "./loading";
import Thread from "./thread";

export default function ThreadList({ loading = true, threads = [] }) {
  const elements = threads.map((thread, index) => {
    return (
      <Thread
        key={thread.id}
        node={thread.node}
        title={thread.title}
        last_modified={thread.last_modified}
        tid={thread.id}
        member={thread.member}
        replies={thread.replies}
      />
    );
  });

  return loading ? (
    <Loading />
  ) : (
    <View className="thread-list">{elements}</View>
  );
}
