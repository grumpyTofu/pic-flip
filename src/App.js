import React, { useState, useEffect } from 'react';
import { 
  Container, Backdrop, CircularProgress, Grid, Card, 
  CardContent, CardActionArea, CardActions, Button, Typography 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';


const useStyles = makeStyles((theme) => ({
  container: {
    height: '100vh',
    width: '100vw'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  imgCard: {
    height: '70vh'
  },
  imgFlipX: {
    transform: 'scaleX(-1)'
  },
  imgFlipY : {
    transform: 'scaleY(-1)'
  },
  imgCardContent: {
    height: '20%',
    padding: '0px 1.5rem',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  imgCardActions: {
    height: '20%',
    padding: '0px 2rem',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
}));

export default props => {

  const [state, setState] = useState({
    loading: false,
    img: null,
    imgFlipX: false,
    imgFlipY: false
  });

  useEffect(() => {
    if (!state.img && state.loading === true && process.env.REACT_APP_UNSPLASH_ACCESS_KEY) {
      fetch(`https://api.unsplash.com/photos/random?client_id=${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`)
      .then(response => response.json()).then(response => {
        console.log(response.links);
        setState({
          ...state,
          loading: false,
          img: {
            src: response.urls.raw,
            hotLink: response.links.html,
            photographer: {
              name: response.user.name,
              link: response.user.links.html
            },
            description: response.description,
          }
        });
      }).catch(error => {
          console.error("An unexpected error occurred during your request.", error);
      });
    } else if (!state.img && state.loading === false && process.env.REACT_APP_UNSPLASH_ACCESS_KEY) {
      setState({ ...state, loading: true });
    } else if (!process.env.REACT_APP_UNSPLASH_ACCESS_KEY) {
      console.error("The developer keys for the Unsplash API are missing", process.env);
    }
  }, [state]);

  const classes = useStyles();

  const handleFlipX = () => {
    document.querySelector(".flipper").classList.toggle("flipY");
    document.querySelector('.back div').classList.toggle('flippedY');
  }

  const handleFlipY = () => {
    document.querySelector(".flipper").classList.toggle("flipX");
    document.querySelector('.back div').classList.toggle('flippedX');
  }

  const handleReset = () => {
    document.querySelectorAll(".flipper").forEach(flipper => flipper.setAttribute('class', 'flipper'));
    document.querySelectorAll('.back').forEach(back => back.querySelectorAll('div').forEach(child => child.removeAttribute('class')));
  }

  return (
    <Container className={classes.container}>
      {state.loading === true && !state.img &&
        <Backdrop className={classes.backdrop} open={state.loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      }
      {state.loading === false && state.img && 
        <Grid container justify='center' alignItems='center' style={{ height: 'inherit' }}>
          <Grid item xs={6}>
            <Card className={classes.imgCard}>
              <CardActionArea className='flip-container' ontouchstart='this.classList.toggle("hover");'>
                <div class="flipper">
                  <div 
                    class="front" 
                    style={{ 
                      backgroundImage: `url(${state.img.src})`,
                      backgroundPosition: 'center',
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat'
                     }}
                  >
                  </div>
                  <div class="back">
                    <div style={{ 
                      backgroundImage: `url(${state.img.src})`,
                      backgroundPosition: 'center',
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat'
                     }}></div>
                  </div>
                </div>
              </CardActionArea>
              <CardContent className={classes.imgCardContent}>
                <Typography align='right'>
                  Photo by <a href={state.img.photographer.link} target="_blank" rel="noopener noreferrer">{state.img.photographer.name}</a> on <a href='https://unsplash.com/?utm_source=PicFlip&utm_medium=referral' target="_blank" rel="noopener noreferrer">Unsplash</a>
                </Typography>
              </CardContent>
              <CardActions className={classes.imgCardActions}>
                <Button 
                  variant='outlined' 
                  color='primary' 
                  size='small' 
                  onClick={handleFlipX}
                >
                  Flip Horizontal
                </Button>
                <Button 
                  variant='outlined' 
                  color='primary' 
                  size='small' 
                  onClick={handleFlipY}
                >
                  Flip Vertical
                </Button>
                <Button 
                  variant='outlined' 
                  color='primary' 
                  size='small' 
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </CardActions>
            </Card>            
          </Grid>
        </Grid>
      }
    </Container>
  );
}
