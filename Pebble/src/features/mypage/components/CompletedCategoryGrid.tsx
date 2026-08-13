import { CompletedCategoryCard } from "./CompletedCategoryCard";
import type { Category } from "@/types";

type CompletedCategoryGridProps = {
  isCompact: boolean;
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
};

export const CompletedCategoryGrid = ({
  isCompact,
  categories,
  onSelectCategory,
}: CompletedCategoryGridProps): JSX.Element => {
  return (
    <section
      className={`relative z-20 mx-auto w-full max-w-[640px] bg-fill-inverse transition-[margin] duration-500 ease-in-out ${
        isCompact ? "mt-16" : "mt-12"
      } ${categories.length <= 6 ? "min-h-[calc(1000px-220px-64px)]" : ""}`}
      aria-labelledby="my-category-heading"
    >
      <div
        className={`sticky z-30 -mx-1 bg-fill-inverse px-1 pb-3 before:absolute before:-inset-x-1 before:-top-1 before:h-1 before:bg-fill-inverse before:content-[''] ${
          isCompact ? "top-[220px] pt-8" : "top-0 pt-0"
        }`}
      >
        <h2
          id="my-category-heading"
          className="text-title-02-sb text-text-strong"
        >
          완료한 카테고리
        </h2>
      </div>

      {categories.length === 0 ? (
        <div className="flex h-[420px] flex-col items-center justify-center text-center">
          <p className="text-title-03-sb text-text-secondary">
            완료한 카테고리가 없어요
          </p>
          <p className="mt-5 text-body-01-m text-text-teritary">
            카테고리를 완료하면 이곳에서 확인할 수 있어요
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {categories.map((category) => (
            <CompletedCategoryCard
              key={category.id}
              title={category.title}
              imageUrl={category.imageUrl ?? null}
              color={category.accent}
              onClick={() => onSelectCategory(category.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};
