type Props = {
  label?: string;
  type?: string;
  placeholder?: string;
  onChange?: (e: any) => void;
  textcolor?: string;
};

export default function Input({
  label,
  type = "text",
  placeholder,
  onChange,
  textcolor,
}: Props) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        className={`px-4 py-2 rounded-full border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          textcolor ? textcolor : "text-black"
        }`}
      />
    </div>
  );
}
