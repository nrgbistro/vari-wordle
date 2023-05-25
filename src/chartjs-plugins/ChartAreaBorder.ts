import { AnyObject } from "chart.js/dist/types/basic";
import { Chart } from "chart.js/dist/types/index";

const chartAreaBorder = {
	id: "chartAreaBorder",
	beforeDraw(chart: Chart, args: Object, options: AnyObject) {
		const {
			ctx,
			chartArea: { left, top, width, height },
		} = chart;
		ctx.save();
		ctx.strokeStyle = options.borderColor;
		ctx.lineWidth = options.borderWidth;
		ctx.setLineDash(options.borderDash || []);
		ctx.lineDashOffset = options.borderDashOffset;
		ctx.strokeRect(left, top, width, height);
		ctx.restore();
	},
};

export default chartAreaBorder;
