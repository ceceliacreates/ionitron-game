export type GameScore = {
    score: number;
    rating: string;
    date: string;
  };
  
  export interface GameScoresProvider {
      gameScores: GameScore[];
      addGameScore: (score: number, rating: string) => void;
      clearGameScores: () => void;
    }