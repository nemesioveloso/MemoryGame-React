import { useState, useEffect } from 'react';
import { Box, Card, Grid, Typography, CardMedia } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { IconReact } from './ReactSvg'; // Substitua pelo seu ícone

const useStyles = makeStyles({
  container: {
    border: '2px solid #f7f7f7',
    borderRadius: '6px',
    height: 'auto',
    minHeight: '97dvh',
    padding: '16px',
  },
  card: {
    height: '300px',
    width: '200px',
    position: 'relative',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s',
  },
  cardInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    zIndex: 2,
    transform: 'rotateY(0deg)',
  },
  cardBack: {
    transform: 'rotateY(180deg)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Adicione a cor de fundo do verso da carta
  },
});

const imagens = [
  { id: '1', link: 'https://picsum.photos/200/300?random=1' },
  { id: '2', link: 'https://picsum.photos/200/300?random=2' },
  { id: '3', link: 'https://picsum.photos/200/300?random=3' },
  { id: '4', link: 'https://picsum.photos/200/300?random=4' },
  { id: '5', link: 'https://picsum.photos/200/300?random=5' },
  { id: '6', link: 'https://picsum.photos/200/300?random=6' },
  { id: '7', link: 'https://picsum.photos/200/300?random=7' },
  { id: '8', link: 'https://picsum.photos/200/300?random=8' },
];

const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

const createDuplicatedImages = () => {
  return shuffleArray([
    ...imagens,
    ...imagens.map((img) => ({ ...img, id: `${img.id}-copy` })),
  ]);
};

export function MemoryGame() {
  const classes = useStyles();
  const [time, setTime] = useState(65);
  const [revealed, setRevealed] = useState(true);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<string[]>([]);
  const [duplicatedImages, setDuplicatedImages] = useState(createDuplicatedImages);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (time < 0 && !gameOver) {
      setGameOver(true);
      alert('O tempo acabou!');
      resetGame();
    }
  }, [time, gameOver]);

  useEffect(() => {
    const revealTimer = setTimeout(() => {
      setRevealed(false);
    }, 5000);

    return () => clearTimeout(revealTimer);
  }, [duplicatedImages]);

  useEffect(() => {
    if (matchedCards.length === duplicatedImages.length) {
      setTimeout(() => {
        alert('Você venceu!');
        resetGame();
      }, 500);
    }
  }, [matchedCards]);

  const resetGame = () => {
    setTime(66);
    setRevealed(true);
    setMatchedCards([]);
    setFlippedCards([]);
    setDuplicatedImages(createDuplicatedImages());
    setGameOver(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleCardClick = (index: number) => {
    if (!gameOver && flippedCards.length < 2 && !flippedCards.includes(index) && !matchedCards.includes(duplicatedImages[index].id)) {
      setFlippedCards([...flippedCards, index]);

      if (flippedCards.length === 1) {
        const firstIndex = flippedCards[0];
        const secondIndex = index;
        const firstCard = duplicatedImages[firstIndex];
        const secondCard = duplicatedImages[secondIndex];

        if (firstCard.id.replace('-copy', '') === secondCard.id.replace('-copy', '')) {
          setMatchedCards([...matchedCards, firstCard.id, secondCard.id]);
        }

        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <Box p={2}>
      <Grid container justifyContent="space-evenly" p={1} spacing={1} className={classes.container}>
        <Grid item xs={12}>
          <Typography variant="h5" sx={{color: '#f7f7f7'}} textAlign="center">
            Jogo da Memória
          </Typography>
          <Typography variant="h6" sx={{color: '#f7f7f7'}} textAlign='center'>Tempo restante: {formatTime(time)}</Typography>
        </Grid>
        {duplicatedImages.map((imagem, index) => (
          <Grid key={imagem.id} item>
            <div
              className={classes.card}
              style={{ transform: revealed || flippedCards.includes(index) || matchedCards.includes(imagem.id) ? 'rotateY(0deg)' : 'rotateY(180deg)' }}
              onClick={() => handleCardClick(index)}
            >
              <div className={`${classes.cardInner} ${classes.cardFront}`}>
                <CardMedia
                  component="img"
                  image={imagem.link}
                  title={`Imagem ${imagem.id}`}
                  style={{ height: '100%' }}
                />
              </div>
              <div className={`${classes.cardInner} ${classes.cardBack}`} style={{ transform: 'rotateY(180deg)' }}>
                <Card className={classes.card} style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <IconReact />
                </Card>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
