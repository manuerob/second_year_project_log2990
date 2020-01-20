import AdminTool from 'src/app/core/models/admin-tool';
import RegularCommandTool from 'src/app/core/models/regular-command-tool';
import { Tool } from 'src/app/core/models/tool';
import { BrushHandlerService } from 'src/app/core/services/shape-service/brush-handler/brush-handler.service';
import { EllipseHandlerService } from 'src/app/core/services/shape-service/ellipse-handler/ellipse-handler.service';
import { EraseHandlerService } from 'src/app/core/services/shape-service/erase-handler/erase-handler.service';
import { FeatherHandlerService } from 'src/app/core/services/shape-service/feather-handler/feather-handler.service';
import { LineHandlerService } from 'src/app/core/services/shape-service/line-handler/line-handler.service';
import { PenHandlerService } from 'src/app/core/services/shape-service/pen-handler/pen-handler.service';
import { PencilHandlerService } from 'src/app/core/services/shape-service/pencil-handler/pencil-handler.service';
import { PipetteHandlerService } from 'src/app/core/services/shape-service/pipette-handler/pipette-handler.service';
import { PolygonHandlerService } from 'src/app/core/services/shape-service/polygon-handler/polygon-handler.service';
import { RectangleHandlerService } from 'src/app/core/services/shape-service/rectangle-handler/rectangle-handler.service';
import { SelectHandlerService } from 'src/app/core/services/shape-service/select-handler/select-handler.service';
import { ShapeHandlerService } from 'src/app/core/services/shape-service/shape-handler/shape-handler.service';
import { SpraypaintHandlerService } from 'src/app/core/services/shape-service/spraypaint-handler/spraypaint-handler.service';
import { StampHandlerService } from 'src/app/core/services/shape-service/stamp-handler/stamp-handler.service';
import { TextHandlerService } from 'src/app/core/services/shape-service/text-handler/text-handler.service';
import { BrushControlsComponent } from '../attributs/controls/brush-controls/brush-controls.component';
import { EraseControlsComponent } from '../attributs/controls/erase-controls/erase-controls/erase-controls.component';
import { FeatherControlsComponent } from '../attributs/controls/feather-controls/feather-controls.component';
import { LineControlsComponent } from '../attributs/controls/line-controls/line-controls.component';
import { PenControlsComponent } from '../attributs/controls/pen-controls/pen-controls.component';
import { PencilControlsComponent } from '../attributs/controls/pencil-controls/pencil-controls.component';
import { PipetteControlsComponent } from '../attributs/controls/pipette-controls/pipette-controls.component';
import { PolygonControlsComponent } from '../attributs/controls/polygon-controls/polygon-controls.component';
import { RectangleControlsComponent } from '../attributs/controls/rectangle-controls/rectangle-controls.component';
import { SelectControlsComponent } from '../attributs/controls/select-controls/select-controls.component';
import { SpraypaintControlsComponent } from '../attributs/controls/spraypaint-controls/spraypaint-controls.component';
import { StampControlsComponent } from '../attributs/controls/stamp-controls/stamp-controls.component';
import { TextControlsComponent } from '../attributs/controls/text-controls/text-controls.component';
import { DrawingComponent } from '../drawing-creator/drawing/drawing.component';
import { EditDrawingComponent } from '../edit-drawing/edit-drawing.component';
import { ExportDrawingComponent } from '../export-drawing/export-drawing/export-drawing.component';
import { SaveDrawingComponent } from '../save-drawing/save-drawing.component';
import { UserGuideWindowComponent } from '../user-guide/user-guide-window/user-guide-window.component';
import { BucketHandlerService } from './../../core/services/shape-service/bucket-handler/bucket-handler.service';
import { BucketControlsComponent } from './../attributs/controls/bucket-controls/bucket-controls.component';

export const SELECT_TOOL: Tool = {
  title: 'select',
  command: new RegularCommandTool('select'),
  button: {
    helperMp4: 'selection.mp4',
    helperText: 'Sélectionner (S)',
    iconName: 'mouse-pointer',
    managerButton: false,
  },
  controlsComponent: SelectControlsComponent,
  service: SelectHandlerService,
};
export const CIRCLE_TOOL: Tool = {
  title: 'circle',
  command: new RegularCommandTool('circle'),
  button: {
    helperText: 'Ellipse (2)',
    helperMp4: 'ellipse.mp4',
    iconName: 'circle',
    managerButton: false,
  },
  controlsComponent: RectangleControlsComponent,
  service: EllipseHandlerService,
};

