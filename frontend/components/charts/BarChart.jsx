// components/charts/BarChart.js
import React from "react";
import {
    ChartComponent,
    SeriesCollectionDirective,
    SeriesDirective,
    Inject,
    LineSeries,
    Legend,
    DateTime,
    Tooltip,
    DataLabel,
    Category,
    Highlight,
} from "@syncfusion/ej2-react-charts";
// สร้าง Template สำหรับ DataLabel
const createTemplate = (color, label, iconSrc) => (args) => `
  <div style="background-color:${color};border-radius:3px;display:flex;align-items:center;padding:5px;">
    <img src="${iconSrc}" style="width:24px;height:24px;" alt="Icon" />
    <div style="color:white;font-family:Roboto;font-size:14px;margin-left:6px;">
      <span style="color: orange;">${label}: \$${args.point.y}</span>
    </div>
  </div>
`;
const SAMPLE_CSS = `
.control-fluid {
    padding: 0px !important;
}
.charts {
    align :center
}`;

// ใช้ Template สำหรับแต่ละ Series
const BarChart = ({ dataSource, title }) => {
    const a1Template = createTemplate("#00bdae", "Car Model A1");
    const a2Template = createTemplate("#404041", "Car Model A2");

    return (
        <div className="control-pane">
            <style>{SAMPLE_CSS}</style>
            <div className="control-section">
                <ChartComponent
                    id="charts"
                    primaryXAxis={{ interval: 1, valueType: "Category" }}
                    tooltip={{ enable: true, enableHighlight: true }}
                >
                    <Inject
                        services={[LineSeries, Legend, Tooltip, DataLabel, Category]}
                    />
                    <SeriesCollectionDirective>
                        <SeriesDirective
                            dataSource={dataSource.filter((item) => item.group === "atto3")}
                            xName="x"
                            yName="y"
                            width={2}
                            name="atto3"
                            type="Line"

                        ></SeriesDirective>
                        <SeriesDirective
                            dataSource={dataSource.filter((item) => item.group === "dolphin")}
                            xName="x"
                            yName="y"
                            width={2}
                            name="dolphin"
                            type="Line"

                        ></SeriesDirective>
                        <SeriesDirective
                            dataSource={dataSource.filter(item => item.group === 'm6')}
                            xName="x"
                            yName="y"
                            width={2}
                            name="m6"
                            type="Line"

                        ></SeriesDirective>
                        <SeriesDirective
                            dataSource={dataSource.filter(item => item.group === 'seal')}
                            xName="x"
                            yName="y"
                            width={2}
                            name="seal"
                            type="Line"

                        ></SeriesDirective>
                        <SeriesDirective
                            dataSource={dataSource.filter(item => item.group === 'sealion6')}
                            xName="x"
                            yName="y"
                            width={2}
                            name="sealion6"
                            type="Line"

                        ></SeriesDirective>
                        <SeriesDirective
                            dataSource={dataSource.filter(item => item.group === 'sealion7')}
                            xName="x"
                            yName="y"
                            width={2}
                            name="selion7"
                            type="Line"
                        ></SeriesDirective>
                    </SeriesCollectionDirective>
                </ChartComponent>
                ;
            </div>
        </div>
    );
};

export default BarChart;
