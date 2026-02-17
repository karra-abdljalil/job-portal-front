import { Input } from "@/components/ui/input";

export const ApplicationHeader = ({ 
  title, 
  para, 
  placeholder, 
   value,onChange
}) => {

  return (
    <header className="w-full bg-white dark:bg-neutral-900  border-b border-gray-300 pb-8 px-10">
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        
        <div className="space-y-2">
          <h1 className="text-3xl md:text-3xl font-bold text-neutral-900 capitalize ">
            {title}
          </h1>
          <p className="text-sm text-neutral-500 max-w-xl">
            {para}
          </p>
        </div>

        <div className="w-full md:w-80">
          <Input
            type="search"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="h-12  rounded-xl focus-visible:ring-2 focus-visible:ring-primary capitalize"
            
          />
        </div>

      </div>
    </header>
  );
};
