import React, { useEffect, useState } from "react";
import useStore from "../../store/store";
import { Grid, Typography, Box } from "@mui/material";
import {
  AccessTimeOutlined,
  AutoStoriesSharp,
  Face5Outlined,
} from "@mui/icons-material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import StatsService from "../../services/stats";
import { USER_TYPE } from "../../utils/enums";
import utils from "../../utils/utils";
import UsersByDate from "./charts/UsersByDate";
import BooksBorrowedByDate from "./charts/BooksBorrowedByDate";
import FamousBooks from "./charts/FamousBooks";
import BooksByGenre from "./charts/BooksByGenre";

function BasicCard({ color, number, icon, text }) {
  return (
    <Card sx={{ bgcolor: `${color}`, textAlign: "center" }}>
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <Box>{icon}</Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h3" sx={{ fontWeight: "light" }}>
              {utils.formatToNumber(number) || 0}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="p">{text}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  let { user } = useStore((s) => s);
  let [users, setUsers] = useState(0);
  let [books, setBooks] = useState(0);
  let [lateBooks, setLateBooks] = useState(0);
  const { token, setErrorMessage, setIsLoading } = useStore((state) => state);

  useEffect(() => {
    if (user?.type !== USER_TYPE.ADMIN) return;

    reload();
  }, []);

  const reload = () => {
    StatsService.getCounts(token).then((r) => {
      if (r.error) {
        setErrorMessage(r.error);
        setIsLoading(false);
        return;
      }
      setUsers(r.data?.users);
      setBooks(r.data?.books);
      setLateBooks(r.data?.lateBooks);
      setIsLoading(false);
    });
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={12}>
        <Typography component="p" variant="h3">
          Dashboard
        </Typography>
      </Grid>
      <Grid item xs={12} sm={4} md={4} lg={4}>
        <BasicCard
          number={users}
          icon={<Face5Outlined color="primary" sx={{ fontSize: 60 }} />}
          text="Utilizatori inregistrati in total"
          color="#EEF0FF"
        />
      </Grid>
      <Grid item xs={12} sm={4} md={4} lg={4}>
        <BasicCard
          number={books}
          icon={<AutoStoriesSharp color="primary" sx={{ fontSize: 60 }} />}
          text="Nr de carti"
          color="#EEF0FF"
        />
      </Grid>
      <Grid item xs={12} sm={4} md={4} lg={4}>
        <BasicCard
          number={lateBooks}
          icon={<AccessTimeOutlined color="primary" sx={{ fontSize: 60 }} />}
          text="Carti imprumutate"
          color="#EEF0FF"
        />
      </Grid>
      <Grid item xs={12}>
        <UsersByDate />
      </Grid>
      <Grid item xs={12}>
        <BooksBorrowedByDate />
      </Grid>
      <Grid item xs={12}>
        <FamousBooks />
      </Grid>
      <Grid item xs={12}>
        <BooksByGenre />
      </Grid>
    </Grid>
  );
}

export default Dashboard;