export const RECTANGLE_TOOL: Tool = {
  title: 'rectangle',
  command: new RegularCommandTool('rectangle'),
  button: {
    helperText: 'Rectangle (1)',
    helperMp4: 'rectangle.mp4',
    iconName: 'square',
    managerButton: false,
  },
  controlsComponent: RectangleControlsComponent,
  service: RectangleHandlerService,
};

export const PENCIL_TOOL: Tool = {
  title: 'pencil',
  command: new RegularCommandTool('pencil'),
  button: {
    helperText: 'Crayon (C)',
    helperMp4: 'pencil.mp4',
    iconName: 'edit-3',
    managerButton: false,
  },
  controlsComponent: PencilControlsComponent,
  service: PencilHandlerService,
};

export const PEN_TOOL: Tool = {
  title: 'pen',
  command: new RegularCommandTool('pen'),
  button: {
    helperText: 'Stylo (Y)',
    helperMp4: 'pen.mp4',
    iconName: 'pen-tool',
    managerButton: false,
  },
  controlsComponent: PenControlsComponent,
  service: PenHandlerService,
};
export const ERASER_TOOL: Tool = {
  title: 'eraser',
  command: new RegularCommandTool('eraser'),
  button: {
    helperText: 'Efface (E)',
    helperMp4: 'eraser.mp4',
    iconName: 'eraser',
    managerButton: false,
  },
  controlsComponent: EraseControlsComponent,
  service: EraseHandlerService,
};

export const BRUSH_TOOL: Tool = {
  title: 'Brush',
  command: new RegularCommandTool('brush'),
  button: {
    helperText: 'Pinceau (W)',
    helperMp4: 'brush.mp4',
    iconName: 'wind',
    managerButton: false,
  },
  controlsComponent: BrushControlsComponent,
  service: BrushHandlerService,
};

export const FEATHER_TOOL: Tool = {
  title: 'Feather',
  command: new RegularCommandTool('feater'),
  button: {
    helperText: 'Plume (P)',
    helperMp4: 'feather.mp4',
    iconName: 'feather',
    managerButton: false,
  },
  controlsComponent: FeatherControlsComponent,
  service: FeatherHandlerService,
};

export const APPLY_COLOR_TOOL: Tool = {
  title: 'apply-color',
  command: new RegularCommandTool('apply-color'),
  button: {
    helperText: 'Changer la couleur (R)',
    helperMp4: 'apply-color.mp4',
    iconName: 'droplet',
    managerButton: false,
  },
  controlsComponent: SelectControlsComponent,
  service: ShapeHandlerService,
};

export const BUCKET_TOOL: Tool = {
  title: 'bucket',
  command: new RegularCommandTool('bucket'),
  button: {
    helperText: 'Sceau de peinture (B)',
    helperMp4: 'bucket.mp4',
    iconName: 'format_color_fill',
    managerButton: false,
  },
  controlsComponent: BucketControlsComponent,
  service: BucketHandlerService,
};

export const PIPETTE_TOOL: Tool = {
  title: 'Pipette',
  command: new RegularCommandTool('pipette'),
  button: {
    helperText: 'Pipette (I)',
    helperMp4: 'color-picker.mp4',
    iconName: 'crosshair',
    managerButton: false,
  },
  controlsComponent: PipetteControlsComponent,
  service: PipetteHandlerService,
};

export const COLORS_TOOLS: Tool[] = [PIPETTE_TOOL, BUCKET_TOOL, APPLY_COLOR_TOOL];

export const COLORS_TOOL: Tool = {
  title: 'forms',
  command: new RegularCommandTool('forms'),
  button: {
    helperText: 'Polygone',
    helperMp4: 'polygon.mp4',
    iconName: 'color_lenspalette',
    managerButton: false,
    children: COLORS_TOOLS,
  },
  controlsComponent: BrushControlsComponent,
  service: RectangleHandlerService,
};

