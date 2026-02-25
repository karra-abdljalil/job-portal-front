import { PublicHeader } from "@/components/common/Headers/PublicHeader";
import { ButtonRedirect } from "@/components/common/Ui/ButtonRedirect";

export const Publicpage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue to-indigo-50">
      
      {/* Header */}
      <PublicHeader />

      <section className="max-w-7xl mx-auto px-6 py-20 flex items-center justify-between gap-20 ">
        
        {/* LEFT SIDE */}
        <div className="flex-1">
          
          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            NEXT GEN AI RECRUITING
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-extrabold  text-gray-900">
            The Future of{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Hiring
            </span>{" "}
            is Intelligent
          </h1>

          {/* Paragraph */}
          <p className="mt-6 text-lg text-gray-600 max-w-xl leading-relaxed">
            Experience the most advanced AI-driven job platform. We match talent
            with opportunities using predictive analytics and smart skill mapping.
          </p>

          {/* Search Box */}
          <div className="mt-8 flex items-center bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-lg">
            <input
              type="text"
              placeholder="Find your next role..."
              className="flex-1 px-6 py-4 outline-none text-gray-700"
            />
            <ButtonRedirect link={'/register?role=job_seeker'}  buttonName={'Search'} style={"mx-3 px-6 py-4 text-white bg-blue-500 font-medium hover:text-white  hover:bg-blue-500 border  rounded-xl"}/>
            <ButtonRedirect link={'/register?role=employer'}  buttonName={'Post a Job'} style={"mx-3 px-6 py-4 text-gray-800 bg-white font-medium hover:text-gray-800  hover:bg-white border border-gray-300 rounded-xl"}/>
              
           
          </div>
        </div>

        {/* RIGHT SIDE - AI CARD */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
            
            <div className="flex gap-2 mb-6">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>

            {/* Candidate 1 */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl mb-4">
              <div>
                <p className="font-semibold text-gray-800">Jane Doe</p>
                <p className="text-sm text-gray-500">Senior Product Designer</p>
              </div>
              <span className="text-green-600 text-sm font-semibold">
                98% Match
              </span>
            </div>

            {/* Candidate 2 */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl mb-6">
              <div>
                <p className="font-semibold text-gray-800">Alex Smith</p>
                <p className="text-sm text-gray-500">UX Researcher</p>
              </div>
              <span className="text-blue-600 text-sm font-semibold">
                85% Match
              </span>
            </div>

            {/* Predictive Score */}
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-600">Predictive Hiring Score</p>
                <p className="font-bold text-blue-600">A+</p>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div className="h-2 w-[85%] bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};