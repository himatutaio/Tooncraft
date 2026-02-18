
export interface Character {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  base64: string;
}

export interface Scene {
  id: string;
  prompt: string;
  videoUrl: string;
  status: 'loading' | 'completed' | 'error';
  timestamp: number;
}

export interface AppState {
  characters: Character[];
  scenes: Scene[];
  isApiKeyModalOpen: boolean;
  isKeySelected: boolean;
}
