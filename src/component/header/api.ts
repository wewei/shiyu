export type Invokes = {
  setExpanded: (expanded: boolean) => Promise<void>;
};

export type Messages = {
  didTitleChange: (title: string) => void;
};