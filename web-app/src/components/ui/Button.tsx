type Props = {
  title: string;
  onClick?: () => void;
  className?: string;
};

export default function Button({ title, onClick,className }: Props) {
  return (
    <button
      onClick={onClick}
      className={
        className ??
        "bg-[#07173b] text-white py-2 rounded-full w-full hover:opacity-90 transition"
      }
    >
      {title}
    </button>
  );
}
