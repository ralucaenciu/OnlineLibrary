import React, { useEffect, useState } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Stack, Box } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import BookService from "../../services/book";
import { USER_TYPE } from "../../utils/enums";
import { IconButton, Text } from "../../controls";

function BookCard({ book, reload }) {
  const navigate = useNavigate();
  let { setIsLoading, token, setErrorMessage, setSuccessMessage } = useStore(
    (s) => s
  );
  const handleDelete = () => {
    if (!book) return;
    if (window.confirm("Esti sigur ca vrei sa stergi aceasta inregistrare?")) {
      BookService.deleteById(token, book?._id).then((result) => {
        if (result?.error) {
          setIsLoading(false);
          setErrorMessage(result?.error);
          return;
        }

        setIsLoading(false);
        setSuccessMessage("Carte stearsa cu succes!");
        reload();
      });
    }
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
          Author: {book?.author}
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => navigate(`/edit/${book?._id}`)}>
          Edit
        </Button>
        <Button size="small" onClick={handleDelete}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}

function ManageBooks() {
  let { user } = useStore((s) => s);
  let [list, setList] = useState([]);
  let [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const { token, setErrorMessage, setIsLoading } = useStore((state) => state);

  useEffect(() => {
    if (user?.type !== USER_TYPE.ADMIN) return;

    reload();
  }, [keyword]);

  const reload = () => {
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
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={12}>
        <Stack direction="row" alignItems="center" gap={2}>
          <Typography component="p" variant="h3">
            Gestionare carti
          </Typography>
          <IconButton
            icon={<AddCircle fontSize="large" />}
            color="primary"
            onClick={() => navigate("/create")}
          />
        </Stack>
      </Grid>
      <Grid item xs={12} md={12}>
        <Text label="Cautare..." value={keyword} onChange={setKeyword} />
      </Grid>
      {list?.length === 0 ? (
        <Grid item xs={12} md={12}>
          <Typography component="p" variant="p">
            Nu a fost gasita nicio carte.
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

export default ManageBooks;
