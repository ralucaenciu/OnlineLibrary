import React, { useEffect, useState } from "react";
import useStore from "../../store/store";
import { useParams, useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Stack,
  CardMedia,
  Divider,
  Table,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import BookService from "../../services/book";
import BorrowService from "../../services/borrow";
import UserService from "../../services/user";
import moment from "moment";
import { Rating } from "react-simple-star-rating";
import { Button } from "../../controls";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Favorite, FavoriteBorder, HeartBroken } from "@mui/icons-material";

function BookCard({ book }) {
  const navigate = useNavigate();
  return (
    <Card>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image={book?.coverUrl}
        onClick={() => navigate(`/book/${book?._id}`)}
        style={{ cursor: "pointer" }}
      />
      <CardContent onClick={() => navigate(`/book/${book?._id}`)}>
        <Typography gutterBottom variant="h5" component="div">
          {book?.title}
        </Typography>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            By: {book?.author}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Released: {book?.year}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary"></Typography>
          <Typography variant="body2" color="text.secondary">
            Copies: {book?.count}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function ReviewCard({ review }) {
  return (
    <Card elevation={1}>
      <CardContent>
        <Rating initialValue={review?.rating} size={18} />
        <Box gutterBottom variant="body2" component="div" sx={{ my: 1 }}>
          {review?.feedback}
        </Box>
        <Stack direction="row" justifyContent="space-between">
          <Box sx={{ fontSize: 13, color: "#5c5c5c" }}>
            {review?.userId?.name}
          </Box>
          <Box sx={{ fontSize: 13, color: "#5c5c5c" }}>
            {moment(review?.createdAt).format("DD MMMM YYYY")}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function StyledTableCell({ children }) {
  return <TableCell sx={{ borderBottom: "none" }}>{children}</TableCell>;
}

function Details() {
  let { id } = useParams();
  let [book, setBook] = useState(null);
  let [list, setList] = useState([]);
  let [recommended, setRecommended] = useState([]);
  let [avgRating, setAvgRating] = useState(0);
  let [activeBorrowed, setActiveBorrowed] = useState(0);
  const {
    setErrorMessage,
    setIsLoading,
    token,
    setSuccessMessage,
    setMyBooks,
    myBooks,
    setFeedbackBookId,
    setShowReviewAndRatingPopup,
    user,
    setUser,
  } = useStore((state) => state);
  const [value, setValue] = React.useState(0);
  let [isBorrowed, setIsBorrowed] = useState(false);
  let [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    reload();

    let favs = user?.favourites || [];
    if (favs.includes(id)) {
      setIsSaved(true);
    }

    if (myBooks?.includes(id)) {
      setIsBorrowed(true);
    }
  }, [id]);

  const reload = () => {
    setIsLoading(true);
    BookService.getDetailsById(id).then((r) => {
      if (r.error) {
        setErrorMessage(r.error);
        setIsLoading(false);
        return;
      }
      setBook(r.data?.book);
      setActiveBorrowed(r.data?.borrowed);
      setList(r.data?.reviews);
      let sum = r.data?.reviews?.reduce((a, b) => a + parseInt(b?.rating), 0);
      let count = r.data?.reviews?.length;
      setAvgRating((sum / count).toFixed(1));
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (!id || !book) return;
    BookService.getSimilar(book?.genre).then((r) => {
      if (r.error) {
        setErrorMessage(r.error);
        return;
      }
      let t = r?.data.filter((k) => k?._id !== id);
      setRecommended(t);
    });
  }, [id, book]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleBorrow = async () => {
    if (!id || !token) return;
    let days = window?.prompt("Cate zile doresti sa imprumuti cartea?");
    if (!days || isNaN(days)) {
      setErrorMessage("Numar de zile invalid");
      return;
    }
    await BorrowService.create(token, { bookId: id, days }).then((result) => {
      if (result?.error) {
        setIsLoading(false);
        setErrorMessage(result?.error);
        return;
      }

      setIsLoading(false);
      setSuccessMessage("Carte imprumutata cu succes!");
      setMyBooks(result?.data);
      setIsBorrowed(true);
      reload();
    });
  };

  const handleReturn = async () => {
    if (!id || !token) return;
    if (window?.confirm("Esti sigur ca vrei sa returnezi?")) {
      await BorrowService.returnBook(token, { bookId: id }).then((result) => {
        if (result?.error) {
          setIsLoading(false);
          setErrorMessage(result?.error);
          return;
        }

        setIsLoading(false);
        setSuccessMessage("Carte returnata cu succes!");
        setMyBooks(result?.data);
        setIsBorrowed(false);
        reload();
        setFeedbackBookId(id);
        setShowReviewAndRatingPopup(true);
      });
    }
  };

  const handleSave = async () => {
    if (!id || !token) return;
    await UserService.addFavourite(token, { id: id }).then((result) => {
      if (result?.error) {
        setIsLoading(false);
        setErrorMessage(result?.error);
        return;
      }

      setIsLoading(false);
      setUser(result?.data);
      setIsSaved(true);
      setSuccessMessage("Semn de carte adaugat cu succes!");
      reload();
    });
  };

  const handleUnsave = () => {
    if (!id || !token) return;
    UserService.removeFavourite(token, { id: id }).then((result) => {
      if (result?.error) {
        setIsLoading(false);
        setErrorMessage(result?.error);
        return;
      }

      setIsLoading(false);
      setUser(result?.data);
      setIsSaved(false);
      setSuccessMessage("Semn de carte inlaturat cu succes!");
      reload();
    });
  };

  if (!id) return <></>;

  return (
    <Grid container spacing={2} sx={{ p: 8 }}>
      <Grid item xs={5}>
        <CardMedia
          component="img"
          alt="green iguana"
          height="700"
          image={book?.coverUrl}
          style={{ objectFit: "contain", background: "#eee" }}
        />
        {isSaved ? (
          <Button
            size="small"
            onClick={handleUnsave}
            variant="text"
            text="Elimina din semn de carte"
            icon={<FavoriteBorder />}
          />
        ) : (
          <Button
            size="small"
            onClick={handleSave}
            variant="text"
            text="Salveaza ca semn de carte"
            icon={<Favorite />}
          />
        )}
      </Grid>
      <Grid item xs={1}></Grid>
      <Grid item xs={6} sx={{ mb: 3 }}>
        <Stack spacing={2} className="info">
          <Box className="big">{book?.title}</Box>
          <Box className="small">By: {book?.author}</Box>
          {list?.length === 0 && (
            <Box className="too-small grey">No reviews yet.</Box>
          )}

          <Stack spacing={3} direction="row" sx={{ alignItems: "center" }}>
            <Rating initialValue={avgRating} readonly size={30} />
            {parseFloat(avgRating) > 0 && (
              <Box className="small">
                {avgRating} ({list?.length})
              </Box>
            )}
          </Stack>

          {!isBorrowed ? (
            <Button
              text="Imprumuta"
              disabled={book?.count - activeBorrowed <= 0}
              onClick={handleBorrow}
            />
          ) : (
            <Button text="Returneaza" onClick={handleReturn} color="info" />
          )}
          <Box className="small grey" sx={{ fontWeight: 300, fontSize: 16 }}>
            {book?.description}
          </Box>
        </Stack>
        <Divider sx={{ my: 4 }} />
        <Grid item xs={12}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={value} onChange={handleChange} aria-label="">
              <Tab label="Detalii despre carte" {...a11yProps(0)} />
              <Tab label="Detalii despre autor" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Table>
              <TableRow>
                <StyledTableCell>ISBN</StyledTableCell>
                <StyledTableCell>{book?.isbn}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>Editura</StyledTableCell>
                <StyledTableCell>{book?.publisher}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>Data</StyledTableCell>
                <StyledTableCell>{book?.year}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>Nr de pagini</StyledTableCell>
                <StyledTableCell>{book?.pages}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>Gen</StyledTableCell>
                <StyledTableCell>{book?.genre}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>Nr de copii</StyledTableCell>
                <StyledTableCell>{book?.count}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>Copii disponibile</StyledTableCell>
                <StyledTableCell>
                  {book?.count - activeBorrowed}
                </StyledTableCell>
              </TableRow>
            </Table>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Grid container>
              <Grid item xs={4}>
                <CardMedia
                  component="img"
                  alt={book?.author}
                  height="200"
                  image={book?.aboutImageUrl}
                  style={{ objectFit: "contain", background: "#eee" }}
                />
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={7}>
                <div style={{ fontWeight: 600, fontSize: 20 }}>
                  Despre autor
                </div>
                <Box
                  className="small grey"
                  sx={{ fontWeight: 300, fontSize: 16, my: 1 }}
                >
                  {book?.aboutAuthor}
                </Box>
              </Grid>
            </Grid>
          </CustomTabPanel>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Grid item xs={12}>
        <Box sx={{ fontSize: 24, fontWeight: 700, my: 1 }}>
          S-ar putea sa iti placa si...
        </Box>
      </Grid>
      {recommended?.length === 0 && (
        <Grid item xs={12}>
          <Box className="too-small grey">
            Nicio recomandare pentru acest gen.
          </Box>
        </Grid>
      )}
      <Grid item xs={12}>
        <Stack spacing={3} direction="row">
          {recommended?.map((k) => (
            <BookCard book={k} />
          ))}
        </Stack>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Grid item xs={12}>
        <Box sx={{ fontSize: 24, fontWeight: 700, my: 1 }}>
          Parerea utilizatorilor
        </Box>
      </Grid>
      {list?.length === 0 && (
        <Grid item xs={12}>
          <Box className="too-small grey">No reviews yet.</Box>
        </Grid>
      )}
      <>
        {list?.map((review, i) => (
          <Grid item xs={12} key={i}>
            <ReviewCard review={review} />
          </Grid>
        ))}
      </>
    </Grid>
  );
}

export default Details;
