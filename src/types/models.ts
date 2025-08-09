export type Workspace = {
  id: string;
  name: string;
  createdAt?: any;
};

export type Topic = {
  id: string;
  name: string;
  createdAt?: any;
  progress?: number;
  lastTrained?: any;
};

export type Card = {
  id: string;
  front: string;
  back: string;
  createdAt?: any;
  lastResult?: "know" | "dontKnow";
  seenCount?: number;
  knownCount?: number;
  lastAnsweredAt?: any;
};
