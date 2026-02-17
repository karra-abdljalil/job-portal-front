import { PublicHeader } from "@/components/common/Headers/PublicHeader";
import { Profil } from "@/components/layouts/Profil";
import jobIcon from "@/assets/searchjob.png";
import employeerIcon from "@/assets/job.png";

export const Publicpage = () => {
  const listJob = [
    "Browse thousands of jobs",
    "Upload your CV",
    "Get personalized recommendations",
    "Track your applications",
  ];

  const listEmployeer = [
    "Build your employer brand",
    "Manage applications easily",
    "Access qualified candidates",
    "Post job opportunities",
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <PublicHeader />

      {/* Hero section */}
      <section className="max-w-4xl mx-auto text-center py-16 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Empowering your professional journey
        </h2>
        <p className="text-gray-600 text-justify text-lg">
          Whether you are looking for your next challenge or building your dream
          team, we are here to help.
        </p>
      </section>

      {/* Profiles section */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <Profil
            src={jobIcon}
            alt="job icon"
            buttonName_button="For job seekers"
            buttonName_join="Join as candidate"
            styleButton="bg-sky-100 text-blue-800  boredr border-blue-800 px-4 py-2 rounded-xl"
            sous_title="Find your dream job"
            para="Discover opportunities that match your skills and ambitions."
            list={listJob}
            JoinStyle="w-full py-2 bg-blue-800 text-white font-semibold text-center text-md rounded-xl"
            redirectionto="/login"
          />

          <Profil
            src={employeerIcon}
            alt="employer icon"
            buttonName_button="For employers"
            buttonName_join="Join as employer"
            styleButton="bg-gray-100 text-gray-800 boredr  border-gray-800 px-4 py-2 rounded-xl"
            sous_title="Hire top talent"
            para="Find and manage the perfect candidates for your team."
            list={listEmployeer}
            JoinStyle="w-full py-2 bg-blue-800 text-white font-semibold text-center text-md rounded-xl"
            redirectionto="/login"
          />

        </div>
      </section>
    </main>
  );
};
