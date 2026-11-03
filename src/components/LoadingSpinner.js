export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-amber-600"></div>
    </div>
  );
}
