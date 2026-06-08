// @/lib/echarts.ts
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

// enregistre uniquement le strict nécessaire pour le site (Tree-shaking)
echarts.use([BarChart, GridComponent, CanvasRenderer]);

export default echarts;
