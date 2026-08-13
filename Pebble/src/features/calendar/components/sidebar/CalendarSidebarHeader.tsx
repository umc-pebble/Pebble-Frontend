import CardViewIcon from "@/assets/icons/Card-view.svg?react";
import ListViewIcon from "@/assets/icons/List-view.svg?react";

type CalendarSidebarHeaderProps = {
  monthLabel: string;
  viewMode: "card" | "list";
  onChangeViewMode: (viewMode: "card" | "list") => void;
};

export const CalendarSidebarHeader = ({
  monthLabel,
  viewMode,
  onChangeViewMode,
}: CalendarSidebarHeaderProps): JSX.Element => {
  return (
    <header className="flex w-full h-[100px] shrink-0 items-center justify-between pt-token-xl pb-token-l px-token-l bg-fill-inverse z-10 rounded-tr-[32px]">
      <div className="text-heading-02 text-text-strong">
        {monthLabel}
      </div>
      <div
        className="inline-flex items-center gap-1 p-1 bg-btn-quaternary rounded-token-s"
        role="tablist"
        aria-label="보기 전환"
      >
        <button
          type="button"
          role="tab"
          aria-selected={viewMode === "card"}
          aria-label="카드 보기"
          onClick={() => onChangeViewMode("card")}
          className={`flex h-10 items-center justify-center rounded-[9px] px-3 py-2 transition-colors ${
            viewMode === "card"
              ? "bg-fill-inverse text-text-primary shadow-[0px_0px_4px_0px_rgba(23,23,23,0.1)]"
              : "text-text-teritary"
          }`}
        >
          <CardViewIcon className="w-6 h-6" />
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={viewMode === "list"}
          aria-label="리스트 보기"
          onClick={() => onChangeViewMode("list")}
          className={`flex h-10 items-center justify-center rounded-[9px] px-3 py-2 transition-colors ${
            viewMode === "list"
              ? "bg-fill-inverse text-text-primary shadow-[0px_0px_4px_0px_rgba(23,23,23,0.1)]"
              : "text-text-teritary"
          }`}
        >
          <ListViewIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};
