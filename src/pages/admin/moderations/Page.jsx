"use client";

import { useEffect, useState } from "react";
import {
  getListOfJobModerations,
  updateJobStatus,
  updateJobActivity,
  deleteJobModeration
} from "@/api/admin/jobModeration";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function JobModerationPage() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const loadJobs = async () => {
    const data = await getListOfJobModerations({ search, status, page, limit });
    setJobs(data.jobs);
    setTotal(data.total);
  };

  useEffect(() => {
    loadJobs();
  }, [page, status]);

  const handleApprove = async (id) => {
    await updateJobStatus(id, "approved");
    loadJobs();
  };

  const handleReject = async (id) => {
    await updateJobStatus(id, "rejected");
    loadJobs();
  };

  const handleToggleActivity = async (id, isActive) => {
    await updateJobActivity(id, !isActive);
    loadJobs();
  };

  const handleDelete = async (id) => {
    await deleteJobModeration(id);
    loadJobs();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Job Moderation</h1>

      <div className="flex gap-4">
        <Input
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <Button onClick={() => { setPage(1); loadJobs(); }}>Search</Button>
      </div>

      <table className="w-full text-sm border rounded-lg">
        <thead className="border-b bg-muted">
          <tr>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Active</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="border-b">
              <td className="p-3">{job.title}</td>
              <td className="p-3">{job.status}</td>
              <td className="p-3">{job.isActive ? "Yes" : "No"}</td>
              <td className="p-3 text-right space-x-2">
                <Button size="sm" onClick={() => handleApprove(job.id)}>Approve</Button>
                <Button size="sm" variant="secondary" onClick={() => handleReject(job.id)}>Reject</Button>
                <Button size="sm" variant="secondary" onClick={() => handleToggleActivity(job.id, job.isActive)}>
                  {job.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(job.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}