export type Unit = {
  unitNumber: number;
  sectionNumber?: number;
  title?: string;
  description: string;
  backgroundColor: `bg-${string}`;
  textColor: `text-${string}`;
  borderColor: `border-${string}`;
  tiles: Tile[];
};

export type Tile =
  | {
      type:
        | "star"
        | "dumbbell"
        | "book"
        | "trophy"
        | "fast-forward"
        | "video"
        | "headphones";
      description: string;
    }
  | { type: "treasure" };

export type TileType = Tile["type"];

export const units: readonly Unit[] = [
  {
    unitNumber: 7,
    sectionNumber: 1,
    title: "Use the present tense",
    description: "SECTION 1, UNIT 7",
    backgroundColor: "bg-[#58cc02]",
    textColor: "text-[#58cc02]",
    borderColor: "border-[#46a302]",
    tiles: [
      {
        type: "dumbbell",
        description: "Personalized practice",
      },
      {
        type: "video",
        description: "Watch and learn",
      },
      {
        type: "book",
        description: "Good morning",
      },
      {
        type: "headphones",
        description: "Listening practice",
      },
      {
        type: "star",
        description: "Use the present tense",
      },
      { type: "treasure" },
      {
        type: "video",
        description: "Unit 7 review",
      },
    ],
  },
  {
    unitNumber: 2,
    description: "Get around in a city",
    backgroundColor: "bg-[#ce82ff]",
    textColor: "text-[#ce82ff]",
    borderColor: "border-[#a568cc]",
    tiles: [
      { type: "fast-forward", description: "Get around in a city" },
      { type: "dumbbell", description: "Personalized practice" },
      { type: "book", description: "One thing" },
      { type: "treasure" },
      { type: "star", description: "Get around in a city" },
      { type: "book", description: "A very big family" },
      { type: "star", description: "Greet people" },
      { type: "book", description: "The red jacket" },
      { type: "treasure" },
      { type: "dumbbell", description: "Personalized practice" },
      { type: "trophy", description: "Unit 2 review" },
    ],
  },
  {
    unitNumber: 3,
    description: "Order food and drink",
    backgroundColor: "bg-[#00cd9c]",
    textColor: "text-[#00cd9c]",
    borderColor: "border-[#00a47d]",
    tiles: [
      { type: "fast-forward", description: "Order food and drink" },
      { type: "book", description: "The passport" },
      { type: "star", description: "Order food and drinks" },
      { type: "treasure" },
      { type: "book", description: "The honeymoon" },
      { type: "star", description: "Get around in a city" },
      { type: "treasure" },
      { type: "dumbbell", description: "Personalized practice" },
      { type: "book", description: "Doctor Eddy" },
      { type: "trophy", description: "Unit 2 review" },
    ],
  },
];
