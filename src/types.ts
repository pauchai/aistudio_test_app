export interface Game {
  id: string;
  title: string;
  description: string;
  themes: string[];
  duration: string;
  format: 'online' | 'offline' | 'both';
  players: string;
  benefits: string[];
}

export interface RecommendationResponse {
  recommendedGames: {
    gameId?: string;
    title: string;
    reasoning: string;
    matchScore: number;
  }[];
  advice: string;
}
