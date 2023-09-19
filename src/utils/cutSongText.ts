// 00:00.000
const formatTime = (time: string) => {
  const minute = +time.split(":")[0];
  const second = time.split(":")[1];
  return minute * 60 + +second - 0.3;
};

export const cutSongText = (text: string) => {
  let time = "";
  let songText = "";
  if (text.includes("]")) {
    const index = text.indexOf("]");
    const lastIndex = text.lastIndexOf("]");
    if (index === lastIndex) {
      time = text.substring(1, index);
      songText = text.substring(index + 1);
    } else {
      time = text.substring(0, index);
      let time2 = text.substring(index + 1, lastIndex);
      songText = text.substring(lastIndex + 1);
      return [
        {
          time,
          songText,
        },
        {
          time: time2,
          songText,
        },
      ];
    }
  } else {
    songText = text;
  }
  return [
    {
      time: formatTime(time),
      songText,
    },
  ];
};
