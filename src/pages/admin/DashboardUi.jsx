import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const DashboardUi = ({ data }) => {

  const stats = [
    { title: "Total Users", value: data.totalUsers },
    { title: "Total Companies", value: data.totalCompanies },
    { title: "Total Jobs", value: data.totalJobs },
    { title: "Total Applications", value: data.totalApplications },
  ]

  const jobStats = [
    { title: "Pending Jobs", value: data.pendingJobs },
    { title: "Approved Jobs", value: data.approvedJobs },
  ]

  return (
    <div className="p-6 space-y-8">

      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Job Status */}
      <div className="grid gap-4 md:grid-cols-2">
        {jobStats.map((stat, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Top Skills</CardTitle>
        </CardHeader>

        <CardContent>
          {data.topSkills.length === 0 ? (
            <p className="text-muted-foreground">No skills data available</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.topSkills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm rounded-full bg-muted"
                >
                  {skill.name} ({skill.count})
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}

export default DashboardUi