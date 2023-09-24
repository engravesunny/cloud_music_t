export interface singerInfo {
  avatar: string;
  name: string;
  nickname: string[];
  dataCount: {
    songsCount: string | number;
    albumsCount: string | number;
    MVCount: string | number;
  };
}
