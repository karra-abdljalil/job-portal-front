"use client"

import { useEffect, useState } from "react"
import { fetchJobs } from "@/api/admin/jobs/fetchJobs"
import { updateJobStatus } from "@/api/admin/jobs/updateJobStatus"
import { deleteJob } from "@/api/admin/jobs/deleteJob"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const JobsPage = () => {

  const [jobs, setJobs] = useState([])
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState("")
  const [keyword, setKeyword] = useState("")
  const [total, setTotal] = useState(0)

  const limit = 10

  const loadJobs = async () => {

    const data = await fetchJobs({
      page,
      limit,
      status,
      keyword
    })

    setJobs(data.jobs)
    setTotal(data.total)

  }

  useEffect(() => {
    loadJobs()
  }, [page, status])

  const handleSearch = () => {
    setPage(1)
    loadJobs()
  }

  const handleApprove = async (id) => {
    await updateJobStatus(id, "approved")
    loadJobs()
  }

  const handleReject = async (id) => {
    await updateJobStatus(id, "rejected")
    loadJobs()
  }

  const handleDelete = async (id) => {
    await deleteJob(id)
    loadJobs()
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Jobs Management</h1>

      {/* Filters */}

      <div className="flex gap-4">

        <Input
          placeholder="Search job..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <select
          className="border rounded-md px-3"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <Button onClick={handleSearch}>
          Search
        </Button>

      </div>

      {/* Table */}

      <div className="border rounded-lg">

        <table className="w-full text-sm">

          <thead className="border-b bg-muted">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>

            {jobs.map((job) => (
              <tr key={job.id} className="border-b">

                <td className="p-3">{job.title}</td>
                <td className="p-3">{job.company_name}</td>

                <td className="p-3">
                  {job.status === "pending" && (
                    <span className="text-yellow-500">Pending</span>
                  )}
                  {job.status === "approved" && (
                    <span className="text-green-600">Approved</span>
                  )}
                  {job.status === "rejected" && (
                    <span className="text-red-500">Rejected</span>
                  )}
                </td>

                <td className="p-3 text-right space-x-2">

                  <Button
                    size="sm"
                    onClick={() => handleApprove(job.id)}
                  >
                    Approve
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleReject(job.id)}
                  >
                    Reject
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(job.id)}
                  >
                    Delete
                  </Button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      <div className="flex justify-between items-center">

        <p className="text-sm text-muted-foreground">
          {total} jobs
        </p>

        <div className="space-x-2">

          <Button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>

          <span>
            Page {page} / {totalPages}
          </span>

          <Button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>

        </div>

      </div>

    </div>
  )
}

export default JobsPage