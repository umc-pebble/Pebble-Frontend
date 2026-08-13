type CompletedCategoryCardProps = {
  title: string;
  imageUrl: string | null;
  color: string;
  onClick?: () => void;
};

export const CompletedCategoryCard = ({
  title,
  imageUrl,
  color,
  onClick,
}: CompletedCategoryCardProps): JSX.Element => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative h-[240px] overflow-hidden rounded-token-s text-left transition-transform duration-200 hover:-translate-y-1 sm:h-[280px] lg:h-[298px] focus-visible:ring-2 focus-visible:ring-border-primary"
      style={{ backgroundColor: color }}
      aria-label={`${title} 상세 보기`}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent px-4 pb-4 pt-16">
        <h3 className="text-body-01-sb text-fill-inverse dark:text-text-strong">
          {title}
        </h3>
      </div>
    </button>
  );
};
