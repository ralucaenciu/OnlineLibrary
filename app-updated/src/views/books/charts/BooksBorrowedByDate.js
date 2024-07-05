import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
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
import { Bar, Line } from "react-chartjs-2";
import { DateRangePickerButton, Button } from "../../../controls";
import moment from "moment";
import FlexRow from "../../../components/FlexRow";
import { BarChart, Timeline } from "@mui/icons-material";
import useStore from "../../../store/store";
import PaperCard from "../../../components/PaperCard";
import StatsService from "../../../services/stats";
import Constants from "../../../utils/constants";

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

export default function BooksBorrowedByDate() {
  const { setIsLoading, setErrorMessage, token } = useStore((s) => s);
  const [dateRange, setDateRange] = useState({
    startDate: moment().add(-1, "months"),
    endDate: moment(),
  });
  const [chartType, setChartType] = useState("bar");
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });

  useEffect(() => {
    reloadChart();
  }, [dateRange]);

  const reloadChart = async () => {
    setIsLoading(true);
    StatsService.getChartBooksBorrowedByDate(token, { range: dateRange }).then(
      (result) => {
        let data = result?.data || false;
        if (!data) {
          setErrorMessage(result?.error);
          setIsLoading(false);
          return;
        }

        let _data = [];
        let _labels = [];
        let start = moment(dateRange?.startDate);
        let end = moment(dateRange?.endDate);
        for (
          let m = moment(start);
          m.diff(end, "days") <= 0;
          m.add(1, "days")
        ) {
          _labels.push(m.format("DD MMM YY"));
          let hasData = data?.find((k) => k?._id === m.format("YYYY-MM-DD"));
          _data.push(hasData ? hasData?.count : 0);
        }

        setData({
          labels: _labels,
          datasets: [{ data: _data }],
        });
        setIsLoading(false);
      }
    );
  };

  return (
    <PaperCard bg={true} elevation={false}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography component="p" variant="h6">
            Carti imprumutate
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FlexRow style={{ justifyContent: "space-between" }}>
            <Button
              text={
                chartType === "bar" ? (
                  <FlexRow>
                    <Timeline />
                    Line Chart
                  </FlexRow>
                ) : (
                  <FlexRow>
                    <BarChart /> Bar Chart
                  </FlexRow>
                )
              }
              width={200}
              onClick={() => setChartType(chartType === "bar" ? "line" : "bar")}
            />
            <DateRangePickerButton onSuccess={setDateRange} />
          </FlexRow>
        </Grid>
        <Grid item xs={12}>
          {chartType === "bar" ? (
            <Bar
              options={Constants.BAR_CHART_OPTIONS}
              data={data}
              style={{
                minHeight: Constants.CHART_HEIGHT,
                maxHeight: Constants.CHART_HEIGHT,
              }}
            />
          ) : (
            <Line
              options={Constants.LINE_CHART_OPTIONS}
              data={data}
              style={{
                minHeight: Constants.CHART_HEIGHT,
                maxHeight: Constants.CHART_HEIGHT,
              }}
            />
          )}
        </Grid>
      </Grid>
    </PaperCard>
  );
}
