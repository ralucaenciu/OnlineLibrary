import React, { useEffect, useState } from "react";
import { Grid, Typography, Stack } from "@mui/material";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import useStore from "../store/store";
import { Rating } from "react-simple-star-rating";
import { Text, Button } from "../controls";
import { Cancel, Save } from "@mui/icons-material";
import ReviewService from "../services/review";

function ReviewAndRating({}) {
  const {
    showReviewAndRatingPopup,
    setShowReviewAndRatingPopup,
    feedbackBookId,
    setFeedbackBookId,
    user,
    token,
    setIsLoading,
    setErrorMessage,
    setSuccessMessage,
  } = useStore((s) => s);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    return () => {
      setRating(0);
      setFeedbackBookId("");
    };
  }, []);

  const handleSubmit = () => {
    if (!feedbackBookId) return;
    ReviewService.create(token, {
      bookId: feedbackBookId,
      rating,
      feedback,
    }).then((result) => {
      if (result?.error) {
        setIsLoading(false);
        setErrorMessage(result?.error);
        return;
      }

      setIsLoading(false);
      setSuccessMessage("Feedback inregistrat cu succes!");
      setFeedbackBookId("");
      setShowReviewAndRatingPopup(false);
    });
  };

  return (
    <Rodal
      visible={showReviewAndRatingPopup}
      onClose={() => setShowReviewAndRatingPopup(false)}
      width={600}
      height={400}
    >
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12} md={12}>
          <Typography component="p" variant="h6">
            Rate this book
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <Stack
            direction="row"
            alignContent="center"
            justifyContent="space-between"
          >
            <Rating onClick={setRating} initialValue={rating} />
            <Typography component="p" variant="h6">
              {rating}/5
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={12}>
          <Typography component="p" variant="h6">
            Leave your feedback
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <Text
            placeholder="Feedback..."
            value={feedback}
            onChange={setFeedback}
          />
        </Grid>
        <Grid item xs={6}>
          <Button
            text="Cancel"
            icon={<Cancel />}
            onClick={() => setShowReviewAndRatingPopup(false)}
            color="info"
          />
        </Grid>
        <Grid item xs={6}>
          <Button text="Submit" icon={<Save />} onClick={handleSubmit} />
        </Grid>
      </Grid>
    </Rodal>
  );
}

export default ReviewAndRating;
