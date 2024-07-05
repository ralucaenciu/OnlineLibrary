import React, { useEffect, useState } from "react";
import useStore from "../../store/store";
import { Grid, Typography, Stack } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ContactService from "../../services/contact";
import moment from "moment";
import { Text } from "../../controls";

function ReviewCard({ review }) {
  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="body2" component="div">
          {review?.feedback}
        </Typography>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            {review?.userId?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {moment(review?.createdAt).format("DD MMMM YYYY")}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function Details() {
  let [keyword, setKeyword] = useState("");
  let [list, setList] = useState([]);
  const { setErrorMessage, setIsLoading, token } = useStore((state) => state);

  useEffect(() => {
    reload();
  }, [keyword]);

  const reload = () => {
    setIsLoading(true);
    ContactService.list(token, { keyword }).then((r) => {
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
        <Typography component="p" variant="h3">
          Mesaje primite de la utilizatori
        </Typography>
      </Grid>
      <Grid item xs={12} md={12}>
        <Text label="Cautare..." value={keyword} onChange={setKeyword} />
      </Grid>
      {list?.length === 0 ? (
        <Grid item xs={12} md={12}>
          <Typography component="p" variant="p">
            Niciun mesaj.
          </Typography>
        </Grid>
      ) : (
        <>
          {list?.map((review, i) => (
            <Grid item xs={12} sm={6} md={3} lg={3} key={i}>
              <ReviewCard review={review} />
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
}

export default Details;
