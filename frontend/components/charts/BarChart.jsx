import React from "react";
import {
    ChartComponent,
    SeriesCollectionDirective,
    SeriesDirective,
    Inject,
    ColumnSeries,
    Category,
    DataLabel,
} from "@syncfusion/ej2-react-charts";

const BarChart = ({ dataSource, title }) => {
    return (
        <>
            <ChartComponent
                id="charts"
                primaryXAxis={{
                    valueType: "Category",
                    labelIntersectAction: "Rotate45",
                }}
                primaryYAxis={{ labelFormat: "{value}%" }}
                title={title}
            >
                <Inject services={[ColumnSeries, Category, DataLabel]} />
                <SeriesCollectionDirective>
                    <SeriesDirective
                        type="Column"
                        dataSource={dataSource}
                        xName="x"
                        yName="y"
                        name="Market Share"
                        marker={{ dataLabel: { visible: true, position: "Top" } }}
                        pointColorMapping={(args) => args.data.color}
                    />
                </SeriesCollectionDirective>
            </ChartComponent>
        </>
    );
};

export default BarChart;