export const STAMP_TOOL: Tool = {
  title: 'stamp',
  command: new RegularCommandTool('stamp'),
  button: {
    helperText: 'Étampe',
    helperMp4: 'stamp.mp4',
    iconName: 'image',
    managerButton: false,
  },
  controlsComponent: StampControlsComponent,
  service: StampHandlerService,
};
export const LINE_TOOL: Tool = {
  title: 'line',
  command: new RegularCommandTool('line'),
  button: {
    helperText: 'Ligne (L)',
    helperMp4: 'line.mp4',
    iconName: 'timeline',
    managerButton: false,
  },
  controlsComponent: LineControlsComponent,
  service: LineHandlerService,
};
export const POLYGON_TOOL: Tool = {
  title: 'polygon',
  command: new RegularCommandTool('polygon'),
  button: {
    helperText: 'Polygone (3)',
    helperMp4: 'polygon.mp4',
    iconName: 'hexagon',
    managerButton: false,
  },
  controlsComponent: PolygonControlsComponent,
  service: PolygonHandlerService,
};

export const TEXT_TOOL: Tool = {
  title: 'text',
  command: new RegularCommandTool('text'),
  button: {
    helperText: 'Texte (T)',
    helperMp4: 'text.mp4',
    iconName: 'type',
    managerButton: false,
  },
  controlsComponent: TextControlsComponent,
  service: TextHandlerService,
};

export const SPRAYPAINT_TOOL: Tool = {
  title: 'spraypaint',
  command: new RegularCommandTool('spraypaint'),
  button: {
    helperText: 'Aérosol (A)',
    helperMp4: 'spraypaint.mp4',
    iconName: 'spray',
    managerButton: false,
  },
  controlsComponent: SpraypaintControlsComponent,
  service: SpraypaintHandlerService,
};

export const FORMS_TOOLS: Tool[] = [POLYGON_TOOL, CIRCLE_TOOL, RECTANGLE_TOOL];
export const FORMS_TOOL: Tool = {
  title: 'forms',
  command: new RegularCommandTool('forms'),
  button: {
    helperText: 'Polygone',
    helperMp4: 'polygon.mp4',
    iconName: 'forms',
    managerButton: false,
    children: FORMS_TOOLS,
  },
  controlsComponent: BrushControlsComponent,
  service: RectangleHandlerService,
};
export const LINES_TOOLS: Tool[] = [
  PENCIL_TOOL,
  LINE_TOOL,
  BRUSH_TOOL,
  PEN_TOOL,
  FEATHER_TOOL,
  SPRAYPAINT_TOOL,
];
export const LINES_TOOL: Tool = {
  title: 'lines',
  command: new RegularCommandTool('lines'),
  button: {
    helperText: 'créér un polygone',
    helperMp4: '',
    iconName: 'gesture',
    managerButton: false,
    children: LINES_TOOLS,
  },
  controlsComponent: BrushControlsComponent,
  service: RectangleHandlerService,
};
export const HELP_TOOL: AdminTool = {
  title: 'quill',
  button: {
    helperText: 'Guide d\'utilisation',
    helperMp4: 'user-guide.mp4',
    iconName: 'help-circle',
    managerButton: true,
  },
  modalComponent: UserGuideWindowComponent,
};
export const SAVE_TOOL: AdminTool = {
  title: 'save',
  button: {
    helperText: 'Sauvegarder (Ctrl-S)',
    helperMp4: 'save.mp4',
    iconName: 'save',
    managerButton: true,
  },
  modalComponent: SaveDrawingComponent,
};
export const EXPORT_TOOL: AdminTool = {
  title: 'export',
  button: {
    helperText: 'Exporter (Ctrl-E)',
    helperMp4: 'export.mp4',
    iconName: 'download',
    managerButton: true,
  },
  modalComponent: ExportDrawingComponent,
};
export const EDIT_TOOL: AdminTool = {
  title: 'edit',
  button: {
    helperText: 'Éditer (Ctrl-G)',
    helperMp4: 'open.mp4',
    iconName: 'collectionsphoto_library',
    managerButton: true,
  },
  modalComponent: EditDrawingComponent,
};

export const NEW_CANVAS_TOOL: AdminTool = {
  title: 'create',
  button: {
    helperText: 'Nouveau (Ctrl-O)',
    helperMp4: 'new.mp4',
    iconName: 'file-plus',
    managerButton: true,
  },
  modalComponent: DrawingComponent,
};

export const SETTINGS_TOOLS: AdminTool[] = [HELP_TOOL, EXPORT_TOOL, SAVE_TOOL, EDIT_TOOL, NEW_CANVAS_TOOL];

export const SETTINGS_TOOL: AdminTool = {
  title: 'settings',
  button: {
    helperText: 'Settings',
    helperMp4: 'open.mp4',
    iconName: 'settings',
    managerButton: true,
    children: SETTINGS_TOOLS,
  },
  modalComponent: UserGuideWindowComponent,
};
