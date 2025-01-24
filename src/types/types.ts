
export interface Card {
    _id: string; // MongoDB uses _id as the unique identifier
    id?: number;
    name: string;
    description: string;
    upvotes: number;
    storypoints: number;
    media: string[];
    isWinner?: boolean; // Optional field for leaderboard calculations
  }

// Add a dummy export to ensure it's treated as a module
export {};
  