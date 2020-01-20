import { Button } from '../../core/models/button';

import AdminTool from 'src/app/core/models/admin-tool';
import { Tool } from 'src/app/core/models/tool';
import { ToolAbs } from '../../core/models/tool-abs';
import {
  COLORS_TOOL,
  COLORS_TOOLS as EXPORTED_COLORS_TOOLS,
  ERASER_TOOL,
  FORMS_TOOL,
  FORMS_TOOLS as EXPORTED_FORMS_TOOLS,
  LINES_TOOL,
  LINES_TOOLS as EXPORTED_LINES_TOOLS,
  SELECT_TOOL,
  SETTINGS_TOOL,
  SETTINGS_TOOLS as EXPORTED_SETTINGS_TOOLS,
  STAMP_TOOL,
  TEXT_TOOL,
} from './tools';

enum LignType {
  Continu,
  PointilleTrait,
  PointillePoint,
}
enum JonctionType {
  Continu,
  PointilleTrait,
  PointillePoint,
}
interface Command {
  execute: string;
}
export interface Button {
  iconPath: string;
  active: boolean;
  action: Command;
}

export interface Typeligne {
  name: LignType;
}
export interface Ligne {
  name: LignType;
}
export interface Jonction {
  name: JonctionType;
}
export const LINES_TOOLS: Tool[] = EXPORTED_LINES_TOOLS;
export const FORMS_TOOLS: Tool[] = EXPORTED_FORMS_TOOLS;
export const COLORS_TOOLS: Tool[] = EXPORTED_COLORS_TOOLS;
export const SETTINGS_TOOLS: AdminTool[] = EXPORTED_SETTINGS_TOOLS;
export const TOOLS: ToolAbs[] = [
  SELECT_TOOL,
  FORMS_TOOL,
  LINES_TOOL,
  STAMP_TOOL,
  COLORS_TOOL,
  SETTINGS_TOOL,
  TEXT_TOOL,
  ERASER_TOOL,
];
export enum SettingsEnum {
  HELP,
  EXPORT,
  SAVE,
  EDIT,
  NEWCANVAS,
}
export enum ColorsEnum {
  PIPETTE,
  BUCKET,
  APPLYCOLOR,
}
export enum FormsEnum {
  POLYGON,
  CIRCLE,
  RECTANGLE,
}
export enum LinesEnum {
  PENCIL,
  LINE,
  BRUSH,
  PEN,
  FEATHER,
  SPRAYPAINT,
}
export enum ToolsEnum {
  SELECT,
  FORMS,
  LINES,
  STAMPS,
  COLORS,
  SETTINGS,
  TEXT,
  ERASER,
}
