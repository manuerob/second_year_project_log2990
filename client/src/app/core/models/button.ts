import { ToolAbs } from './tool-abs';

export interface Button {
  iconName: string;
  helperText?: string;
  helperMp4?: string;
  children?: ToolAbs[];
  managerButton: boolean;
}
