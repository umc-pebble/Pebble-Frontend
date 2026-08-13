import CheckIcon from '@/assets/icons/Check.svg?react';
import ChevronUpIcon from '@/assets/icons/chevron-up.svg?react';
import EyeOnIcon from '@/assets/icons/eye-on.svg?react';

const previewTasks = [
  {
    title: '1차 MVP 완성',
    period: '6/8~6/11',
    done: false,
    muted: false,
    rowWidth: 327.27,
    offsetLeft: 0,
    barColor: '#B9B5F7',
  },
  {
    title: '핵심 화면 정리',
    period: '6/8~6/9',
    done: true,
    muted: true,
    rowWidth: 315,
    offsetLeft: 12.27,
    barColor: '#DAD9FB',
  },
  {
    title: '캘린더 연결',
    period: '6/10',
    done: false,
    muted: false,
    rowWidth: 315,
    offsetLeft: 12.27,
    barColor: '#DAD9FB',
  },
  {
    title: '계획서 작성',
    period: '6/12',
    done: false,
    muted: false,
    rowWidth: 327.27,
    offsetLeft: 0,
    barColor: '#B9B5F7',
  },
];

export function CategoryPreviewCard() {
  return (
    <div className="pointer-events-none absolute left-[780px] top-[130px] h-[364.09px] w-[360px] overflow-hidden rounded-[20.45px] bg-fill-inverse shadow-[0_0_22.91px_rgba(23,23,23,0.05)]">
      <div className="flex h-[69.55px] w-[360px] items-center justify-between rounded-[20.45px] bg-fill-inverse py-[12.27px] pl-[20.45px] pr-[12.27px]">
        <div className="flex items-center gap-[8.18px]">
          <span className="h-[40.91px] w-[8.18px] rounded-[4.09px] bg-[#8B84F2]" />

          <span className="max-w-[257.73px] truncate text-[24.55px] font-semibold leading-[130%] tracking-[-0.01em] text-text-strong">
            사이드 프로젝트
          </span>
        </div>

        <div className="flex h-[45px] w-[90px] items-center justify-center">
          <span className="flex size-[45px] items-center justify-center rounded-token-s">
            <ChevronUpIcon
              className="size-6 [&_*]:stroke-[#737373]"
              aria-hidden="true"
            />
          </span>

          <span className="flex size-[45px] items-center justify-center rounded-token-s">
            <EyeOnIcon
              className="h-[14.32px] w-[19.52px] [&_*]:stroke-[#737373]"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>

      <div className="h-[294.55px] w-[360px]">
        <div className="flex h-[220.91px] w-[360px] flex-col gap-[8.18px] pl-[20.45px] pr-[12.27px]">
          {previewTasks.map((task) => (
            <div
              key={task.title}
              className="flex h-[49.09px] items-center justify-between gap-[8.18px] rounded-[12.27px] bg-fill-inverse py-[8.18px] pr-[8.18px]"
              style={{
                width: task.rowWidth,
                minWidth: task.rowWidth,
                maxWidth: 327.27,
                marginLeft: task.offsetLeft,
              }}
            >
              <div className="flex h-[32.73px] w-[206.09px] items-center gap-[8.18px]">
                <span
                  className="h-[32.73px] w-[8.18px] rounded-[4.09px]"
                  style={{ backgroundColor: task.barColor }}
                />

                <span
                  className={[
                    'max-w-[194.32px] truncate text-[16.36px] font-medium leading-[150%] tracking-[-0.01em]',
                    task.muted
                      ? 'text-text-teritary line-through'
                      : 'text-text-strong',
                  ].join(' ')}
                >
                  {task.title}
                </span>
              </div>

              <div className="flex h-[25px] w-[104.82px] items-center justify-end gap-[12.27px]">
                <span className="whitespace-nowrap text-right text-[16.36px] font-medium leading-[150%] tracking-[-0.01em] text-text-teritary">
                  {task.period}
                </span>

                <span
                  className={[
                    'flex size-[24.55px] items-center justify-center rounded-token-xs',
                    task.done
                      ? 'bg-btn-primary'
                      : 'border-[1.02px] border-border-secondary bg-fill-inverse',
                  ].join(' ')}
                >
                  {task.done ? (
                    <CheckIcon
                      className="h-[20.45px] w-[20.45px] [&_*]:stroke-white"
                      aria-hidden="true"
                    />
                  ) : null}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="h-[73.64px] w-[360px] px-[20.45px] py-[12.27px]">
          <button
            type="button"
            tabIndex={-1}
            className="flex h-[49.09px] w-[319.09px] items-center justify-center rounded-[12.27px] bg-btn-quaternary text-[16.36px] font-medium leading-[150%] tracking-[-0.01em] text-text-secondary"
          >
            일정 추가하기
          </button>
        </div>
      </div>
    </div>
  );
}