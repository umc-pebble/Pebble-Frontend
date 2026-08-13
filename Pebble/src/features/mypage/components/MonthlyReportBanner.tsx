import { useEffect, useState } from "react";

import ChevronRightIcon from "@/assets/icons/chevron-right.svg?react";
import reportPebble from "@/assets/mypage/report-banner/pebble.png";
import reportPebbleShadow from "@/assets/mypage/report-banner/shadow.svg";
import { getLatestReport } from "@/features/report/api/reportApi";

type MonthlyReportBannerProps = {
  onOpenReport: () => void;
};

type ReportBannerData = {
  month: string;
};

const getReportMonth = (report: ReportBannerData) => {
  const month = Number(report.month.split("-")[1]);
  return Number.isInteger(month) && month >= 1 && month <= 12 ? month : null;
};

const createPreviewReport = (): ReportBannerData => {
  const now = new Date();
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  return {
    month: `${previousMonth.getFullYear()}-${String(
      previousMonth.getMonth() + 1,
    ).padStart(2, "0")}`,
  };
};

/**
 * 날짜와 리포트 생성 여부에 관계없이 마이페이지에 항상 노출됩니다.
 * 서버 리포트가 없거나 조회에 실패하면 계산한 저번 달을 안내합니다.
 */
export const MonthlyReportBanner = ({
  onOpenReport,
}: MonthlyReportBannerProps): JSX.Element | null => {
  const [report, setReport] = useState<ReportBannerData>(createPreviewReport);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    void getLatestReport(controller.signal)
      .then((response) => {
        if (isActive && response) {
          setReport({ month: response.reportMeta.month });
        }
      })
      .catch(() => {
        // 배너는 유지하고 계산한 저번 달을 그대로 안내합니다.
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  const reportMonth = getReportMonth(report);

  return (
    <button
      type="button"
      onClick={onOpenReport}
      className="relative mx-auto mb-[-16px] mt-6 flex h-[150px] w-full max-w-[640px] items-end justify-end gap-3 overflow-hidden rounded-[20px] bg-btn-primary px-5 py-6 text-left shadow-[0_2px_10px_rgba(23,23,23,0.10)] transition-opacity hover:opacity-95 sm:mb-[-24px] sm:mt-[28px] sm:h-[130px] sm:gap-[20px] sm:px-[100px] sm:py-[32px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-btn-primary"
      aria-label={`${reportMonth ? `${reportMonth}월 ` : ""}리포트 보러 가기`}
    >
      <span
        className="absolute left-2 top-10 h-[110px] w-[150px] opacity-60 sm:left-[32px] sm:top-[28px] sm:w-[182px] sm:opacity-100"
        aria-hidden="true"
      >
        <img
          src={reportPebbleShadow}
          alt=""
          className="absolute bottom-[6px] left-[16px] h-[24px] w-[140px]"
        />
        <img
          src={reportPebble}
          alt=""
          className="absolute left-[14px] top-[8px] h-[84px] w-[154px] object-contain"
        />
      </span>

      <span className="relative flex flex-col gap-[8px]">
        <strong className="text-[18px] font-semibold leading-[130%] tracking-[-0.18px] text-fill-inverse sm:whitespace-nowrap sm:text-[24px] sm:tracking-[-0.24px]">
          이번 달의 기록이 완성되었어요!
        </strong>
        <span className="flex items-center gap-[4px] text-[14px] font-medium leading-[150%] tracking-[-0.14px] text-btn-quaternary sm:text-[18px] sm:tracking-[-0.18px]">
          {reportMonth ? `${reportMonth}월 리포트 보러가기` : "리포트 보러가기"}
          <ChevronRightIcon className="size-[24px] shrink-0 text-btn-quaternary" />
        </span>
      </span>
    </button>
  );
};
