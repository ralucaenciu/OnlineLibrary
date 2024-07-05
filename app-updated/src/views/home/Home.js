import React, { useEffect, useState } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import BookService from "../../services/book";
import UserService from "../../services/user";
import BorrowService from "../../services/borrow";
import { Text } from "../../controls";
import PaperCard from "../../components/PaperCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

function BookCard({ book, reload }) {
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
    let days = window?.prompt(
      "Cate zile ai nevoie sa imprumuti aceasta carte?"
    );
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
      setSuccessMessage("Semn de carte inlaturat!");
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
      <CardContent
        onClick={() => navigate(`/book/${book?._id}`)}
        style={{ cursor: "pointer" }}
      >
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
      <CardActions>
        {isSaved ? (
          <Button size="small" onClick={handleUnsave}>
            Unsave
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

function Home() {
  const navigate = useNavigate();
  let [list, setList] = useState([]);
  let [all, setAll] = useState([]);
  let [keyword, setKeyword] = useState("");
  const { token, setErrorMessage, setIsLoading } = useStore((state) => state);

  useEffect(() => {
    BookService.list(token, { keyword: "" }).then((r) => {
      if (r.error) {
        setErrorMessage(r.error);
        return;
      }
      setAll(r.data);
    });
  }, []);

  useEffect(() => {
    reload();
  }, [keyword]);

  const reload = () => {
    setIsLoading(true);
    BookService.list(token, { keyword }).then((r) => {
      if (r.error) {
        setErrorMessage(r.error);
        setIsLoading(false);
        return;
      }
      setList(r.data);
      setIsLoading(false);
    });
  };

  return (
    <>
      <PaperCard bg={false} elevation={false} br={0}>
        <Grid container spacing={20} sx={{ p: 4 }}>
          <Grid item xs={5}>
            <Box sx={{ fontSize: 48, fontWeight: 950, p: 4 }}>
              Cauta & <br />
              Descopera placerea cititului
            </Box>
            <Box className="too-small grey" sx={{ pl: 4 }}>
              Bine ați venit la Book Zone! Oferim o colecție vastă de cărți
              accesibile oricând și oriunde. Indiferent dacă sunteți în căutarea
              unei lecturi plăcute, cercetare academică sau resurse pentru
              dezvoltare personală, biblioteca noastră vă stă la dispoziție cu
              un catalog variat și actualizat. Explorați, citiți și învățați la
              un click distanță!{" "}
            </Box>
          </Grid>
          <Grid item xs={7}>
            <Swiper
              spaceBetween={20}
              slidesPerView={3}
              modules={[Autoplay]}
              autoplay={{ delay: 3000 }}
            >
              {all?.map((img) => (
                <SwiperSlide onClick={() => navigate(`/book/${img?._id}`)}>
                  <img src={img?.coverUrl} alt="" className="moving-cover" />
                </SwiperSlide>
              ))}
            </Swiper>
          </Grid>
        </Grid>
      </PaperCard>
      <Grid container spacing={2} sx={{ p: 2, mt: 4 }}>
        <Grid item xs={2} md={2}></Grid>
        <Grid item xs={8} md={8}>
          <Text label="Search..." value={keyword} onChange={setKeyword} />
        </Grid>
        <Grid item xs={2} md={2}></Grid>
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
    </>
  );
}

export default Home;
