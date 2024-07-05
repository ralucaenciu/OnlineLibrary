import React, { useEffect, useState } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import UserService from "../../services/user";
import BorrowService from "../../services/borrow";

function BookCard({ book, reload }) {
  const navigate = useNavigate();
  let {
    setIsLoading,
    token,
    setErrorMessage,
    setSuccessMessage,
    setUser,
    myBooks,
    setMyBooks,
    setFeedbackBookId,
    setShowReviewAndRatingPopup,
  } = useStore((s) => s);
  let [isBorrowed, setIsBorrowed] = useState(false);

  useEffect(() => {
    if (!book) return;
    if (myBooks?.includes(book?._id)) {
      setIsBorrowed(true);
    }
  }, [book]);

  const handleBorrow = async () => {
    if (!book || !token) return;
    let days = window?.prompt("Pentru cate zile doresti sa imprumuti cartea?");
    if (!days || isNaN(days)) {
      setErrorMessage("Numar de zile invalid.");
      return;
    }
    await BorrowService.create(token, { bookId: book?._id, days }).then(
      (result) => {
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
      }
    );
  };

  const handleReturn = async () => {
    if (!book || !token) return;
    if (window?.confirm("Esti sigur ca vrei sa returnezi cartea?")) {
      await BorrowService.returnBook(token, { bookId: book?._id }).then(
        (result) => {
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
          setFeedbackBookId(book?._id);
          setShowReviewAndRatingPopup(true);
        }
      );
    }
  };

  const handleUnsave = () => {
    if (!book) return;
    UserService.removeFavourite(token, { id: book?._id }).then((result) => {
      if (result?.error) {
        setIsLoading(false);
        setErrorMessage(result?.error);
        return;
      }

      setIsLoading(false);
      setUser(result?.data);
      setSuccessMessage("Semn de carte inlaturat cu succes!");
      reload();
    });
  };

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
          Autor: {book?.author}
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleUnsave}>
          Elimina din Salvate
        </Button>
        {isBorrowed ? (
          <Button size="small" onClick={handleReturn}>
            Returneaza
          </Button>
        ) : (
          <Button size="small" onClick={handleBorrow}>
            Imprumuta
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

function Saved() {
  let [list, setList] = useState([]);
  const { token, setErrorMessage, setIsLoading } = useStore((state) => state);

  useEffect(() => {
    reload();
  }, []);

  const reload = async () => {
    setIsLoading(true);
    await UserService.getFavourite(token).then((r) => {
      if (r.error) {
        setErrorMessage(r.error);
        setIsLoading(false);
        return;
      }
      setList(r?.data);
      setIsLoading(false);
    });
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={12}>
        <Typography component="p" variant="h3">
          Semne de carte
        </Typography>
      </Grid>
      {list?.length === 0 ? (
        <Grid item xs={12} md={12}>
          <Typography component="p" variant="p">
            Nicio carte gasita.
          </Typography>
        </Grid>
      ) : (
        <>
          {list?.map((book, i) => (
            <Grid item xs={12} sm={6} md={2} lg={2} key={i}>
              <BookCard book={book} reload={reload} />
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
}

export default Saved;
