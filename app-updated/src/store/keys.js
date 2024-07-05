const APP_NAME = `@${process.env.REACT_APP_NAME?.replaceAll(
  " ",
  "_"
).toUpperCase()}_`;

const Keys = {
  isLoading: `${APP_NAME}isLoading`,
  token: `${APP_NAME}token`,
  user: `${APP_NAME}user`,
  errorMessage: `${APP_NAME}errorMessage`,
  successMessage: `${APP_NAME}successMessage`,
  infoMessage: `${APP_NAME}infoMessage`,
  myBooks: `${APP_NAME}myBooks`,
  showReviewAndRatingPopup: `${APP_NAME}showReviewAndRatingPopup`,
  feedbackBookId: `${APP_NAME}feedbackBookId`,
};

export default Keys;
