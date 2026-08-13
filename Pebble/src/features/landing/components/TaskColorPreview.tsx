interface TaskColorPreviewItem {
  title: string;
  left: number;
  top: number;
  width: number;
  height: number;
  backgroundColor: string;
  shadow: string;
  barWidth: number;
  barHeight: number;
  textWidth: number;
  textMaxHeight: number;
  fontSize: number;
}

const taskColorPreviewItems: TaskColorPreviewItem[] = [
  {
    title: '참가자 모집',
    left: 784,
    top: 273,
    width: 355.75,
    height: 41.24,
    backgroundColor: '#FFEFAD',
    shadow: '0_0_23.17px_rgba(23,23,23,0.05)',
    barWidth: 6.62,
    barHeight: 38.07,
    textWidth: 316.02,
    textMaxHeight: 34.76,
    fontSize: 21.52,
  },
  {
    title: '참가 신청 오픈',
    left: 824,
    top: 345,
    width: 309.57,
    height: 38.14,
    backgroundColor: '#FFF6D5',
    shadow: '0_0_21.24px_rgba(23,23,23,0.05)',
    barWidth: 6.07,
    barHeight: 34.9,
    textWidth: 273.15,
    textMaxHeight: 31.86,
    fontSize: 19.72,
  },
  {
    title: '참석 인원 확인',
    left: 810,
    top: 409,
    width: 309.57,
    height: 38.14,
    backgroundColor: '#FFF6D5',
    shadow: '0_0_21.24px_rgba(23,23,23,0.05)',
    barWidth: 6.07,
    barHeight: 34.9,
    textWidth: 273.15,
    textMaxHeight: 31.86,
    fontSize: 19.72,
  },
];

export function TaskColorPreview() {
  return (
    <>
      <div className="absolute left-[764px] top-[185px] flex h-[68px] w-[374px] items-center gap-[10.63px] rounded-[21.25px] bg-fill-inverse py-[12.75px] pl-[21.25px] pr-[12.75px] shadow-[0_0_28px_rgba(23,23,23,0.05)]">
        <div className="flex h-[42.5px] w-[246.5px] items-center gap-[12.75px]">
          <span className="h-[42.5px] w-[8.5px] shrink-0 rounded-[4.25px] bg-[#FFDD47]" />

          <strong className="max-w-[267.75px] truncate text-[25.5px] font-semibold leading-[130%] tracking-[-0.01em] text-text-strong">
            행사준비
          </strong>
        </div>
      </div>

      {taskColorPreviewItems.map((task) => (
        <div
          key={task.title}
          className="absolute overflow-hidden rounded-token-xs"
          style={{
            left: task.left,
            top: task.top,
            width: task.width,
            height: task.height,
            backgroundColor: task.backgroundColor,
            boxShadow: task.shadow.replaceAll('_', ' '),
          }}
        >
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-token-xs bg-[#FFDD47]"
            style={{
              width: task.barWidth,
              height: task.barHeight,
            }}
          />

          <span
            className="absolute left-[20px] top-1/2 -translate-y-1/2 truncate font-medium leading-[130%] tracking-[-0.01em] text-[#241D00]"
            style={{
              width: task.textWidth,
              maxHeight: task.textMaxHeight,
              fontSize: task.fontSize,
            }}
          >
            {task.title}
          </span>
        </div>
      ))}
    </>
  );
}