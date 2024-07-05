import { useState } from "react";
import { Modal, Fade, Box } from "@mui/material";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import moment from "moment";
import { Button } from "../controls";
import { CheckCircle } from "@mui/icons-material";
import FlexRow from "./FlexRow";

function DateRangePickerPopup({ isOpen, onSuccess, onClose }) {
  const [dateRange, setDateRange] = useState([
    {
      startDate: moment().add(-1, "months").format(),
      endDate: moment().format(),
      key: "selection",
    },
  ]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    bgcolor: "background.paper",
    boxShadow: 8,
    p: 2,
    borderRadius: 4,
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <DateRangePicker
          ranges={dateRange}
          onChange={(item) => setDateRange([item?.selection])}
          direction="horizontal"
          color="#6F42C1"
          startDatePlaceholder={"Data inceput"}
          endDatePlaceholder={"Data terminare"}
          fixedHeight={true}
          rangeColors={["#6F42C1"]}
          months={2}
        />
        <Button
          icon={<CheckCircle />}
          text={"Apply"}
          onClick={() => onSuccess(dateRange)}
          width={100}
          height={40}
          size="small"
        />
      </Box>
    </Modal>
  );
}

export default DateRangePickerPopup;
