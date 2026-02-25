import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/constants/function";
import view from "@/assets/view.png";
import Iconcv from "@/assets/cv.png";
import { useDispatch } from "react-redux";
import { downloadCv, setDefault, viewCv } from "@/Redux/cvSlice";
import download from "@/assets/download.png";

export const CvCard = ({ cv }) => {
  const dispatch = useDispatch();

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell className="font-medium capitalize  text-left">
        <img
          src={Iconcv}
          alt=" cv icon"
          className="w-4 h-4 inline-block mr-4 "
        />{" "}
        {cv.file_name}
      </TableCell>

      <TableCell className="text-muted-foreground text-center">
        {formatDate(cv.uploaded_at)}
      </TableCell>

      <TableCell className="text-muted-foreground text-center">
        <Button
          variant={cv.is_default ? "secondary" : "outline"}
          size="sm"
          disabled={cv.is_default}
          onClick={() => dispatch(setDefault(cv.cv_id))}
        >
          {cv.is_default ? "Default CV" : "Set as Default"}
        </Button>
      </TableCell>

      <TableCell className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            dispatch(viewCv(cv.cv_id));
          }}
        >
          <img src={view} alt="view cv" className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            dispatch(downloadCv({ id: cv.cv_id, fileName: cv.file_name }));
          }}
        >
          <img src={download} alt="download cv" className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
