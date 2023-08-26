export type GameScore = {
    score: number;
    date: string;
  };
  
  export interface GameScoresProvider {
      gameScores: GameScore[];
      addGameScore: (score: number) => void;
  
    }