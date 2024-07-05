import { useEffect, useState } from "react";
import useStore from "../../../store/store";
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
  ArcElement,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { DateRangePickerButton } from "../../../controls";
import DateRangePickerPopup from "../../../components/DateRangePickerPopup";
import moment from "moment";
import FlexRow from "../../../components/FlexRow";
import Constants from "../../../utils/constants";
import PaperCard from "../../../components/PaperCard";
import StatsService from "../../../services/stats";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
);

export default function BooksByGenre() {
  const { setIsLoading, setErrorMessage, token } = useStore((s) => s);

  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: moment().add(-1, "months"),
    endDate: moment(),
  });

  const [data, setData] = useState({
    labels: [],
    datasets: [{ indexAxis: "y", data: [] }],
  });

  useEffect(() => {
    reloadChart();
  }, [dateRange]);

  const reloadChart = async () => {
    setIsLoading(true);
    StatsService.getChartBooksByGenre(token, { range: dateRange }).then(
      (result) => {
        let data = result?.data || false;
        if (!data) {
          setErrorMessage(result?.error);
          setIsLoading(false);
          return;
        }

        data = data.sort((a, b) => b?.count - a?.count);
        let _data = [];
        let _labels = [];

        for (let i = 0; i < data?.length; i++) {
          _labels.push(data[i]?._id);
          _data.push(data[i]?.count);
        }

        setData({
          labels: _labels,
          datasets: [
            {
              data: _data,
              backgroundColor: Constants.PIE_CHART_COLORS,
              borderColor: Constants.PIE_CHART_COLORS,
              borderWidth: 2,
            },
          ],
        });
        setIsLoading(false);
      }
    );
  };

  return (
    <>
      <DateRangePickerPopup
        isOpen={showDateRangePicker}
        onClose={() => setShowDateRangePicker(false)}
        onSuccess={(range) => {
          setDateRange(range[0]);
          setShowDateRangePicker(false);
        }}
      />
      <PaperCard bg={true} elevation={false}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography component="p" variant="h6">
              Genul cartilor
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <FlexRow style={{ justifyContent: "end" }}>
              <DateRangePickerButton onSuccess={setDateRange} />
            </FlexRow>
          </Grid>
          <Grid item xs={12}>
            <Pie
              options={Constants.PIE_CHART_OPTIONS}
              data={data}
              style={{
                minHeight: Constants.CHART_HEIGHT,
                maxHeight: Constants.CHART_HEIGHT,
              }}
            />
          </Grid>
        </Grid>
      </PaperCard>
    </>
  );
}
