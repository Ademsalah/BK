type Props = {
  title: string;
  onClick?: () => void;
};

export default function Button({ title, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="bg-[#07173b] text-white py-2 rounded-full w-full hover:opacity-90 transition"
    >
      {title}
    </button>
  );
}
