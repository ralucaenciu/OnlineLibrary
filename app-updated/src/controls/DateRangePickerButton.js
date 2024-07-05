import { useState } from "react";
import moment from "moment";
import { Button, LinkButton } from ".";
import { ArrowRightAlt } from "@mui/icons-material";
import FlexRow from "../components/FlexRow";
import DateRangePickerPopup from "../components/DateRangePickerPopup";

function DateRangePickerButton({ onSuccess }) {
  const [dateRange, setDateRange] = useState({
    startDate: moment().add(-1, "months"),
    endDate: moment(),
    key: "selection",
  });
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);

  return (
    <>
      <DateRangePickerPopup
        isOpen={showDateRangePicker}
        onClose={() => setShowDateRangePicker(false)}
        onSuccess={(range) => {
          setDateRange(range[0]);
          onSuccess(range[0]);
          setShowDateRangePicker(false);
        }}
      />
      <Button
        style={{
          borderRadius: 4,
          boxShadow: "none",
          height: 55,
          border: "1px solid #CBCBCB",
          width: 300,
          textTransform: "none",
          backgroundColor: "transparent",
          fontWeight: "normal",
          color: "#757575",
        }}
        color="inherit"
        text={
          dateRange ? (
            <FlexRow>
              {moment(dateRange?.startDate).format("DD MMM YYYY")}
              <ArrowRightAlt />
              {moment(dateRange?.endDate).format("DD MMM YYYY")}
            </FlexRow>
          ) : (
            "Selectati data"
          )
        }
        onClick={() => setShowDateRangePicker(true)}
      />
    </>
  );
}

export default DateRangePickerButton;
