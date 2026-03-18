'use client'
import { fetchDashboardStats } from '@/api/admin/fetchDashboardStats'
import DashboardUI from './DashboardUi'
import { useEffect, useState } from 'react'

const AdminDashboard = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchDashboardStats().then((response) => {
      setData(response)
    })

  }, [])
    if (!data) return <p>Loading...</p>

  return <DashboardUI data={data} />
}

export default AdminDashboard