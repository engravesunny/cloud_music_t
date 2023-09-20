// 获取歌曲评论
import { getSongCommits } from "../../../api/songList.js";
export const limit = 25;

export const getCommits = async (id: string, page: number) => {
  let norComs: any[] = [];
  let hiComs: any[] = [];
  let ttl = 0;
  try {
    const { data } = await getSongCommits({
      id,
      limit,
      offset: page * limit,
    });
    (data.comments as any[]).map((item) => {
      norComs.push(item);
    });
    if (data.hotComments) {
      (data.hotComments as any[]).map((item) => {
        hiComs.push(item);
      });
    }
    ttl = data.total;
    return {
      norComs,
      hiComs,
      ttl,
    };
  } catch (error: any) {
    ElMessage.error(error.message);
  }
};
