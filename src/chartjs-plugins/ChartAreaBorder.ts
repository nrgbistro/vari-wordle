import { Chart } from "chart.js";

const chartAreaBorder = {
	id: "chartAreaBorder",
	beforeDraw(chart: Chart, _args: unknown, options: any) {
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
