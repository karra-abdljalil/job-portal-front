import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyApplications } from "../../../Redux/applicationSlice";
import ApplicationCard from "../../common/cards/applicationCard";
import { ApplicationHeader } from "../../common/Headers/ApplicationHeader";

export default function MyApplicationsPage() {
  const dispatch = useDispatch();
  const { items: applications, loading, error } = useSelector(
    (state) => state.applications
  );

  const [search,setSearch] = useState('')

  useEffect(() => {
    const userId = "59d04c22-9d7c-4be5-8f61-16da54552bbe";
    dispatch(fetchMyApplications(userId));
  }, [dispatch]);

  const filterApp = applications.filter((app)=>{
    const titlematch = app.Job.job_title.toLowerCase().includes(search.toLowerCase())
    const statusmatch = app.status.toLowerCase().includes(search.toLowerCase())
    return titlematch || statusmatch
  })

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="py-4 px-8">
      <ApplicationHeader
        title={"My Applications"}
        para={"Track and manage your job applications"}
        placeholder={"Search by job title or by status"}
        onChange={(e) => {setSearch(e.target.value)}}
      />
      <main>
        {filterApp.length === 0 ? (
          <p>You haven't applied to any jobs yet.</p>
        ) : (
          filterApp.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))
        )}
      </main>
    </div>
  );
}
