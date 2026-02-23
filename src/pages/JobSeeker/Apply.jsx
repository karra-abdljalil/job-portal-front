import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apply } from "@/Redux/applicationSlice";
import { fetchMyCvs } from "@/Redux/cvSlice";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldTitle,
} from "@/components/ui/field";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { formatRelativeDate } from "@/constants/function";

export default function ApplyButton({ jobId = '34e24c58-c591-4f0d-b97b-0690146634f2'}) {
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.applications);
  const cvs = useSelector((state) => state.cv.items);

  const [selectedCv, setSelectedCv] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      dispatch(fetchMyCvs());
    }
  }, [dispatch, open]);

  const handleSubmit = async () => {
    if (!selectedCv) return;

    const result = await dispatch(
      apply({ jobId, cvId: selectedCv })
    );

    if (!result.error) {
      setOpen(false);
      setSelectedCv("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Apply</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Your CV</DialogTitle>
        </DialogHeader>

        <div >
          {cvs?.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No CVs found. Please upload one first.
            </p>
          )}

          <RadioGroup
            value={selectedCv}
            onValueChange={setSelectedCv}
            
          >
            {cvs?.map((cv) => (
              <Field key={cv.cv_id} orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{cv.file_name}</FieldTitle>
                  <FieldDescription>
                    {formatRelativeDate(cv.uploaded_at)}
                  </FieldDescription>
                </FieldContent>

                <RadioGroupItem
                  value={String(cv.cv_id)}
                  id={`cv-${cv.cv_id}`}
                />
              </Field>
            ))}
          </RadioGroup>

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!selectedCv || loading}
          >
            {loading ? "Applying..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}