export interface ISvg {
  title: string;
  tags: string[];
  id: string;
  height: number;
  width: number;
  backgroundColor: string;
  shapes: Map<string, string>;
  htmlElement: string;
  createdAt: number;
}
