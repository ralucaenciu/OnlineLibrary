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
import moment from "moment";

function BookCard({ data, reload }) {
  const navigate = useNavigate();
  let {
    setIsLoading,
    token,
    setErrorMessage,
    setSuccessMessage,
    setUser,
    user,
    myBooks,
    setMyBooks,
    setShowReviewAndRatingPopup,
    setFeedbackBookId,
  } = useStore((s) => s);
  let [isSaved, setIsSaved] = useState(false);
  let [isBorrowed, setIsBorrowed] = useState(false);
  let book = data?.bookId;

  useEffect(() => {
    if (!book) return;

    let favs = user?.favourites || [];
    if (favs.includes(book?._id)) {
      setIsSaved(true);
    }
    if (myBooks?.includes(book?._id)) {
      setIsBorrowed(true);
    }
  }, [book]);

  const handleBorrow = async () => {
    if (!book || !token) return;
    let days = window?.prompt("Cate zile vrei sa imprumuti cartea?");
    if (!days || isNaN(days)) {
      setErrorMessage("Numar innvalid de zile");
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
    if (window?.confirm("Esti sigur ca vrei sa returnezi?")) {
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

  const handleSave = async () => {
    if (!book) return;
    await UserService.addFavourite(token, { id: book?._id }).then((result) => {
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
    if (!book) return;
    UserService.removeFavourite(token, { id: book?._id }).then((result) => {
      if (result?.error) {
        setIsLoading(false);
        setErrorMessage(result?.error);
        return;
      }

      setIsLoading(false);
      setUser(result?.data);
      setIsSaved(false);
      setSuccessMessage("Semn de carte eliminat cu succes!");
      reload();
    });
  };

  let daysToReturn = moment(data?.createdAt)
    .add(data?.days, "days")
    .diff(moment(), "days");

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
        {isSaved ? (
          <Button size="small" onClick={handleUnsave}>
            Elimina din Salvate
          </Button>
        ) : (
          <Button size="small" onClick={handleSave}>
            Salveaza
          </Button>
        )}
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

function Mine() {
  let [list, setList] = useState([]);
  let [list2, setList2] = useState([]);
  const { token, setErrorMessage, setIsLoading } = useStore((state) => state);

  useEffect(() => {
    reload();
  }, []);

  const reload = () => {
    setIsLoading(true);
    BorrowService.getMine(token).then((r) => {
      if (r.error) {
        setErrorMessage(r.error);
        setIsLoading(false);
        return;
      }

      let t1 = r.data?.filter((k) => k.status === "active");
      let t2 = r.data?.filter((k) => k.status === "returned");
      setList(t1);
      setList2(t2);
      setIsLoading(false);
    });
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={12}>
        <Typography component="p" variant="h3">
          Cartile mele
        </Typography>
      </Grid>
      <Grid item xs={12} md={12}>
        <Typography component="p" variant="h5">
          Imprumuturile mele
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
              <BookCard data={book} reload={reload} />
            </Grid>
          ))}
        </>
      )}

      <Grid item xs={12} md={12}>
        <Typography component="p" variant="h5">
          Istoric carti imprumutate
        </Typography>
      </Grid>
      {list2?.length === 0 ? (
        <Grid item xs={12} md={12}>
          <Typography component="p" variant="p">
            Nicio carte gasita.
          </Typography>
        </Grid>
      ) : (
        <>
          {list2?.map((book, i) => (
            <Grid item xs={12} sm={6} md={2} lg={2} key={i}>
              <BookCard data={book} reload={reload} />
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
}

export default Mine;
