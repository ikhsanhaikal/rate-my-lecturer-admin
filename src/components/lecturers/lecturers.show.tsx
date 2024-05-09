import {
  Avatar,
  Box,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import {
  CreateBase,
  Labeled,
  required,
  SelectInput,
  SimpleForm,
  useCreate,
  useGetList,
  useGetOne,
} from "react-admin";
import { Link, useMatch, useNavigate, useParams } from "react-router-dom";
import YearPickerInput from "../YearPickerInput";
import ReviewsByLecturerList from "./reviewsbylecturer.list";
import CoursesByLecturerList from "./coursesbylecturer.list";

export default function LecturerShow() {
  const { id } = useParams();
  // const  redirect  = useRedirect();
  // console.log("lecturer show render called");
  const navigate = useNavigate();
  const match = useMatch("/lecturers/:id/courses/create");

  const [open, setOpen] = useState(false);

  const { data: profile, isLoading } = useGetOne("lecturers", { id }, {});

  useEffect(() => {
    if (match !== null) {
      setOpen(true);
    }
  }, [match]);

  if (isLoading) {
    return <>loading..</>;
  }

  return (
    <Stack spacing={3}>
      <Stack justifyContent="end" direction="row">
        <Button
          variant="contained"
          sx={{ width: "fit-content" }}
          component={Link}
          to={`/lecturers/${id}/edit`}
        >
          Edit
        </Button>
      </Stack>
      <Card variant="outlined">
        <Stack padding={2} direction="row" spacing={2}>
          <Avatar
            src={`https://ui-avatars.com/api/?name=${profile.name}&background=random`}
            variant="square"
            sx={{ width: 150, height: 150 }}
          />
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Labeled label="Info">
              <>
                <Typography variant="h6">{profile.name}</Typography>
                <Typography variant="subtitle1">{profile.email}</Typography>
              </>
            </Labeled>
            <Labeled label="Lab">
              <Typography variant="h6">
                {profile.lab?.name ?? "belum di assign ke lab"}
              </Typography>
            </Labeled>
            <Labeled label="Rating">
              <Rating readOnly value={profile.rating} />
            </Labeled>
            <Box>
              {profile.tags.map((tag) => (
                <Chip key={tag.id} label={tag.name} size="small" />
              ))}
            </Box>
          </Stack>
        </Stack>
      </Card>

      <CoursesByLecturerList id={id} open={open} />

      <ReviewsByLecturerList id={id} />

      <AssignCourseFormDialog
        id={id}
        navigate={navigate}
        open={open}
        setOpen={setOpen}
      />
    </Stack>
  );
}

function AssignCourseFormDialog({ id, navigate, open, setOpen }) {
  const [create] = useCreate();

  const handleClose = () => {
    // navigate(`/lecturers/${id}/show`, { replace: true });
    navigate(`/lecturers/${id}/show`);
    setOpen(false);
  };

  const { data } = useGetList("subjects");

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Assign course</DialogTitle>
      <DialogContent>
        <CreateBase resource="courses" redirect={false}>
          <SimpleForm
            sx={{ width: 300 }}
            onSubmit={(data) => {
              create(
                "courses",
                {
                  data: {
                    year: data.year.$d,
                    semester: data.semester,
                    subject: data.subject.id,
                    lecturer: id,
                  },
                },
                {
                  onSettled: () => {
                    handleClose();
                  },
                }
              );
            }}
          >
            <SelectInput
              source="semester"
              fullWidth
              validate={[required()]}
              choices={[
                { id: 1, name: "GENAP" },
                { id: 2, name: "GANJIL" },
              ]}
              optionValue="name"
            />
            <SelectInput
              fullWidth
              validate={[required()]}
              source="subject.id"
              optionText="name"
              label="Subject"
              optionValue="id"
              choices={data ?? []}
            />
            <YearPickerInput />
          </SimpleForm>
        </CreateBase>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
}
