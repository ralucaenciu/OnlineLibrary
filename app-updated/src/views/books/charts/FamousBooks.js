import { useEffect, useState } from "react";
import { Grid, Typography, CardContent, Card, Box } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { DateRangePickerButton } from "../../../controls";
import moment from "moment";
import FlexRow from "../../../components/FlexRow";
import useStore from "../../../store/store";
import PaperCard from "../../../components/PaperCard";
import StatsService from "../../../services/stats";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

function BookCard({ book, count }) {
  const navigate = useNavigate();
  return (
    <Card
      elevation={0}
      sx={{
        px: 4,
        py: 2,
        background: "#eee",
        borderRadius: 0,
      }}
    >
      <CardContent onClick={() => navigate(`/book/${book?._id}`)}>
        <img
          alt={book?.title}
          src={book?.coverUrl}
          onClick={() => navigate(`/book/${book?._id}`)}
          style={{ cursor: "pointer", width: "100%", height: 180 }}
        />
        <Box sx={{ fontWeight: 700, fontSize: 16, mt: 1 }}>{book?.title}</Box>
        <Box sx={{ fontSize: 12, color: "#5c5c5c", my: 1 }}>
          Author: {book?.author}
        </Box>
      </CardContent>
    </Card>
  );
}

export default function FamousBooks() {
  const { setIsLoading, setErrorMessage, token } = useStore((s) => s);
  const [dateRange, setDateRange] = useState({
    startDate: moment().add(-1, "months"),
    endDate: moment(),
  });
  const [list, setList] = useState([]);

  useEffect(() => {
    reloadChart();
  }, [dateRange]);

  const reloadChart = async () => {
    setIsLoading(true);
    StatsService.getFamousBooks(token, { range: dateRange }).then((result) => {
      let data = result?.data || false;
      if (!data) {
        setErrorMessage(result?.error);
        setIsLoading(false);
        return;
      }

      setList(data);
      setIsLoading(false);
    });
  };

  return (
    <PaperCard bg={true} elevation={false}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FlexRow style={{ justifyContent: "space-between" }}>
            <Typography component="p" variant="h6">
              Cele mai populare carti
            </Typography>
            <DateRangePickerButton onSuccess={setDateRange} />
          </FlexRow>
        </Grid>
        {list?.length === 0 ? (
          <Grid item xs={12} md={12}>
            <Typography component="p" variant="p">
              No books found.
            </Typography>
          </Grid>
        ) : (
          <>
            {list?.map((book, i) => (
              <Grid item xs={12} sm={6} md={2} lg={2} key={i}>
                <BookCard book={book?.book} count={book?.count} />
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </PaperCard>
  );
}
