import React, { useState } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { Save } from "@mui/icons-material";

import BookService from "../../services/book";
import { Button, Text, Error } from "../../controls";

function Create() {
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
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

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
      setErrorMessage("Please provide all fields!");
      return;
    }

    let coverImage = document.getElementById("file-cover-image")?.files?.[0];
    if (!coverImage) {
      setErrorMessage("Please choose book cover image!");
      return;
    }
    let authorImage = document.getElementById("file-author-image")?.files?.[0];
    if (!authorImage) {
      setErrorMessage("Please choose author image!");
      return;
    }

    setIsLoading(true);
    await BookService.create(token, {
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
      setSuccessMessage("Book created successfully!");
      navigate("/manage-books");
    });
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={12}>
        <Typography component="p" variant="h4">
          Adauga o carte
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
        <div>Coperta</div>
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          multiple={false}
          id="file-cover-image"
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
        <div>Autor</div>
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          multiple={false}
          id="file-author-image"
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <Button text="Submit" icon={<Save />} onClick={handleSubmit} />
      </Grid>

      <Grid item xs={12} md={12}>
        <Error text={errorMessage} />
      </Grid>
    </Grid>
  );
}

export default Create;
