import React, { useEffect, useState } from "react";
import useStore from "../../store/store";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { Cancel, Save } from "@mui/icons-material";
import BookService from "../../services/book";
import { Button, Text, Error } from "../../controls";

function Update() {
  const navigate = useNavigate();
  let { id } = useParams();
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [author, setAuthor] = useState("");
  let [genre, setGenre] = useState("");
  let [year, setYear] = useState("");
  let [count, setCount] = useState("");
  let [isbn, setIsbn] = useState("");
  let [publisher, setPublisher] = useState("");
  let [pages, setPages] = useState("");
  let [authorInfo, setAuthorInfo] = useState("");
  let [book, setBook] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const { token, setIsLoading, setSuccessMessage } = useStore((state) => state);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    BookService.getById(token, id).then((result) => {
      if (result?.error) {
        setIsLoading(false);
        setErrorMessage(result?.error);
        return;
      }

      setIsLoading(false);
      let b = result?.data;
      setBook(b);
      setTitle(b?.title);
      setDescription(b?.description);
      setAuthor(b?.author);
      setGenre(b?.genre);
      setYear(b?.year);
      setCount(b?.count);
      setIsbn(b?.isbn);
      setPublisher(b?.publisher);
      setPages(b?.pages);
      setAuthorInfo(b?.aboutAuthor);
    });
  }, [id]);

  const handleSubmit = async () => {
    if (
      !title ||
      !description ||
      !author ||
      !genre ||
      !year ||
      !count ||
      !isbn ||
      !publisher ||
      !pages ||
      !authorInfo
    ) {
      setErrorMessage("Toate campurile sunt obligatorii!");
      return;
    }

    let coverImage = document.getElementById("file-cover-image")?.files?.[0];
    if (!coverImage) {
      setErrorMessage("Te rugam alege o poza de coperta.");
      return;
    }
    let authorImage = document.getElementById("file-author-image")?.files?.[0];
    if (!authorImage) {
      setErrorMessage("Te rugam alege o poza pentru autor.");
      return;
    }

    setIsLoading(true);
    await BookService.update(token, id, {
      title,
      description,
      author,
      genre,
      year,
      count,
      isbn,
      publisher,
      pages,
      aboutAuthor: authorInfo,
      coverUrl: await convertToBase64(coverImage),
      aboutImageUrl: await convertToBase64(authorImage),
    }).then((result) => {
      if (result?.error) {
        setIsLoading(false);
        setErrorMessage(result?.error);
        return;
      }

      setIsLoading(false);
      setSuccessMessage("Carte actualizata cu succes!");
      navigate("/manage-books");
    });
  };

  if (!id) return <></>;

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={12}>
        <Typography component="p" variant="h4">
          Actualizare
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Text
          placeholder="Titlu"
          label="Title"
          value={title}
          onChange={setTitle}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Text
          placeholder="Descriere"
          label="Description"
          value={description}
          onChange={setDescription}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Text
          placeholder="Autor"
          label="Author"
          value={author}
          onChange={setAuthor}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Text
          placeholder="Gen"
          label="Genre"
          value={genre}
          onChange={setGenre}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Text placeholder="An" label="Year" value={year} onChange={setYear} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Text
          placeholder="Nr de carti disponibile"
          label="Count"
          value={count}
          onChange={setCount}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Text placeholder="ISBN" label="ISBN" value={isbn} onChange={setIsbn} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Text
          placeholder="Editura"
          label="Publisher"
          value={publisher}
          onChange={setPublisher}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Text
          placeholder="Nr de pagini"
          label="Pages"
          value={pages}
          onChange={setPages}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <div>Alege o poza de coperta.</div>
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          multiple={false}
          id="file-cover-image"
        />
        <img
          src={book?.coverUrl}
          alt=""
          style={{ width: 200, height: 200, cursor: "pointer" }}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <Text
          placeholder="Informatii despre autor"
          label="About author"
          value={authorInfo}
          onChange={setAuthorInfo}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <div>Alege o poza pentru autor.</div>
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          multiple={false}
          id="file-author-image"
        />
        <img
          src={book?.aboutImageUrl}
          alt=""
          style={{ width: 200, height: 200, cursor: "pointer" }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Button
          text="Cancel"
          icon={<Cancel />}
          onClick={() => navigate("/manage-books")}
          color="info"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Button text="Submit" icon={<Save />} onClick={handleSubmit} />
      </Grid>

      <Grid item xs={12} md={12}>
        <Error text={errorMessage} />
      </Grid>
    </Grid>
  );
}

export default Update;
