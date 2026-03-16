"use client"

import { useEffect, useState } from "react"
import { fetchAllUsers } from "@/api/admin/users/fetchAllUsers"
import { deleteUser } from "@/api/admin/users/deleteUser"
import { blockUser } from "@/api/admin/users/blockUser"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {Trash2, CircleX,ShieldCheck } from 'lucide-react'
const UsersPage = () => {

  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const limit = 10

  const loadUsers = async () => {
    try {

      const data = await fetchAllUsers({
        search,
        role,
        page,
        limit
      })

      setUsers(data.users)
      setTotal(data.total)

    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [page, role])

  const handleSearch = () => {
    setPage(1)
    loadUsers()
  }

  const handleDelete = async (id) => {
    await deleteUser(id)
    loadUsers()
  }

  const handleBlock = async (id, isBlocked) => {
    await blockUser(id, isBlocked)
    loadUsers()
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Users Management</h1>

      {/* Filters */}

      <div className="flex gap-4">

        <Input
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-md px-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="job_seeker">Job Seeker</option>
          <option value="employer">Employer</option>
          <option value="admin">Admin</option>
        </select>

        <Button onClick={handleSearch}>
          Search
        </Button>

      </div>

      {/* Users Table */}

      <div className="border rounded-lg">

        <table className="w-full text-sm">

          <thead className="border-b bg-muted">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>

            {users.map((user) => (
              <tr key={user.id} className="border-b">

                <td className="p-3">{user.full_name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>

                <td className="p-3">
                  {user.email_verified ? (
                    <span className="text-green-500">Verfied</span>
                  ) : (
                    <span className="text-red-600">unverified</span>
                  )}
                </td>

                <td className="p-3 text-right space-x-2">

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleBlock(user.id, user.is_blocked)}
                  >
                    {user.is_blocked ?   <ShieldCheck  />:<CircleX />}
                    {user.is_blocked ? 'Unblock' : 'Block'}
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 />
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
          {total} users
        </p>

        <div className="space-x-2">

          <Button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>

          <span className="text-sm">
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

export default UsersPage