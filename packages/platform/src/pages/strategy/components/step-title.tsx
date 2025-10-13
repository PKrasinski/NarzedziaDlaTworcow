interface StepTitleProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const StepTitle = ({ icon, children, className = "" }: StepTitleProps) => {
  return (
    <div className={`flex items-center gap-3 mb-6 ${className}`}>
      <div className="text-blue-600">{icon}</div>
      <h2 className="text-xl font-semibold text-gray-900">{children}</h2>
    </div>
  );
};