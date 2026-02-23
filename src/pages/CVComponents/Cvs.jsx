import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CvCard } from "@/components/common/cards/CvCard"
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CvModalDetail } from "@/components/Modal/CvModalDetail"

export const Cvs = ({cvs}) => {
 

  return (
    <section className="p-6">
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            My Uploaded CVs {' ('} {cvs.length} {')'}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {cvs.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">
              No CVs found
            </p>
          ) : (
            <Table className='table-auto'>
              <TableCaption className="text-muted-foreground">
                List of your uploaded resumes
              </TableCaption>

              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Name</TableHead>
                  <TableHead className="text-center" >Date</TableHead>
                  <TableHead className="text-center" >default</TableHead>

                  <TableHead className="text-center">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {cvs.map((cv) => (
                  <CvCard key={cv.cv_id} cv={cv} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <CvModalDetail />
    </section>
  )
}
