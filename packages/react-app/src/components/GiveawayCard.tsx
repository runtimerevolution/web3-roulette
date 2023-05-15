import { Card, CardMedia, CardContent, Typography, CardActions, Button } from "@mui/material";
import { Giveaway } from "../lib/types";
import { format } from "date-fns";

const GiveawayCard = (props: Giveaway) => {
  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        // image={props.image ? `${config.API}/${props.image}` : '/static/images/cards/contemplative-reptile.jpg'}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.prize}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {format(props.endTime, 'MMMM d, yyyy')}
        </Typography>
      </CardContent>
      <CardActions>
        {/* <Link to={`/details/${movie.id}`}> */}
        <Button size="small">Manage</Button>
      </CardActions>
    </Card>
  );
};

export default GiveawayCard;